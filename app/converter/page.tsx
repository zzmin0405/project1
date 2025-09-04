'use client';

import { useState, useRef } from "react";
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
  Wand2,
  Save,
  Hand
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { usePersonalization } from "@/context/PersonalizationProvider"; // 추가

type Intensity = "light" | "medium" | "strong";

export default function Converter() {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const supabase = createClient();

  // 개인화 설정 가져오기
  const { fontSize, textColor } = usePersonalization();

  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // 함수가 종료될 때 항상 파일 입력을 초기화하기 위해 event.currentTarget을 저장합니다.
    const currentTarget = event.currentTarget;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("PDF 업로드는 로그인이 필요한 기능입니다.");
        return;
      }

      const file = currentTarget.files?.[0];
      if (!file) return;

      const MAX_FILE_SIZE_MB = 10;
      const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다.`);
        return;
      }

      setIsParsing(true);
      setError(null);
      setInputText('');
      setConvertedText('');
      setSummary('');
      setSaveSuccess(false);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/extract-pdf', { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'PDF 처리 중 서버 오류 발생');
        setInputText(result.text);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
        setError(`PDF 처리 오류: ${errorMessage}`);
      } finally {
        setIsParsing(false);
      }
    } finally {
      // 함수가 어떤 경로로 종료되든 항상 파일 입력을 초기화합니다.
      // 이렇게 하면 동일한 파일을 다시 선택해도 onChange 이벤트가 정상적으로 발생합니다.
      if (currentTarget) {
        currentTarget.value = '';
      }
    }
  };
  
  const handleConvert = async () => {
    if (!inputText.trim()) return;

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);
    setConvertedText('');
    setSummary('');
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, settings: { intensity, language: "auto" } }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'AI 변환 중 서버 오류 발생');
      }

      if (!response.body) {
        throw new Error('응답 스트림이 없습니다.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        setConvertedText((prev) => prev + chunk);
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted by user.');
          setError('변환이 중지되었습니다.');
        } else {
          setError(`AI 변환 오류: ${err.message}`);
        }
      } else {
        setError(`AI 변환 오류: 알 수 없는 오류`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopConverting = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleSummarize = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("AI 요약은 로그인이 필요한 기능입니다.");
      return;
    }
    if (!inputText.trim()) return;

    setIsSummarizing(true);
    setError(null);
    setSummary('');
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'AI 요약 중 서버 오류 발생');
      setSummary(result.summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(`AI 요약 오류: ${errorMessage}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveSummary = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("저장은 로그인이 필요한 기능입니다.");
      return;
    }
    if (!inputText.trim() || !convertedText) return;
    
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_content: inputText,
          summary_content: summary,
          bionic_content: convertedText,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '저장 중 서버 오류 발생');
      setSaveSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(`저장 오류: ${errorMessage}`);
    } finally {
      setIsSaving(false);
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

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  };

  const bionicTextStyle = {
    fontSize: getFontSizeValue(fontSize),
    color: textColor,
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
                      <div>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isParsing}>
                          {isParsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />} PDF 불러오기
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 text-center">최대 10MB</p>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                      <ToggleGroup type="single" size="sm" value={intensity} onValueChange={(value: Intensity) => { if (value) setIntensity(value);}} aria-label="변환 강도">
                        <ToggleGroupItem value="light" aria-label="약하게">약하게</ToggleGroupItem>
                        <ToggleGroupItem value="medium" aria-label="중간">중간</ToggleGroupItem>
                        <ToggleGroupItem value="strong" aria-label="강하게">강하게</ToggleGroupItem>
                      </ToggleGroup>
                      {isLoading ? (
                        <Button onClick={handleStopConverting} variant="destructive" size="sm">
                          <Hand className="w-4 h-4 mr-2" /> 중지하기
                        </Button>
                      ) : (
                        <Button onClick={handleConvert} disabled={!inputText.trim() || isParsing} size="sm">
                          <Sparkles className="w-4 h-4 mr-2" /> 변환하기
                        </Button>
                      )}
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
                      {/* 저장하기 버튼 위치 이동 */}
                      <Button onClick={handleSaveSummary} variant="outline" size="sm" disabled={!inputText.trim() || !convertedText || isSaving || saveSuccess}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {saveSuccess ? "저장 완료!" : "저장하기"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSummarize} disabled={!convertedText || isSummarizing}>
                        {isSummarizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />} AI 요약
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopy} disabled={!convertedText}><Copy className="w-4 h-4 mr-2" /> 복사</Button>
                      <Button variant="outline" size="sm" onClick={handleDownload} disabled={!convertedText}><Download className="w-4 h-4 mr-2" /> HTML 다운로드</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 p-4 border rounded-lg bg-muted/30 overflow-auto text-base leading-relaxed">
                    {error && (
                      <div className="text-center text-destructive mb-4">
                        <p className="mb-2">{error}</p>
                        <Button variant="outline" size="sm" onClick={() => setError(null)}><RefreshCw className="w-4 h-4 mr-2" /> 다시 시도</Button>
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
                        style={bionicTextStyle} // 스타일 적용
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