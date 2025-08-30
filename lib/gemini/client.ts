import { GoogleGenerativeAI } from '@google/generative-ai';


// 1. 키 관리 로직
const apiKeys = (process.env.GEMINI_API_KEYS || '').split(',').filter(k => k.trim());
if (apiKeys.length === 0) {
  console.error('Gemini API keys not found in .env.local. Please set GEMINI_API_KEYS.');
}

let currentKeyIndex = 0;

/**
 * 현재 활성화된 API 키로 GoogleGenerativeAI 클라이언트 인스턴스를 가져옵니다.
 */
const getGenAIClient = () => {
  if (apiKeys.length === 0) {
    throw new Error('No Gemini API keys configured.');
  }
  const apiKey = apiKeys[currentKeyIndex];
  return new GoogleGenerativeAI(apiKey);
};

/**
 * 다음 API 키로 순환시킵니다. 사용량 초과 오류 발생 시 호출됩니다.
 */
const rotateKey = () => {
  if (apiKeys.length > 1) {
    const oldKeyIndex = currentKeyIndex;
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.log(`Gemini API key quota likely exceeded. Rotated from key index ${oldKeyIndex} to ${currentKeyIndex}.`);
  } else {
    console.warn('Gemini API key quota likely exceeded, but no other keys to rotate to.');
  }
};

/**
 * API 호출을 재시도하는 로직을 포함한 래퍼 함수
 * @param apiCall API를 호출하는 실제 함수
 * @param retries 남은 재시도 횟수
 */
async function resilientApiCall<T>(apiCall: (client: GoogleGenerativeAI) => Promise<T>, retries = apiKeys.length): Promise<T> {
  if (apiKeys.length === 0) {
    throw new Error('Cannot make API call without API keys.');
  }

  try {
    const client = getGenAIClient();
    return await apiCall(client);
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = String(error);
    }

    const isQuotaError = (errorMessage && (errorMessage.includes('429') || /quota|exhausted/i.test(errorMessage))) || /quota|exhausted/i.test(String(error));

    if (isQuotaError && retries > 0) {
      console.warn(`Quota error detected. Retrying with the next key. Retries left: ${retries - 1}`);
      rotateKey();
      const nextClient = getGenAIClient();
      return await apiCall(nextClient);
    } else {
      throw error;
    }
  }
}


// --- 기존 함수들을 새로운 resilientApiCall 래퍼로 수정 ---

// 언어 감지
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

export async function convertToBionic(
  text: string, 
  settings: {
    intensity: 'light' | 'medium' | 'strong';
    language: 'ko' | 'en' | 'auto';
  }
) {
  return resilientApiCall(async (genAI) => {
    const detectedLanguage = settings.language === 'auto' ? detectLanguage(text) : settings.language;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    let convertedText = response.text();
    
    convertedText = convertedText.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    convertedText = convertedText.replace(/^\s*/, '').replace(/\s*$/, '');
    
    return convertedText;
  });
}

export async function extractTextFromPdf(fileBuffer: Buffer, mimeType: string) {
  return resilientApiCall(async (genAI) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });
    const prompt = "PDF에서 텍스트를 원본과 동일하게 추출합니다. 단, 문장별로 줄을 바꿔 가독성을 높이고, 논리적으로 연결된 문장들은 문단으로 그룹화해주세요. 내용의 정확성이 가장 중요합니다.절대로 원본 내용이 훼손 되어서는 안됩니다.";
    
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: fileBuffer.toString("base64"), mimeType: mimeType } },
    ]);
    return result.response.text();
  });
}

export async function summarizeText(text: string) {
  return resilientApiCall(async (genAI) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `아래 텍스트를 한국어로 3개의 핵심 불렛포인트(•)로 요약해줘.\n\n텍스트:\n${text}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  });
}
