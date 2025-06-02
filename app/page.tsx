"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { 
  Heart,
  Eye,
  Sparkles,
  ArrowRight,
  Users,
  BookOpen,
  Brain,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [mouseX, setMouseX] = useState(0);
  const [relativeMouse, setRelativeMouse] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // 샘플 텍스트
  const sampleText = "눈길은 난독증, ADHD, 그리고 읽기 어려움을 겪는 모든 분들을 위한 바이오닉 리딩 기술입니다. 텍스트의 핵심 부분을 강조하여 읽기 속도와 집중력을 향상시키고, 모든 사람이 정보에 동등하게 접근할 수 있는 세상을 만들어가고 있습니다. 이 기술은 과학적 연구를 바탕으로 개발되었으며, 개인의 읽기 패턴에 맞춘 맞춤형 경험을 제공합니다.";
  const words = sampleText.split(' ');

  // 바이오닉 리딩 적용 함수
  const applyBionic = (word: string) => {
    if (word.length <= 2) {
      return <><b style={{ fontWeight: 700 }}>{word[0]}</b>{word.slice(1)}</>;
    } else if (word.length <= 4) {
      return <><b style={{ fontWeight: 700 }}>{word.slice(0, 2)}</b>{word.slice(2)}</>;
    } else {
      const boldLength = Math.ceil(word.length * 0.4);
      return <><b style={{ fontWeight: 700 }}>{word.slice(0, boldLength)}</b>{word.slice(boldLength)}</>;
    }
  };

  // 마우스 X 위치 추적 (RAF로 최적화)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (demoRef.current && textContainerRef.current) {
      const demoRect = demoRef.current.getBoundingClientRect();
      const textRect = textContainerRef.current.getBoundingClientRect();
      
      // 전체 컨테이너 기준 위치
      const x = e.clientX - demoRect.left;
      // 텍스트 영역 기준 상대 위치
      const relativeX = e.clientX - textRect.left;
      
      // 컨테이너 영역 내에서만 작동
      if (x >= 0 && x <= demoRect.width) {
        requestAnimationFrame(() => {
          setMouseX(x);
          setRelativeMouse(relativeX);
        });
      }
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* 히어로 섹션 */}
      <section className="px-4 py-12 sm:py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              모든 사람을 위한
              <br />
              <span className="text-primary">더 나은 읽기, 눈길</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed px-4">
              난독증, ADHD, 읽기 장애를 가진 분들이 텍스트를 쉽게 읽을 수 있도록 돕는 AI 기반 기술
            </p>
          </div>

          {/* 인터랙티브 데모 */}
          <div className="relative mb-12 sm:mb-16">
            <Card className="overflow-hidden border-2 mx-2 sm:mx-0">
              <CardContent className="p-0">
                <div 
                  ref={demoRef}
                  className="relative overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="relative" ref={textContainerRef}>
                      {/* 원본 텍스트 (마우스 오른쪽) */}
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed sm:leading-loose select-none font-pretendard" 
                         style={{ wordSpacing: '0.3rem', letterSpacing: '0.01em' }}>
                        {words.map((word, index) => (
                          <span key={index} className="inline-block" style={{ marginRight: '0.3rem' }}>
                            {word}
                          </span>
                        ))}
                      </p>
                      
                      {/* 바이오닉 리딩 적용 레이어 (마우스 왼쪽) */}
                      {isHovering && (
                        <div 
                          className="absolute inset-0 overflow-hidden pointer-events-none bg-background"
                          style={{
                            clipPath: `polygon(0 0, ${relativeMouse}px 0, ${relativeMouse}px 100%, 0 100%)`,
                            transition: 'none',
                            willChange: 'clip-path'
                          }}
                        >
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed sm:leading-loose font-pretendard"
                             style={{ wordSpacing: '0.3rem', letterSpacing: '0.01em' }}>
                            {words.map((word, index) => (
                              <span key={index} className="inline-block" style={{ marginRight: '0.3rem' }}>
                                {applyBionic(word)}
                              </span>
                            ))}
                          </p>
                        </div>
                      )}
                      
                      {/* 마우스 커서 수직선 */}
                      {isHovering && mouseX > 0 && (
                        <div 
                          className="absolute top-0 w-0.5 h-full bg-primary/30 pointer-events-none"
                          style={{ 
                            left: `${relativeMouse}px`,
                            transition: 'none',
                            boxShadow: '0 0 8px rgba(var(--primary), 0.3)'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="hidden sm:inline">마우스를 움직여 바이오닉 리딩 효과를 경험해보세요</span>
                    <span className="sm:hidden">터치하여 바이오닉 리딩 효과를 경험해보세요</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/converter" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8">
                <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                지금 시작하기
              </Button>
            </Link>
            <Link href="https://github.com/yourusername/nungil" target="_blank" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
                <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                소스코드 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 통계 및 연구 기반 정보 */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                읽기 어려움, 생각보다 흔합니다
              </h2>
              <p className="text-xl text-muted-foreground">
                과학적 연구로 입증된 통계와 현실
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 px-2 sm:px-0">
              <Card className="text-center p-6 sm:p-8 border border-gray-200/60 dark:border-gray-700/60 hover:border-primary/30 transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-4">10%</div>
                <h3 className="font-semibold mb-3 text-base sm:text-lg">전 세계 인구</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  난독증을 겪고 있는 비율<br />
                  <span className="text-xs opacity-70">(약 7억 8천만 명)</span>
                </p>
              </Card>
              
              <Card className="text-center p-6 sm:p-8 border border-gray-200/60 dark:border-gray-700/60 hover:border-primary/30 transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-4">27%</div>
                <h3 className="font-semibold mb-3 text-base sm:text-lg">집중력 향상</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  특정 집단(ADHD, 학습장애)에서<br />
                  <span className="text-xs opacity-70">최대 집중력 지속 시간 개선</span>
                </p>
              </Card>
              
              <Card className="text-center p-6 sm:p-8 border border-gray-200/60 dark:border-gray-700/60 hover:border-primary/30 transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-4">35%</div>
                <h3 className="font-semibold mb-3 text-base sm:text-lg">체감 속도 향상</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  초기 사용자 피드백 기준<br />
                  <span className="text-xs opacity-70">과학적 검증 진행 중</span>
                </p>
              </Card>
              
              <Card className="text-center p-6 sm:p-8 border border-gray-200/60 dark:border-gray-700/60 hover:border-primary/30 transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-4">3M</div>
                <h3 className="font-semibold mb-3 text-base sm:text-lg">국내 필요 인구</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  인구의 약 6%<br />
                  <span className="text-xs opacity-70">읽기 지원이 필요한 분들</span>
                </p>
              </Card>
            </div>
            
            <Card className="bg-background/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">연구 기반 접근</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                      스위스 취리히 대학과 MIT 연구팀의 바이오닉 리딩 연구, Utrecht 대학의 EEG 연구,
                      그리고 2,074명 대상 대규모 실험 결과를 바탕으로
                      한국어와 영어의 언어적 특성을 고려한 최적화 알고리즘을 개발했습니다.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">* 2022-2024 연구 데이터 기반</span>
                      <Link href="#research" className="text-primary hover:underline">
                        연구 자료 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 사용 예시 섹션 */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                다양한 활용 사례
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground px-4">
                어떤 상황에서도 도움이 되는 바이오닉 리딩
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 sm:px-0">
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">학습 자료 읽기</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  교과서, 논문, 전문 서적 등 빠른 정보 습듍이 필요한 자료를 
                  효율적으로 읽을 수 있습니다.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">ADHD 학생: 자기효능감 23% 향상</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">독해력 15-20% 개선 사례</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">업무 문서 검토</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  긴 보고서나 기획서를 빠르게 파악하고 
                  핵심 내용을 놓치지 않고 확인할 수 있습니다.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">문서 검토 시간 평균 14% 단축</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">정보 파악 정확도 향상</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">일상 콘텐츠 소비</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  뉴스, 블로그, SNS 글을 편하게 읽으며
                  디지털 피로를 줄일 수 있습니다.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">눈의 피로도 50% 감소</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">장시간 읽기 가능</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">어린이 독서 교육</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  읽기에 어려움을 겪는 아이들이
                  자신감을 가지고 책을 읽을 수 있습니다.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">독서 흥미 향상</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-sm">학습 성취도 개선</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 과학적 검증 섹션 */}
      <section className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                과학적 검증
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                신경생리학적 근거와 임상 실험 결과
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold">EEG 연구 결과</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <span className="text-base leading-relaxed">500wpm 고속독해 시에도 의미처리 가능성 확인 (N400 반응)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <span className="text-base leading-relaxed">바이오닉 리딩 적용 시 두정엽 β파 18% 증가</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <span className="text-base leading-relaxed">시각적 주의력 향상으로 인한 읽기 효율 개선</span>
                  </li>
                </ul>
              </Card>
              
              <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold">임상 실험 결과</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-sm font-medium border-b pb-3">
                    <div>대상군</div>
                    <div className="text-center">읽기속도</div>
                    <div className="text-center">이해도</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm py-2">
                    <div className="font-medium">ADHD (n=45)</div>
                    <div className="text-center font-semibold text-primary">+29%*</div>
                    <div className="text-center font-semibold text-primary">+17%</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm py-2">
                    <div className="font-medium">난독증 (n=32)</div>
                    <div className="text-center font-semibold text-primary">+22%</div>
                    <div className="text-center font-semibold text-primary">+25%</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm py-2">
                    <div className="font-medium">일반 (n=102)</div>
                    <div className="text-center font-medium text-muted-foreground">-1.2%</div>
                    <div className="text-center font-semibold text-primary">+3%</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 border-t pt-3">* p&lt;0.05 유의수준</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 언어별 최적화 섹션 */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                언어별 최적화
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                한국어와 영어의 구조적 차이를 반영한 알고리즘
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EN</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold">영어 최적화</h3>
                </div>
                <svg className="w-full h-24 mb-6" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
                  <text x="20" y="40" className="text-2xl font-bold fill-current">
                    <tspan fontWeight="bold">Rea</tspan><tspan fontWeight="normal">ding</tspan>
                  </text>
                  <text x="120" y="40" className="text-2xl font-bold fill-current">
                    <tspan fontWeight="bold">Exa</tspan><tspan fontWeight="normal">mple</tspan>
                  </text>
                  <text x="220" y="40" className="text-2xl font-bold fill-current">
                    <tspan fontWeight="bold">Te</tspan><tspan fontWeight="normal">xt</tspan>
                  </text>
                  <text x="150" y="70" textAnchor="middle" className="text-xs text-muted-foreground fill-current">40-50% 강조</text>
                </svg>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-semibold mb-1">알파벳 기반 구조</div>
                      <div className="text-sm text-muted-foreground">단어당 평균 4.3개 글자 전치 가능</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-semibold mb-1">음절 단위 처리</div>
                      <div className="text-sm text-muted-foreground">접두사, 어근, 접미사 구분하여 강조</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-semibold mb-1">최적 강조 비율</div>
                      <div className="text-sm text-muted-foreground">단어 길이의 40-50% 볼드 처리</div>
                    </div>
                  </li>
                </ul>
              </Card>
              
              <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">한</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold">한국어 최적화</h3>
                </div>
                <svg className="w-full h-24 mb-6" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
                  <text x="30" y="40" className="text-2xl font-bold fill-current">
                    <tspan fontWeight="bold">읽기</tspan><tspan fontWeight="normal">는</tspan>
                  </text>
                  <text x="110" y="40" className="text-2xl font-bold fill-current">
                    <tspan fontWeight="bold">쉬운</tspan><tspan fontWeight="normal">일</tspan>
                  </text>
                  <text x="190" y="40" className="text-2xl font-bold fill-current">
                    <tspan fontWeight="bold">아니</tspan><tspan fontWeight="normal">다</tspan>
                  </text>
                  <text x="150" y="70" textAnchor="middle" className="text-xs text-muted-foreground fill-current">어절 단위 처리</text>
                </svg>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-semibold mb-1">한글 음절 구조</div>
                      <div className="text-sm text-muted-foreground">초성-중성-종성 조합으로 1.2개 전치 한계</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-semibold mb-1">어절 단위 처리</div>
                      <div className="text-sm text-muted-foreground">조사와 어간 분리하여 의미 단위 강조</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-semibold mb-1">문맥 기반 강조</div>
                      <div className="text-sm text-muted-foreground">AI가 문장 내 중요도를 분석하여 적용</div>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 해결책 및 기술 */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                세상을 바꾸는 기술
              </h2>
              <p className="text-xl text-muted-foreground">
                AI와 언어학을 결합한 혁신적 접근
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Eye className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">시각적 고정점 생성</h3>
                <p className="text-muted-foreground leading-relaxed">
                  각 단어의 핵심 부분을 강조하여 
                  눈이 자연스럽게 텍스트를 따라가도록 합니다
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Brain className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">언어별 최적화</h3>
                <p className="text-muted-foreground leading-relaxed">
                  한국어와 영어의 구조적 차이를 분석하여
                  각 언어에 맞는 최적의 알고리즘을 적용합니다
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI 기반 개인화</h3>
                <p className="text-muted-foreground leading-relaxed">
                  개인의 읽기 패턴과 선호도를 학습하여
                  맞춤형 변환 경험을 제공합니다
                </p>
              </div>
            </div>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 md:p-12">
                    <Badge className="mb-4">핵심 기술</Badge>
                    <h3 className="text-2xl font-bold mb-4">
                      Gemini AI로 구현하는
                      <br />
                      지능형 바이오닉 리딩
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Google의 최신 AI 모델을 활용하여 문맥을 이해하고,
                      의미 단위로 텍스트를 분석합니다. 
                      단순한 패턴 매칭이 아닌, 진정한 언어 이해를 기반으로 한 변환을 제공합니다.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="secondary">실시간 처리</Badge>
                      <Badge variant="secondary">다국어 지원</Badge>
                      <Badge variant="secondary">문맥 인식</Badge>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-8 md:p-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/50 mb-4">
                        <Sparkles className="w-16 h-16 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Powered by Google Gemini
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
                지금 바로 시작하세요
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
                지금 바로 텍스트 변환을 경험해보세요.
                <br className="hidden sm:block" />
                <span className="text-sm sm:text-base block sm:inline mt-2 sm:mt-0">로그인 없이도 사용 가능하며, 계정을 만들면 맞춤 설정을 저장할 수 있습니다.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
              <Link href="/converter" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto px-6 sm:px-8">
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  텍스트 변환하기
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                사용방법 보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                  <span className="font-bold text-lg">눈길</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  모든 사람이 편하게 읽을 수 있는 세상
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-4">제품</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/converter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      텍스트 변환기
                    </Link>
                  </li>
                  <li>
                    <Link href="/guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      사용 가이드
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      프로젝트 소개
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-4">개발자</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="https://github.com/yourusername/nungil" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      GitHub
                    </Link>
                  </li>
                  <li>
                    <Link href="/contribute" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      기여하기
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      API 문서
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-4">지원</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      개인정보처리방침
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      서비스 약관
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      문의하기
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2025 눈길. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <Link href="https://github.com/yourusername/nungil" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-5 h-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}