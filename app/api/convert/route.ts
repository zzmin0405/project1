import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. API 키 관리 로직 (gemini/client.ts에서 가져옴)
const apiKeys = (process.env.GEMINI_API_KEYS || '').split(',').filter(k => k.trim());
if (apiKeys.length === 0) {
  console.error('Gemini API keys not found in .env.local. Please set GEMINI_API_KEYS.');
}
const currentKeyIndex = 0;

const getGenAIClient = () => {
  if (apiKeys.length === 0) throw new Error('No Gemini API keys configured.');
  const apiKey = apiKeys[currentKeyIndex];
  return new GoogleGenerativeAI(apiKey);
};



// 2. 언어 및 강도 규칙 (gemini/client.ts에서 가져옴)
function detectLanguage(text: string): 'ko' | 'en' {
  const koreanRegex = /[가-힣]/;
  return koreanRegex.test(text) ? 'ko' : 'en';
}

const intensityRules = {
  ko: {
    light: '- 전체 단어의 약 40-50%만 강조',
    medium: '- 전체 단어의 약 60-70%만 강조',
    strong: '- 전체 단어의 약 70-80%만 강조',
  },
  en: {
    light: '- Emphasize about 20-30% of words',
    medium: '- Emphasize about 40-50% of words',
    strong: '- Emphasize about 60-70% of words',
  },
};

// 3. 스트리밍을 위한 Edge Runtime 설정
export const config = {
  runtime: 'edge',
};

interface RequestBody {
  text: string;
  settings: {
    intensity: 'light' | 'medium' | 'strong';
    language: 'ko' | 'en' | 'auto';
  };
}

// 4. 스트리밍 POST 핸들러
export async function POST(request: NextRequest) {
  try {
    const { text, settings } = await request.json() as RequestBody;

    if (!text) {
      return new Response('텍스트가 필요합니다.', { status: 400 });
    }
    if (!settings) {
      return new Response('변환 설정이 필요합니다.', { status: 400 });
    }

    const detectedLanguage = settings.language === 'auto' ? detectLanguage(text) : settings.language;
    const intensityRule = intensityRules[detectedLanguage][settings.intensity];
    
    const prompt = detectedLanguage === 'ko' ? `
텍스트 읽기를 돕기 위해 일부 단어의 앞부분만 굵게 만들어주세요.

규칙:
- 중요한 명사와 동사의 앞부분에만 <b> 태그 추가
- 조사(은/는/이/가/을/를/에/서/로 등)는 굵게 하지 않음
- 접속사, 부사, 짧은 단어(1-2글자)는 굵게 하지 않음
${intensityRule}

좋은 예시:
입력: 기능 목적으로 사용되는 쿠키 및 이와 유사한 기술
출력: <b>기능</b> <b>목적</b>으로 <b>사용</b>되는 <b>쿠키</b> 및 이와 <b>유사</b>한 <b>기술</b>

텍스트:
${text}

결과:` : `
Help improve text readability by making the beginning of important words bold.

Rules:
- Add <b> tags to the first part of important nouns and verbs only
- Skip articles (a, an, the), prepositions, and short words
${intensityRule}

Good example:
Input: Users can access basic features of the service
Output: <b>Use</b>rs can <b>acc</b>ess <b>bas</b>ic <b>feat</b>ures of the <b>ser</b>vice

Text:
${text}

Result:`;

    const genAI = getGenAIClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContentStream(prompt);

    // Gemini API의 스트림을 클라이언트로 직접 전달하는 새로운 스트림 생성
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          // Gemini가 생성하는 마크다운 래퍼 제거
          const cleanedText = text.replace(/```html\n?/g, '').replace(/```\n?/g, '');
          controller.enqueue(encoder.encode(cleanedText));
        }
        controller.close();
      },
      cancel() {
        console.log("Stream cancelled by client.");
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('/api/convert streaming error:', error);
    // 스트리밍 에러는 다른 방식으로 처리해야 함
    return new Response('AI 변환 중 서버에서 오류가 발생했습니다.', { status: 500 });
  }
}