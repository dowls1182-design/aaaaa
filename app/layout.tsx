import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "뉴스 재가공 도구",
  description: "기사 링크·본문 → 회사 공식 News 콘텐츠 재구성",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* Pretendard 폰트 — 목업과 동일한 글꼴을 쓰기 위해 불러옵니다 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        {children}
      </body>
    </html>
  );
}
