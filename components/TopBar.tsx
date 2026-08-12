import type { WorkState } from "@/lib/types";

/** 상단 바 — 로고, 앱 이름, 오른쪽에 현재 진행 상태 표시 */
export default function TopBar({ state }: { state: WorkState }) {
  const pillClass =
    state === "승인 완료"
      ? "pill pill-approved"
      : state === "검토 중"
        ? "pill pill-review"
        : "pill pill-draft";

  return (
    <div className="topbar">
      <div className="logo">Q</div>
      <div>
        <div className="brandname">뉴스 재가공 도구</div>
        <div className="brandsub">
          기사 링크·본문 → 회사 공식 News 콘텐츠 재구성
        </div>
      </div>
      <div className="top-right">
        <span className={pillClass}>{state}</span>
      </div>
    </div>
  );
}
