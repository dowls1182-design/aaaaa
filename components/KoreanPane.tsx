"use client";

import type { KoreanDraft } from "@/lib/types";
import BodyBlocksEditor from "./BodyBlocksEditor";
import EditableField from "./EditableField";
import SimilarityChecklist from "./SimilarityChecklist";

/** 오른쪽 결과 패널 — 한국어 원고 (A~G) */
type Props = {
  draft: KoreanDraft;
  onChange: (next: KoreanDraft) => void;
  approved: boolean;
  onToggleApprove: () => void;
  onCopy: () => void;
  onSaveFile: () => void;
  onRegenerate: () => void;
  onTranslate: (lang: "en" | "ja") => void;
  translatingLang: "en" | "ja" | null;
};

const ANCHORS = [
  { id: "sec-a", label: "A 사실" },
  { id: "sec-b", label: "B 제외" },
  { id: "sec-c", label: "C 확인필요" },
  { id: "sec-d", label: "D 제목" },
  { id: "sec-e", label: "E 요약" },
  { id: "sec-f", label: "F 본문" },
  { id: "sec-g", label: "G 점검" },
];

export default function KoreanPane({
  draft,
  onChange,
  approved,
  onToggleApprove,
  onCopy,
  onSaveFile,
  onRegenerate,
  onTranslate,
  translatingLang,
}: Props) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      {/* ---------- 빠른 이동 ---------- */}
      <div className="result-toolbar">
        {ANCHORS.map((a) => (
          <button key={a.id} className="anchor" onClick={() => scrollTo(a.id)}>
            {a.label}
          </button>
        ))}
      </div>

      {/* ---------- A. 객관적 사실 목록 ---------- */}
      <div className="sec" id="sec-a">
        <div className="tag">
          <i>A</i>객관적 사실 목록 (주제별)
        </div>
        {draft.factGroups.map((group) => (
          <div className="fact-group" key={group.topic}>
            <div className="fact-topic">{group.topic}</div>
            <ul className="facts">
              {group.facts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ---------- B. 제외해야 할 표현 ---------- */}
      <div className="sec" id="sec-b">
        <div className="tag">
          <i>B</i>사용에서 제외해야 할 표현과 내용
        </div>
        {draft.excluded.length === 0 ? (
          <div className="muted">제외 대상 표현이 없습니다.</div>
        ) : (
          <ul className="excl">
            {draft.excluded.map((item, i) => (
              <li key={i}>
                <span className="ex-q">{item.expression}</span>
                <span className="ex-r">{item.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- C. 사실 확인 필요 ---------- */}
      <div className="sec" id="sec-c">
        <div className="tag">
          <i>C</i>회사의 사실 확인이 필요한 항목
        </div>
        {draft.needsCheck.length === 0 ? (
          <div className="none-note">별도 확인 필요 사항 없음</div>
        ) : (
          <ul className="chk-list">
            {draft.needsCheck.map((item, i) => (
              <li key={i}>
                <span className="flag">{item.label}</span>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- D. 새 제목 (수정 가능) ---------- */}
      <div className="sec master" id="sec-d">
        <div className="tag">
          <i>D</i>새로운 한국어 제목 · 직접 수정 가능
        </div>
        <EditableField
          value={draft.title}
          onChange={(v) => onChange({ ...draft, title: v })}
          variant="mtitle"
          placeholder="제목을 입력하세요"
          ariaLabel="한국어 제목"
        />
      </div>

      {/* ---------- E. 요약문 (수정 가능) ---------- */}
      <div className="sec master" id="sec-e">
        <div className="tag">
          <i>E</i>한국어 요약문 · 직접 수정 가능
        </div>
        <EditableField
          value={draft.summary}
          onChange={(v) => onChange({ ...draft, summary: v })}
          placeholder="요약문을 입력하세요"
          ariaLabel="한국어 요약문"
        />
      </div>

      {/* ---------- F. 본문 (수정 가능) ---------- */}
      <div className="sec master" id="sec-f">
        <div className="tag">
          <i>F</i>한국어 본문 · 직접 수정 가능
        </div>
        <BodyBlocksEditor
          blocks={draft.bodyBlocks}
          onChange={(v) => onChange({ ...draft, bodyBlocks: v })}
        />

        <div className="refbox">
          <div className="rb-t">출처 안내</div>
          <EditableField
            value={draft.sourceNote}
            onChange={(v) => onChange({ ...draft, sourceNote: v })}
            placeholder="출처 안내 문구"
            ariaLabel="출처 안내"
          />

          {draft.references.length > 0 && (
            <>
              <div className="rb-t" style={{ marginTop: 8 }}>
                환율 · 수치 · 날짜 참고
              </div>
              <ul>
                {draft.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* ---------- G. 유사성 자체 점검 ---------- */}
      <div className="sec" id="sec-g">
        <div className="tag">
          <i>G</i>원문과의 유사성 자체 점검
        </div>
        <SimilarityChecklist items={draft.similarityChecks} />
      </div>

      {/* ---------- 하단 액션바 ---------- */}
      <div className="actionbar">
        <div className="approve">
          <button
            className={approved ? "switch on" : "switch"}
            onClick={onToggleApprove}
            role="switch"
            aria-checked={approved}
            aria-label="원고 승인"
          />
          <div className="lbl">
            승인
            <small>승인 시 번역 활성화</small>
          </div>
        </div>

        {approved && <span className="badge-approved">✓ 승인됨</span>}

        <div className="spacer" />

        <button className="btn-ghost" onClick={onCopy}>
          복사
        </button>
        <button className="btn-ghost" onClick={onSaveFile}>
          파일로 저장
        </button>
        <button className="btn-ghost" onClick={onRegenerate}>
          다시 생성
        </button>
        <button
          className="btn-ghost accent"
          disabled={!approved || translatingLang !== null}
          onClick={() => onTranslate("en")}
        >
          {translatingLang === "en" ? "번역 중…" : "영어 번역"}
        </button>
        <button
          className="btn-ghost accent"
          disabled={!approved || translatingLang !== null}
          onClick={() => onTranslate("ja")}
        >
          {translatingLang === "ja" ? "번역 중…" : "일본어 번역"}
        </button>
      </div>
    </div>
  );
}
