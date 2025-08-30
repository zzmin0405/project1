import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 요약 기록 저장을 전담하는 API
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  try {
    const { original_content, summary_content, bionic_content } = await request.json();

    if (!original_content) {
      return NextResponse.json({ error: '저장할 원본 내용이 없습니다.' }, { status: 400 });
    }

    const autoTitle = original_content.substring(0, 30) + (original_content.length > 30 ? '...' : '');

    const { data, error } = await supabase.from('summaries').insert({
      user_id: user.id,
      title: autoTitle,
      original_content: original_content,
      summary_content: summary_content,
      bionic_content: bionic_content,
    }).select().single(); // 저장된 데이터를 반환받음

    if (error) {
      console.error('DB 저장 오류:', error);
      return NextResponse.json({ error: '데이터베이스 저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ message: '성공적으로 저장되었습니다.', summary: data });

  } catch (error) {
    console.error('/api/summaries 오류:', error);
    return NextResponse.json({ error: '저장 중 서버에서 오류가 발생했습니다.' }, { status: 500 });
  }
}
