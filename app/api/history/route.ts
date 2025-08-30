import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  try {
    const { data: summaries, error } = await supabase
      .from('summaries')
      .select('id, title, created_at') // 목록에서는 가벼운 정보만 선택
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('History 조회 오류:', error);
      return NextResponse.json({ error: '기록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json(summaries);

  } catch (error) {
    console.error('/api/history 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: '기록 조회 중 서버에서 오류가 발생했습니다.', details: errorMessage }, { status: 500 });
  }
}
