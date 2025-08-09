import { NextResponse } from 'next/server';
import { summarizeText } from '@/lib/gemini/client';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: '요약할 텍스트가 없습니다.' }, { status: 400 });
    }

    const summary = await summarizeText(text);

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('/api/summarize 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: '텍스트 요약 중 서버에서 오류가 발생했습니다.', details: errorMessage }, { status: 500 });
  }
}
