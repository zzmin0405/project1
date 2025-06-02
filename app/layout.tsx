import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "눈길(Nungil) - AI 기반 바이오닉 리딩",
  description: "난독증과 읽기 어려움을 겪는 분들을 위한 AI 기반 바이오닉 리딩 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className="font-pretendard">{children}</body>
    </html>
  );
}