'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Link 컴포넌트 import
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Summary = {
  id: string;
  title: string;
  created_at: string;
};

export default function MyPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) {
          throw new Error('기록을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setSummaries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">마이페이지</h1>
        <p className="text-lg text-muted-foreground mt-2">
          나의 요약 기록을 확인하고 관리하세요.
        </p>
      </div>

      <div className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && summaries.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">아직 요약 기록이 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">새로운 텍스트를 요약하고 기록을 남겨보세요!</p>
          </div>
        )}

        {!loading && !error && summaries.length > 0 && (
          summaries.map((summary) => (
            <Link href={`/mypage/${summary.id}`} key={summary.id} className="no-underline">
              <Card className="hover:shadow-md hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="truncate">{summary.title}</CardTitle>
                  <CardDescription>
                    {new Date(summary.created_at).toLocaleString('ko-KR')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
