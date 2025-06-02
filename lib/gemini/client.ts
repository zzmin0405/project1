import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function convertToBionic(
  text: string, 
  settings: {
    intensity: 'light' | 'medium' | 'strong';
    language: 'ko' | 'en' | 'auto';
  }
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `
당신은 바이오닉 리딩 전문가입니다. 다음 텍스트를 바이오닉 리딩 형식으로 변환하세요.

설정:
- 강도: ${settings.intensity}
- 언어: ${settings.language === 'auto' ? '자동 감지' : settings.language}

한국어 규칙:
1. 2-3음절 단어: 첫 음절만 강조
2. 4음절 이상: 의미 단위로 나누어 각 단위의 첫 부분 강조
3. 조사와 어미는 강조하지 않음
4. 명사와 동사의 어근 위주로 강조

영어 규칙:
1. 짧은 단어(2-3글자): 첫 글자만
2. 중간 길이(4-7글자): 40-50% 강조
3. 긴 단어(8글자 이상): 첫 3-4글자 강조
4. 관사, 전치사는 최소 강조

강조 부분은 HTML <b> 태그로 감싸주세요.

텍스트:
${text}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('변환 중 오류가 발생했습니다.');
  }
}