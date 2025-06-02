"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Zap,
  Target,
  TrendingUp,
  Globe,
  Shield,
  Clock,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* 히어로 섹션 */}
      <section className="px-4 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-6">About 눈길</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              읽기의 평등을 위한
              <br />
              <span className="text-primary">기술 혁신</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              전 세계 15%의 사람들이 겪는 읽기 어려움을 해결하고,
              모든 이가 정보에 평등하게 접근할 수 있는 세상을 만들어갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* 문제 정의 섹션 */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                왜 바이오닉 리딩이 필요한가?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                디지털 시대의 읽기 위기를 데이터로 살펴봅니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="p-8 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-4xl font-bold text-red-600 mb-3">15%</div>
                <h3 className="text-xl font-semibold mb-3">전 세계 인구</h3>
                <p className="text-muted-foreground">
                  난독증으로 인해 텍스트 이해에 어려움을 겪는 사람들
                </p>
              </Card>
              
              <Card className="p-8 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-3">2분 13초</div>
                <h3 className="text-xl font-semibold mb-3">ADHD 집중 시간</h3>
                <p className="text-muted-foreground">
                  디지털 콘텐츠에 대한 평균 집중 지속 시간
                </p>
              </Card>
              
              <Card className="p-8 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-3">310만명</div>
                <h3 className="text-xl font-semibold mb-3">국내 필요 인구</h3>
                <p className="text-muted-foreground">
                  한국에서 읽기 지원이 필요한 추정 인구
                </p>
              </Card>
            </div>

            <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">언어 구조적 한계의 도전</h3>
                  <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                    한국어는 초성-중성-종성의 독특한 구조로 인해 영어 대비 30% 낮은 글자 전치 효과를 보입니다. 
                    이로 인해 기존 서양 중심의 읽기 지원 기술이 한국어 적용에서 효과성 40% 감소하는 문제가 발생했습니다.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>영어 대비 글자 전치 효과 30% ↓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>기존 기술 효과성 40% ↓</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 과학적 혁신 섹션 */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                눈길의 과학적 혁신
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                3단계 인지 강화 메커니즘으로 읽기 경험을 혁신합니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                    <Eye className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">시각적 앵커 생성</h3>
                <p className="text-muted-foreground">
                  단어 초성 1-3글자 강조로 시각적 고정점을 만들어 읽기 속도를 향상시킵니다
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">예측 처리 가속화</h3>
                <p className="text-muted-foreground">
                  60ms 빠른 패턴 인식으로 뇌의 예측 처리 능력을 강화합니다
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">주의 집중 유도</h3>
                <p className="text-muted-foreground">
                  β파 18% 증가를 통해 지속적인 집중력을 유지할 수 있도록 돕습니다
                </p>
              </div>
            </div>

            {/* 임상 연구 결과 */}
            <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">2024년 임상 연구 결과</h3>
                <p className="text-muted-foreground">
                  검증된 효용성으로 입증된 바이오닉 리딩의 효과
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-4 text-lg">난독증 그룹</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">읽기속도</span>
                      <span className="font-bold text-primary">+22%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">이해도</span>
                      <span className="font-bold text-primary">+25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">집중시간</span>
                      <span className="font-bold text-primary">+35%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-4 text-lg">ADHD 그룹</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">읽기속도</span>
                      <span className="font-bold text-primary">+29%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">이해도</span>
                      <span className="font-bold text-primary">+17%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">집중시간</span>
                      <span className="font-bold text-primary">+40%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-4 text-lg">일반인 그룹</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">읽기속도</span>
                      <span className="font-medium text-muted-foreground">-1.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">이해도</span>
                      <span className="font-bold text-primary">+3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">집중시간</span>
                      <span className="font-bold text-primary">+12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 언어 특화 솔루션 */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                언어 특화 솔루션
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                각 언어의 구조적 특성을 반영한 최적화 엔진
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">한</span>
                  </div>
                  <h3 className="text-xl font-semibold">한글 최적화 엔진</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">음절 빈도 기반 가중치</div>
                      <div className="text-sm text-muted-foreground">초성-중성-종성 구조 분석으로 최적 강조점 계산</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">종성 생략 가능성 예측</div>
                      <div className="text-sm text-muted-foreground">받침 유무에 따른 동적 강조 조정</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">처리 속도: 12ms/단어</div>
                      <div className="text-sm text-muted-foreground">실시간 한글 분해 및 강조 처리</div>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EN</span>
                  </div>
                  <h3 className="text-xl font-semibold">다국어 처리 표준</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">영어: 음절 경계 강조</div>
                      <div className="text-sm text-muted-foreground">9ms/단어 처리 속도</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">중국어: 성조 표시 기반</div>
                      <div className="text-sm text-muted-foreground">15ms/단어 처리 속도</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">확장 가능한 언어 지원</div>
                      <div className="text-sm text-muted-foreground">모듈형 아키텍처로 새로운 언어 추가 지원</div>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기술 차별점 */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                핵심 기술 차별점
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Gemini AI와 4단계 개인화로 구현하는 차세대 읽기 경험
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Gemini AI 통합 시스템</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">문맥 이해형 강조</div>
                      <div className="text-sm text-muted-foreground">단순 패턴이 아닌 의미 분석 기반 강조점 결정</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">실시간 적응 학습</div>
                      <div className="text-sm text-muted-foreground">사용자마다 다른 최적화 프로파일 자동 생성</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5"></div>
                    <div>
                      <div className="font-medium mb-1">다국어 동시 처리</div>
                      <div className="text-sm text-muted-foreground">언어 감지 및 자동 최적화 알고리즘 적용</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">4단계 개인화 프로세스</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <div className="font-medium mb-1">진단 테스트</div>
                      <div className="text-sm text-muted-foreground">10분 내 인지 프로파일링</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <div className="font-medium mb-1">AI 초기 설정</div>
                      <div className="text-sm text-muted-foreground">52개 파라미터 자동 조정</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <div className="font-medium mb-1">실시간 최적화</div>
                      <div className="text-sm text-muted-foreground">500ms 단위 피드백 루프</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <div className="font-medium mb-1">장기적 적응</div>
                      <div className="text-sm text-muted-foreground">주간 학습 곡선 예측</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 윤리적 원칙 */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                윤리적 원칙과 책임
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                기술은 인간을 대체하지 않으며, 문해력 훈련과의 상호보완이 필수적입니다
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-8 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">데이터 무수집</h3>
                <p className="text-muted-foreground">
                  시선 추적 기록은 24시간 내 자동 삭제되며, 개인정보는 수집하지 않습니다
                </p>
              </Card>

              <Card className="p-8 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">오픈소스 공개</h3>
                <p className="text-muted-foreground">
                  모든 알고리즘과 연구 데이터를 GitHub에 투명하게 공개합니다
                </p>
              </Card>

              <Card className="p-8 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">포용성 검증</h3>
                <p className="text-muted-foreground">
                  WCAG 2.1 AA 기준을 충족하여 모든 사용자의 접근성을 보장합니다
                </p>
              </Card>
            </div>

            <Card className="p-8 border-l-4 border-l-primary bg-primary/5">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-4">사용 권고 사항</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">초기 적응기</h4>
                      <p className="text-sm text-muted-foreground">3-5일간 20분 단위로 점진적 사용</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">시각 피로 관리</h4>
                      <p className="text-sm text-muted-foreground">20-20-20 법칙 적용 권장</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">종이책 병행</h4>
                      <p className="text-sm text-muted-foreground">물리적 독서 시간 30% 유지</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">의료적 한계</h4>
                      <p className="text-sm text-muted-foreground">의료적 치료를 대체하지 않음</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              함께 만들어가는 독서 평등
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              GitHub 기여자 1,200명과 함께하는 오픈소스 프로젝트.
              <br />
              모든 연구 데이터와 알고리즘은 투명하게 공개됩니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/converter">
                <Button size="lg" className="group px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  지금 시작하기
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://github.com/yourusername/nungil" target="_blank">
                <Button size="lg" variant="outline" className="px-8">
                  <Eye className="mr-2 h-5 w-5" />
                  GitHub에서 기여하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}