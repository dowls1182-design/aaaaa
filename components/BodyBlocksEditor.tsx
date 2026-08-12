"use client";

import type { BodyBlock } from "@/lib/types";
import EditableField from "./EditableField";

/**
 * F. 한국어 본문 편집기.
 * "소제목 + 본문" 한 쌍을 블록으로 묶어서, 블록마다 추가·삭제·순서변경을 할 수 있습니다.
 * 이렇게 구조를 유지해두면 나중에 Word로 저장할 때 소제목이 진짜 제목 서식으로 들어갑니다.
 */
type Props = {
  blocks: BodyBlock[];
  onChange: (next: BodyBlock[]) => void;
  /** 블록 추가/삭제 버튼을 숨기려면 false (번역 탭에서 사용) */
  editable?: boolean;
};

/** 블록마다 서로 다른 고유 번호를 붙이기 위한 함수 */
function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export default function BodyBlocksEditor({
  blocks,
  onChange,
  editable = true,
}: Props) {
  /** 블록 하나의 특정 항목만 바꿉니다 */
  const patchBlock = (index: number, patch: Partial<BodyBlock>) => {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const addBlock = () => {
    onChange([
      ...blocks,
      { id: newId("blk"), subhead: "", paragraphs: "", bullets: [] },
    ]);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  /** 블록을 위(-1) 또는 아래(+1)로 한 칸 이동 */
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addBullet = (index: number) => {
    patchBlock(index, { bullets: [...blocks[index].bullets, ""] });
  };

  const setBullet = (index: number, bulletIndex: number, text: string) => {
    patchBlock(index, {
      bullets: blocks[index].bullets.map((b, i) =>
        i === bulletIndex ? text : b,
      ),
    });
  };

  const removeBullet = (index: number, bulletIndex: number) => {
    patchBlock(index, {
      bullets: blocks[index].bullets.filter((_, i) => i !== bulletIndex),
    });
  };

  return (
    <>
      {blocks.map((block, i) => (
        <div className="blk" key={block.id}>
          <div className="blk-h">
            <span className="blk-no">{i + 1}</span>
            {editable && (
              <div className="blk-tools">
                <button
                  className="btn-mini"
                  onClick={() => moveBlock(i, -1)}
                  disabled={i === 0}
                  title="위로 이동"
                  aria-label={`${i + 1}번 블록 위로 이동`}
                >
                  ↑
                </button>
                <button
                  className="btn-mini"
                  onClick={() => moveBlock(i, 1)}
                  disabled={i === blocks.length - 1}
                  title="아래로 이동"
                  aria-label={`${i + 1}번 블록 아래로 이동`}
                >
                  ↓
                </button>
                <button
                  className="btn-mini danger"
                  onClick={() => removeBlock(i)}
                  title="이 블록 삭제"
                  aria-label={`${i + 1}번 블록 삭제`}
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <EditableField
            value={block.subhead}
            onChange={(v) => patchBlock(i, { subhead: v })}
            variant="subhead"
            placeholder="소제목"
            ariaLabel={`${i + 1}번 블록 소제목`}
          />

          <EditableField
            value={block.paragraphs}
            onChange={(v) => patchBlock(i, { paragraphs: v })}
            placeholder="본문 내용 (문단을 나눌 때는 엔터를 누르세요)"
            ariaLabel={`${i + 1}번 블록 본문`}
          />

          {block.bullets.length > 0 && (
            <>
              <div className="blk-label">글머리표</div>
              {block.bullets.map((bullet, bi) => (
                <div className="bullet-row" key={`${block.id}-b${bi}`}>
                  <EditableField
                    value={bullet}
                    onChange={(v) => setBullet(i, bi, v)}
                    placeholder="항목 내용"
                    ariaLabel={`${i + 1}번 블록 글머리표 ${bi + 1}`}
                  />
                  {editable && (
                    <button
                      className="btn-mini danger"
                      onClick={() => removeBullet(i, bi)}
                      title="이 항목 삭제"
                      aria-label={`글머리표 ${bi + 1} 삭제`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          {editable && (
            <div style={{ marginTop: 6 }}>
              <button className="btn-mini" onClick={() => addBullet(i)}>
                + 글머리표 추가
              </button>
            </div>
          )}
        </div>
      ))}

      {editable && (
        <button className="btn-add" onClick={addBlock}>
          + 소제목·본문 블록 추가
        </button>
      )}
    </>
  );
}
