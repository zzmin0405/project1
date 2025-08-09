import { NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/gemini/client';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 1. 파일 타입 검증 (서버 측)
    if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'PDF 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 2. 파일 크기 제한
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json({ error: `파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.` }, { status: 413 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const extractedText = await extractTextFromPdf(fileBuffer, file.type);

    // 3. 추출된 텍스트 검증
    if (!extractedText || extractedText.trim() === '') {
        return NextResponse.json({ text: '', message: 'PDF에서 텍스트를 추출할 수 없습니다. 이미지로만 구성되었거나 내용이 없는 파일일 수 있습니다.' });
    }

    return NextResponse.json({ text: extractedText });

  } catch (error) {
    console.error('/api/extract-pdf 오류:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: 'PDF 처리 중 서버에서 오류가 발생했습니다.', details: errorMessage }, { status: 500 });
  }
}
