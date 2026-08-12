import type { SimilarityCheckItem } from "@/lib/types";

/**
 * G. 원문과의 유사성 자체 점검 — 9개 항목을 표로 보여줍니다.
 * 읽기 전용입니다 (AI가 판정한 결과를 확인하는 용도).
 */
export default function SimilarityChecklist({
  items,
}: {
  items: SimilarityCheckItem[];
}) {
  const okCount = items.filter((it) => it.verdict === "적합").length;
  const fixCount = items.length - okCount;

  return (
    <>
      <div className="gsummary">
        <span className="verdict ok">적합 {okCount}</span>
        {fixCount > 0 && <span className="verdict fix">수정 필요 {fixCount}</span>}
        <span className="tiny muted">총 {items.length}개 항목</span>
      </div>

      <div className="gwrap">
        <table className="gtable">
          <thead>
            <tr>
              <th>#</th>
              <th>점검 항목</th>
              <th>판정</th>
              <th>근거 · 수정 방향</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.no}>
                <td className="no">{item.no}</td>
                <td>{item.label}</td>
                <td>
                  <span
                    className={
                      item.verdict === "적합" ? "verdict ok" : "verdict fix"
                    }
                  >
                    {item.verdict}
                  </span>
                </td>
                <td className="note">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
