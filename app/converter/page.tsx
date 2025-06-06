"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Copy, 
  Download, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { convertToBionic } from "@/lib/gemini/client";

export default function Converter() {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // 기본 설정 (고정)
  const settings = {
    intensity: 'medium' as const,
    language: 'auto' as const
  };

  const handleConvert = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await convertToBionic(inputText, {
        intensity: settings.intensity,
        language: settings.language
      });
      setConvertedText(result);
    } catch (error) {
      console.error('변환 오류:', error);
      if (error instanceof Error && error.message.includes('API key not valid')) {
        setError('Gemini API 키가 유효하지 않습니다. .env.local 파일의 NEXT_PUBLIC_GEMINI_API_KEY를 확인해주세요.');
      } else {
        setError('AI 변환 중 오류가 발생했습니다. API 키를 확인하고 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    const textOnly = convertedText.replace(/<[^>]*>/g, '');
    await navigator.clipboard.writeText(textOnly);
  };

  const handleDownload = () => {
    const blob = new Blob([convertedText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bionic-text.html';
    a.click();
  };


  return (
    <div className="bg-background min-h-screen">
      {/* Main Content */}
      <section className="py-6">
        <div className="px-6">
          <div className="max-w-none">

            {/* Main Split View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
              {/* Left: Input Area */}
              <Card className="flex flex-col">
                <CardHeader className="flex-none">
                  <div className="flex items-center justify-between">
                    <CardTitle>원본 텍스트</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleConvert}
                        disabled={!inputText.trim() || isLoading}
                        size="sm"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        변환하기
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <Textarea
                    placeholder="변환할 텍스트를 입력하세요..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 resize-none"
                  />
                </CardContent>
              </Card>

              {/* Right: Output Area */}
              <Card className="flex flex-col">
                <CardHeader className="flex-none">
                  <div className="flex items-center justify-between">
                    <CardTitle>바이오닉 리딩 결과</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!convertedText}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        복사
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!convertedText}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 p-4 border rounded-lg bg-muted/30 overflow-auto text-base leading-relaxed">
                    {error ? (
                      <div className="text-center text-destructive">
                        <p className="mb-2">{error}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setError(null)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          다시 시도
                        </Button>
                      </div>
                    ) : convertedText ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: convertedText }}
                        className="whitespace-pre-wrap"
                      />
                    ) : (
                      <p className="text-muted-foreground text-center">
                        변환된 텍스트가 여기에 표시됩니다
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}