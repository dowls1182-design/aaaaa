"use client";

import type { TranslatedDraft } from "@/lib/types";
import BodyBlocksEditor from "./BodyBlocksEditor";
import EditableField from "./EditableField";

/**
 * 오른쪽 결과 패널 — 영어 / 일본어 번역본.
 * 번역본은 검토용(A~G)이 아니라 배포용이라, 제목·요약·본문 + SEO 구조로 보여줍니다.
 */
type Props = {
  lang: "en" | "ja";
  draft: TranslatedDraft;
  onChange: (next: TranslatedDraft) => void;
  onBackToKorean: () => void;
  onCopy: () => void;
  onSaveFile: () => void;
};

/** 언어별 화면 문구 */
const LABELS = {
  en: {
    titleTag: "Headline · editable",
    summaryTag: "Summary",
    bodyTag: "Body",
    seoTag: "SEO / Source",
    back: "← 한국어 원고",
    seoTitle: "SEO Title",
    metaDesc: "Meta Description",
    slug: "URL Slug",
    source: "Source Note",
  },
  ja: {
    titleTag: "タイトル · 編集可",
    summaryTag: "概要",
    bodyTag: "本文",
    seoTag: "SEO / 出典",
    back: "← 한국어 원고",
    seoTitle: "SEOタイトル",
    metaDesc: "メタディスクリプション",
    slug: "URL Slug",
    source: "出典表記",
  },
} as const;

const TAG_ICONS = {
  en: { title: "H", summary: "S", body: "B" },
  ja: { title: "H", summary: "概", body: "本" },
} as const;

export default function TranslationPane({
  lang,
  draft,
  onChange,
  onBackToKorean,
  onCopy,
  onSaveFile,
}: Props) {
  const t = LABELS[lang];
  const icons = TAG_ICONS[lang];

  return (
    <div>
      {/* ---------- 제목 ---------- */}
      <div className="sec master">
        <div className="tag">
          <i>{icons.title}</i>
          {t.titleTag}
        </div>
        <EditableField
          value={draft.title}
          onChange={(v) => onChange({ ...draft, title: v })}
          variant="mtitle"
          ariaLabel={t.titleTag}
        />
      </div>

      {/* ---------- 요약 ---------- */}
      <div className="sec master">
        <div className="tag">
          <i>{icons.summary}</i>
          {t.summaryTag}
        </div>
        <EditableField
          value={draft.summary}
          onChange={(v) => onChange({ ...draft, summary: v })}
          ariaLabel={t.summaryTag}
        />
      </div>

      {/* ---------- 본문 ---------- */}
      <div className="sec master">
        <div className="tag">
          <i>{icons.body}</i>
          {t.bodyTag}
        </div>
        <BodyBlocksEditor
          blocks={draft.bodyBlocks}
          onChange={(v) => onChange({ ...draft, bodyBlocks: v })}
        />
      </div>

      {/* ---------- SEO / 출처 ---------- */}
      <div className="sec">
        <div className="tag">
          <i>◎</i>
          {t.seoTag}
        </div>
        <div className="refbox">
          <div>
            <b>{t.seoTitle}:</b> {draft.seoTitle}
          </div>
          <div>
            <b>{t.metaDesc}:</b> {draft.metaDescription}
          </div>
          <div>
            <b>{t.slug}:</b> {draft.urlSlug}
          </div>
          <div>
            <b>{t.source}:</b> {draft.sourceNote}
          </div>
        </div>
      </div>

      {/* ---------- 하단 액션바 ---------- */}
      <div className="actionbar">
        <button className="btn-ghost" onClick={onBackToKorean}>
          {t.back}
        </button>
        <div className="spacer" />
        <button className="btn-ghost" onClick={onCopy}>
          복사
        </button>
        <button className="btn-ghost" onClick={onSaveFile}>
          파일로 저장
        </button>
      </div>
    </div>
  );
}
