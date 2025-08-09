"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Sparkles, 
  Copy, 
  Download, 
  Loader2,
  RefreshCw,
  FileUp,
  Wand2
} from "lucide-react";
import { convertToBionic } from "@/lib/gemini/client";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

type Intensity = "light" | "medium" | "strong";

export default function Converter() {
  const [user, setUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      alert("PDF 업로드는 로그인이 필요한 기능입니다.");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setError(null);
    setInputText('');
    setConvertedText('');
    setSummary('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'PDF 처리 중 서버 오류 발생');
      }

      if (result.message) {
        setError(result.message);
        setInputText('');
      } else {
        setInputText(result.text);
      }

    } catch (err) {
      console.error('PDF 업로드 오류:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`PDF 처리 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsParsing(false);
    }
    
    if(event.target) {
      event.target.value = '';
    }
  };
  
  const handleConvert = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setConvertedText('');
    setSummary('');
    
    try {
      const result = await convertToBionic(inputText, {
        intensity: intensity,
        language: "auto"
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

  const handleSummarize = async () => {
    if (!user) {
      alert("AI 요약은 로그인이 필요한 기능입니다.");
      return;
    }
    if (!inputText.trim()) return;

    setIsSummarizing(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'AI 요약 중 서버 오류 발생');
      }

      setSummary(result.summary);

    } catch (err) {
      console.error('AI 요약 오류:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(`AI 요약 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSummarizing(false);
    }
  };

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
    <div className="bg-background">
      <section className="py-6">
        <div className="px-6">
          <div className="max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[calc(100vh-200px)]">
              <Card className="flex flex-col">
                <CardHeader className="flex-none">
                  <div className="flex items-center justify-between">
                    <CardTitle>원본 텍스트</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isParsing || isLoading}
                      >
                        {isParsing ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileUp className="w-4 h-4 mr-2" />
                        )}
                        PDF 불러오기
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf" 
                      />
                      <ToggleGroup 
                        type="single" 
                        size="sm"
                        value={intensity}
                        onValueChange={(value: Intensity) => {
                          if (value) setIntensity(value);
                        }}
                        aria-label="변환 강도"
                      >
                        <ToggleGroupItem value="light" aria-label="약하게">약하게</ToggleGroupItem>
                        <ToggleGroupItem value="medium" aria-label="중간">중간</ToggleGroupItem>
                        <ToggleGroupItem value="strong" aria-label="강하게">강하게</ToggleGroupItem>
                      </ToggleGroup>
                      <Button 
                        onClick={handleConvert}
                        disabled={!inputText.trim() || isLoading || isParsing}
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
                    placeholder={isParsing ? "PDF를 분석하고 있습니다..." : "변환할 텍스트를 입력하거나 PDF를 불러오세요..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 resize-none"
                    disabled={isParsing}
                  />
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader className="flex-none">
                  <div className="flex items-center justify-between">
                    <CardTitle>바이오닉 리딩 결과</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSummarize}
                        disabled={!convertedText || isSummarizing}
                      >
                        {isSummarizing ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        AI 요약
                      </Button>
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
                    {error && (
                      <div className="text-center text-destructive mb-4">
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
                    )}
                    {isSummarizing && <p className="text-muted-foreground text-center">AI가 텍스트를 요약하고 있습니다...</p>}
                    {summary && (
                      <div className="p-4 mb-4 border-l-4 border-primary bg-primary/10 rounded-r-lg">
                        <h4 className="font-semibold mb-2">AI 요약</h4>
                        <p className="whitespace-pre-wrap">{summary}</p>
                      </div>
                    )}
                    {convertedText ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: convertedText }}
                        className="whitespace-pre-wrap"
                      />
                    ) : (
                      !error && !isSummarizing && <p className="text-muted-foreground text-center">변환된 텍스트가 여기에 표시됩니다</p>
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