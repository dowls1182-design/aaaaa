/**
 * 화면의 결과를 "복사 버튼"으로 붙여넣기 좋은 글자 형태로 바꿉니다.
 * (Word 파일 저장은 다음 단계에서 이 구조를 그대로 활용합니다.)
 */

import type { BodyBlock, KoreanDraft, TranslatedDraft } from "./types";

function blocksToText(blocks: BodyBlock[]): string {
  return blocks
    .map((b) => {
      const lines: string[] = [];
      if (b.subhead.trim()) lines.push(`■ ${b.subhead.trim()}`);
      if (b.paragraphs.trim()) lines.push(b.paragraphs.trim());
      for (const bullet of b.bullets) {
        if (bullet.trim()) lines.push(`  · ${bullet.trim()}`);
      }
      return lines.join("\n");
    })
    .filter((s) => s.length > 0)
    .join("\n\n");
}

/** 한국어 원고(A~G) 전체를 글자로 */
export function koreanDraftToText(draft: KoreanDraft): string {
  const parts: string[] = [];

  parts.push("[A. 객관적 사실 목록]");
  for (const group of draft.factGroups) {
    parts.push(`◆ ${group.topic}`);
    for (const fact of group.facts) parts.push(`  - ${fact}`);
  }

  parts.push("", "[B. 사용에서 제외한 표현과 내용]");
  if (draft.excluded.length === 0) {
    parts.push("  - 해당 없음");
  } else {
    for (const item of draft.excluded) {
      parts.push(`  - "${item.expression}" → ${item.reason}`);
    }
  }

  parts.push("", "[C. 회사의 사실 확인이 필요한 항목]");
  if (draft.needsCheck.length === 0) {
    parts.push("  - 별도 확인 필요 사항 없음");
  } else {
    for (const item of draft.needsCheck) {
      parts.push(`  - (${item.label}) ${item.detail}`);
    }
  }

  parts.push("", "[D. 제목]", draft.title.trim());
  parts.push("", "[E. 요약문]", draft.summary.trim());
  parts.push("", "[F. 본문]", blocksToText(draft.bodyBlocks));

  if (draft.sourceNote.trim()) {
    parts.push("", `※ 출처 안내: ${draft.sourceNote.trim()}`);
  }
  if (draft.references.length > 0) {
    parts.push("", "※ 환율·수치·날짜 참고");
    for (const ref of draft.references) parts.push(`  - ${ref}`);
  }

  parts.push("", "[G. 원문 유사성 자체 점검]");
  for (const check of draft.similarityChecks) {
    parts.push(`  ${check.no}. ${check.label} → ${check.verdict}`);
    if (check.note.trim()) parts.push(`     (${check.note.trim()})`);
  }

  return parts.join("\n");
}

/** 배포용 본문만 (제목 + 요약 + 본문). 실제 News에 올릴 부분입니다. */
export function koreanArticleOnlyToText(draft: KoreanDraft): string {
  const parts = [draft.title.trim(), "", draft.summary.trim(), ""];
  parts.push(blocksToText(draft.bodyBlocks));
  if (draft.sourceNote.trim()) {
    parts.push("", `※ ${draft.sourceNote.trim()}`);
  }
  return parts.join("\n");
}

/** 영어·일본어 번역본을 글자로 */
export function translatedDraftToText(draft: TranslatedDraft): string {
  const parts = [draft.title.trim(), "", draft.summary.trim(), ""];
  parts.push(blocksToText(draft.bodyBlocks));
  parts.push(
    "",
    "---",
    `SEO Title: ${draft.seoTitle}`,
    `Meta Description: ${draft.metaDescription}`,
    `URL Slug: ${draft.urlSlug}`,
    `Source Note: ${draft.sourceNote}`,
  );
  return parts.join("\n");
}

/** 클립보드에 복사. 성공하면 true. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
