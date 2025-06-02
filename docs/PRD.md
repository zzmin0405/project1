## PRD: 눈길(Nungil) - 지능형 바이오닉 리딩 플랫폼

### 1. 프로젝트 개요

**프로젝트명**: 눈길(Nungil) - "눈이 가는 길, Eye Road"

**비전**: 한국어와 영어 모두에서 효과적인, AI 기반 맞춤형 바이오닉 리딩 서비스

**핵심 차별점**:
- LLM을 활용한 언어별 최적화된 바이오닉 리딩
- 한국어의 구조적 특성을 고려한 새로운 접근법
- 사용자별 맞춤형 강조 알고리즘

### 2. 기술적 배경 반영사항

**2.1 한국어 특성 고려**
- 한국어는 글자 교환 효과가 제한적이므로, 단순 앞글자 강조가 아닌 **의미 단위 강조** 필요
- 음절 빈도가 높은 경우 제한적 효과가 있으므로, 빈도 기반 강조 적용
- 조사/어미는 약하게, 어근/핵심 의미소는 강하게 처리

**2.2 검증된 원리 적용**
- 고정점(Fixation Point) 생성을 통한 시선 유도
- 전치된 글자 효과(Transposed Letter Effect) 활용 (영어)
- 개인차를 고려한 다양한 강조 수준 제공

### 3. 핵심 기능 재설계

**3.1 지능형 변환 엔진**
```typescript
interface BionicSettings {
  language: 'ko' | 'en' | 'auto';
  intensity: 'light' | 'medium' | 'strong';
  koreanMode: 'syllable' | 'morpheme' | 'hybrid'; // 한국어 전용
  userProfile?: 'general' | 'adhd' | 'dyslexia';
}
```

**3.2 Gemini 프롬프트 개선안**
```
당신은 바이오닉 리딩 전문가입니다. 언어학적 특성을 고려하여 최적화된 변환을 수행합니다.

## 한국어 변환 규칙:
1. 음절 빈도가 높은 부분을 우선 강조
2. 어근과 핵심 의미소는 강하게 표시
3. 조사와 어미는 최소한으로 강조
4. 2-3음절 단어는 첫 음절만 강조
5. 4음절 이상은 의미 단위로 분할하여 강조

## 영어 변환 규칙:
1. 단어 길이에 따라 40-60% 강조
2. 기능어(전치사, 관사)는 약하게
3. 내용어(명사, 동사)는 강하게
4. 복합어는 각 구성요소별로 처리

## 출력 형식:
- HTML <b> 태그 사용
- 예시: 
  한국어: "난독증 아동을 위한" → "<b>난독</b>증 <b>아동</b>을 위한"
  영어: "bionic reading" → "<b>bio</b>nic <b>read</b>ing"
```

**3.3 사용자 맞춤 설정**
- **일반 사용자**: 표준 바이오닉 리딩
- **ADHD 사용자**: 더 강한 시각적 대비, 짧은 문단 분할
- **난독증 사용자**: 음절 단위 강조, 느린 진행

### 4. Supabase 스키마 개선

```sql
-- 사용자 프로필 (익명 가능)
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_type TEXT DEFAULT 'general',
  preferred_settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 변환 효과성 피드백
CREATE TABLE conversion_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_text TEXT,
  converted_text TEXT,
  settings JSONB,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  reading_time_seconds INTEGER,
  user_profile_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 언어별 최적화 규칙 (관리자용)
CREATE TABLE optimization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  rule_content JSONB NOT NULL,
  effectiveness_score FLOAT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. MVP 구현 우선순위

**Phase 1 - 핵심 변환 기능**
1. Gemini API 연동 및 기본 변환
2. 한국어/영어 자동 감지
3. 강도 조절 기능 (3단계)
4. 실시간 미리보기

**Phase 2 - 사용자 경험 개선**
1. 프로필 기반 맞춤 설정
2. 읽기 훈련 모드 (단계별 콘텐츠)
3. 효과성 피드백 수집
4. 다크모드/고대비 모드

**Phase 3 - 고급 기능**
1. 음성 읽기 연동 (TTS)
2. PDF/EPUB 변환 지원
3. 브라우저 확장 프로그램
4. 읽기 속도 측정 및 통계

### 6. 성능 측정 지표

**정량적 지표**
- 평균 변환 시간
- 사용자 체류 시간
- 재방문율
- 피드백 평점

**정성적 지표**
- 사용자 피드백 분석
- 언어별 효과성 비교
- 프로필별 만족도

### 7. 차별화 전략

**7.1 한국어 최적화**
- 기존 서비스들의 한국어 지원 한계 극복
- 형태소 분석 기반 의미 단위 강조
- 한국어 읽기 패턴 연구 반영

**7.2 과학적 접근**
- 사용자 피드백 데이터 수집 및 분석
- A/B 테스트를 통한 지속적 개선
- 학술 연구 결과 반영

**7.3 접근성 중심**
- 무료 서비스 제공 (Gemini 무료 티어 활용)
- 모바일 최적화
- 오프라인 모드 지원 (PWA)
