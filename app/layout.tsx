import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next"
import { PersonalizationProvider } from "@/context/PersonalizationProvider"; // Import PersonalizationProvider
// REMOVED: import { SessionProvider } from '@supabase/ssr/react';


export const metadata: Metadata = {
  title: "눈길(Nungil) - AI 기반 바이오닉 리딩",
  description: "난독증과 읽기 어려움을 겪는 분들을 위한 AI 기반 바이오닉 리딩 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const supabase = createClient(); // No longer needed here as PersonalizationProvider creates its own client

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-pretendard" suppressHydrationWarning>
        {/* REMOVED: <SessionProvider supabaseClient={supabase}> */}
          <PersonalizationProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </PersonalizationProvider>
        {/* REMOVED: </SessionProvider> */}
        <Analytics />
      </body>
    </html>
  );
}