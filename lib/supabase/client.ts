import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// New functions for user preferences
export async function getUserPreferences(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('font_size, text_color')
    .eq('user_id', userId)
    .limit(1) // 중복 데이터가 있더라도 1개만 가져오도록 제한
    .maybeSingle(); // 데이터가 없어도 오류를 발생시키지 않음

  if (error) { // .maybeSingle()은 결과가 없어도 오류로 처리하지 않으므로, 다른 종류의 오류만 확인
    console.error('Error fetching user preferences:', error);
    return null;
  }
  return data;
}

export async function updateUserPreferences(userId: string, preferences: { font_size?: string, text_color?: string }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(
      { user_id: userId, ...preferences },
      { onConflict: 'user_id' }
    )
    .select();

  if (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
  return data;
}