"use client";

import type { ArticleInput } from "@/lib/types";

/** 왼쪽 ① 기사 입력 패널 */
type Props = {
  value: ArticleInput;
  onChange: (next: ArticleInput) => void;
  onImport: () => void;
  onReprocess: () => void;
  isImporting: boolean;
  isProcessing: boolean;
};

export default function ArticleInputForm({
  value,
  onChange,
  onImport,
  onReprocess,
  isImporting,
  isProcessing,
}: Props) {
  // 입력칸 하나가 바뀔 때, 나머지는 그대로 두고 그 항목만 교체합니다.
  const setField = (key: keyof ArticleInput) => (next: string) =>
    onChange({ ...value, [key]: next });

  // 본문이 비어 있으면 재가공할 수 없습니다.
  const canReprocess = value.bodyText.trim().length > 0 && !isProcessing;

  return (
    <section className="card">
      <div className="card-h">
        <h2>① 기사 입력</h2>
        <span className="hint">링크로 가져오기 · 또는 직접 입력</span>
      </div>

      <div className="card-b">
        {/* ---------- 링크로 가져오기 ---------- */}
        <div className="import">
          <div className="import-t">🔗 링크로 기사 가져오기</div>
          <div className="import-sub">
            URL만 붙여넣으면 본문이 아래 ‘기사 전문’에 자동으로 채워져요. 가장
            빠른 입력 방법이에요.
          </div>
          <div className="import-row">
            <input
              className="inp"
              placeholder="기사 주소(URL)를 여기에 붙여넣기"
              value={value.url}
              onChange={(e) => setField("url")(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onImport();
              }}
            />
            <button
              className="btn btn-primary sm"
              onClick={onImport}
              disabled={isImporting}
            >
              {isImporting ? "가져오는 중…" : "가져오기"}
            </button>
          </div>
        </div>

        <div className="or">
          <span>또는 직접 입력</span>
        </div>

        {/* ---------- 직접 입력 ---------- */}
        <div className="field-grid">
          <div>
            <label className="f" htmlFor="in-outlet">
              언론사
            </label>
            <input
              id="in-outlet"
              className="inp"
              placeholder="예: 재팬코리아데일리"
              value={value.outlet}
              onChange={(e) => setField("outlet")(e.target.value)}
            />
          </div>

          <div>
            <label className="f" htmlFor="in-reporter">
              기자명
            </label>
            <input
              id="in-reporter"
              className="inp"
              placeholder="예: 김주희 기자"
              value={value.reporter}
              onChange={(e) => setField("reporter")(e.target.value)}
            />
          </div>

          <div className="full">
            <label className="f" htmlFor="in-title">
              기사 제목
            </label>
            <input
              id="in-title"
              className="inp"
              placeholder="원문 기사 제목"
              value={value.originalTitle}
              onChange={(e) => setField("originalTitle")(e.target.value)}
            />
          </div>

          <div>
            <label className="f" htmlFor="in-date">
              게시일
            </label>
            <input
              id="in-date"
              className="inp"
              placeholder="2026-03-27"
              value={value.publishedAt}
              onChange={(e) => setField("publishedAt")(e.target.value)}
            />
          </div>

          <div>
            <label className="f" htmlFor="in-url2">
              기사 URL (참고)
            </label>
            <input
              id="in-url2"
              className="inp"
              placeholder="위에서 가져오면 자동 입력"
              value={value.url}
              onChange={(e) => setField("url")(e.target.value)}
            />
          </div>

          <div className="full">
            <label className="f" htmlFor="in-body">
              기사 전문{" "}
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                — 본문은 여기에
              </span>
            </label>
            <textarea
              id="in-body"
              className="inp"
              placeholder="링크로 가져오면 자동으로 채워집니다. 또는 여기에 본문을 직접 붙여넣으세요."
              value={value.bodyText}
              onChange={(e) => setField("bodyText")(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary full"
          onClick={onReprocess}
          disabled={!canReprocess}
          title={
            value.bodyText.trim().length === 0
              ? "기사 전문을 먼저 입력하세요"
              : undefined
          }
        >
          {isProcessing ? (
            <>
              <span className="spinner" aria-hidden="true" />
              재가공 중…
            </>
          ) : (
            <>✨ 재가공</>
          )}
        </button>
      </div>
    </section>
  );
}
