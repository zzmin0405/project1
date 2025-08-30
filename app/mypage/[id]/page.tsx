/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BionicContentDisplayer from "@/components/BionicContentDisplayer";






export default async function SummaryDetailPage(props: any) {
  const { params } = props;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // 이 페이지는 로그인이 필수입니다.
    // LoginRequired 컴포넌트를 보여주거나 로그인 페이지로 리디렉션 할 수 있습니다.
    // 여기서는 간단하게 notFound를 호출합니다.
    return notFound();
  }

  const { data: summary, error } = await supabase
    .from("summaries")
    .select("*")
        .eq("id", (params as any).id)
    .eq("user_id", user.id) // 본인의 기록만 볼 수 있도록 user_id 체크
    .single();

  if (error || !summary) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/mypage" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          마이페이지로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold break-all">{summary.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">
          {new Date(summary.created_at).toLocaleString("ko-KR")}
        </p>
      </div>

      <div className="space-y-8">
        {summary.summary_content && (
        <Card>
          <CardHeader>
            <CardTitle>AI 요약</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-base leading-relaxed">
            {summary.summary_content}
          </CardContent>
        </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>바이오닉 리딩 변환 결과</CardTitle>
            <CardDescription>개인화 설정이 적용된 결과입니다.</CardDescription>
          </CardHeader>
          <CardContent 
            className="p-4 border rounded-lg bg-muted/30 overflow-auto"
          >
            <BionicContentDisplayer content={summary.bionic_content} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */