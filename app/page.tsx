"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ArticleInputForm from "@/components/ArticleInputForm";
import KoreanPane from "@/components/KoreanPane";
import Toast from "@/components/Toast";
import TopBar from "@/components/TopBar";
import TranslationPane from "@/components/TranslationPane";
import {
  DUMMY_ENGLISH_DRAFT,
  DUMMY_EXTRACTED_BODY,
  DUMMY_EXTRACTED_META,
  DUMMY_JAPANESE_DRAFT,
  DUMMY_KOREAN_DRAFT,
} from "@/lib/dummyData";
import {
  copyToClipboard,
  koreanDraftToText,
  translatedDraftToText,
} from "@/lib/toPlainText";
import {
  EMPTY_INPUT,
  type ArticleInput,
  type KoreanDraft,
  type LangTab,
  type TranslatedDraft,
  type WorkState,
} from "@/lib/types";

/**
 * ⚠️ 지금은 실제 크롤링·AI 연결 없이 더미(가짜) 데이터로 동작합니다.
 *    다음 단계에서 아래 `sleep(...)` 부분을 실제 API 호출로 바꾸면 됩니다.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 더미 데이터를 그대로 쓰면 수정 내용이 원본을 덮어쓰므로, 복사본을 만들어 씁니다. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

export default function Home() {
  /* ---------------- 화면 상태 ---------------- */
  const [input, setInput] = useState<ArticleInput>(EMPTY_INPUT);
  const [koDraft, setKoDraft] = useState<KoreanDraft | null>(null);
  const [enDraft, setEnDraft] = useState<TranslatedDraft | null>(null);
  const [jaDraft, setJaDraft] = useState<TranslatedDraft | null>(null);

  const [tab, setTab] = useState<LangTab>("ko");
  const [approved, setApproved] = useState(false);

  const [isImporting, setIsImporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatingLang, setTranslatingLang] = useState<"en" | "ja" | null>(
    null,
  );

  /* ---------------- 안내 메시지(토스트) ---------------- */
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
  }, []);

  // 화면을 떠날 때 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /* ---------------- 상단 상태칩 ---------------- */
  const workState: WorkState = !koDraft
    ? "작성 중"
    : approved
      ? "승인 완료"
      : "검토 중";

  /* ---------------- ① 링크로 가져오기 ---------------- */
  const handleImport = async () => {
    if (!input.url.trim()) {
      showToast("먼저 기사 주소(URL)를 입력하세요");
      return;
    }

    setIsImporting(true);
    await sleep(700); // 👉 다음 단계에서 /api/extract 호출로 교체

    setInput((prev) => ({
      ...prev,
      bodyText: DUMMY_EXTRACTED_BODY,
      // 이미 직접 입력한 항목은 지우지 않고, 비어 있는 항목만 채웁니다.
      outlet: prev.outlet || DUMMY_EXTRACTED_META.outlet,
      reporter: prev.reporter || DUMMY_EXTRACTED_META.reporter,
      originalTitle: prev.originalTitle || DUMMY_EXTRACTED_META.originalTitle,
      publishedAt: prev.publishedAt || DUMMY_EXTRACTED_META.publishedAt,
    }));

    setIsImporting(false);
    showToast("링크에서 본문을 불러왔습니다 — 아래 전문 칸을 확인하세요");
  };

  /* ---------------- ② 재가공 ---------------- */
  const handleReprocess = async () => {
    if (!input.bodyText.trim()) {
      showToast("기사 전문을 먼저 입력하세요");
      return;
    }

    setIsProcessing(true);
    await sleep(1200); // 👉 다음 단계에서 /api/rewrite 호출로 교체

    setKoDraft(clone(DUMMY_KOREAN_DRAFT));
    // 새로 만들면 승인과 번역은 초기화합니다 (내용이 달라졌으므로)
    setApproved(false);
    setEnDraft(null);
    setJaDraft(null);
    setTab("ko");

    setIsProcessing(false);
    showToast("재가공 완료 — 결과를 검토하세요");
  };

  /* ---------------- 승인 토글 ---------------- */
  const handleToggleApprove = () => {
    const next = !approved;
    setApproved(next);
    if (!next) setTab("ko"); // 승인 해제 시 한국어 원고로 돌아옵니다
    showToast(
      next ? "승인되었습니다 — 번역 사용 가능" : "승인이 해제되었습니다",
    );
  };

  /* ---------------- ③ 번역 ---------------- */
  const handleTranslate = async (lang: "en" | "ja") => {
    setTranslatingLang(lang);
    await sleep(1000); // 👉 다음 단계에서 /api/translate 호출로 교체

    if (lang === "en") setEnDraft(clone(DUMMY_ENGLISH_DRAFT));
    else setJaDraft(clone(DUMMY_JAPANESE_DRAFT));

    setTranslatingLang(null);
    setTab(lang);
    showToast(lang === "en" ? "영어 번역 생성 완료" : "일본어 번역 생성 완료");
  };

  /* ---------------- 복사 ---------------- */
  const handleCopy = async () => {
    let text = "";
    if (tab === "ko" && koDraft) text = koreanDraftToText(koDraft);
    else if (tab === "en" && enDraft) text = translatedDraftToText(enDraft);
    else if (tab === "ja" && jaDraft) text = translatedDraftToText(jaDraft);

    const ok = await copyToClipboard(text);
    showToast(
      ok
        ? "복사되었습니다 — 워드나 메일에 붙여넣으세요"
        : "복사에 실패했습니다. 내용을 직접 선택해 복사해 주세요",
    );
  };

  /* ---------------- 파일로 저장 (다음 단계) ---------------- */
  const handleSaveFile = () => {
    showToast("Word 저장은 다음 단계에서 연결됩니다 — 지금은 복사를 이용하세요");
  };

  /* ---------------- 화면 그리기 ---------------- */
  const isEnTabReady = approved && enDraft !== null;
  const isJaTabReady = approved && jaDraft !== null;

  return (
    <>
      <TopBar state={workState} />

      <div className="wrap">
        <div className="grid">
          {/* ============ 왼쪽: 기사 입력 ============ */}
          <ArticleInputForm
            value={input}
            onChange={setInput}
            onImport={handleImport}
            onReprocess={handleReprocess}
            isImporting={isImporting}
            isProcessing={isProcessing}
          />

          {/* ============ 오른쪽: 재가공 결과 ============ */}
          <section className="card">
            <div className="card-h">
              <h2>② 재가공 결과 (A~G)</h2>
              <span className="hint">D·E·F는 직접 수정 가능</span>
            </div>

            {!koDraft ? (
              <div className="empty">
                <div className="ic">📝</div>
                왼쪽에 기사를 넣고 <b>[재가공]</b>을 누르면
                <br />
                결과가 여기에 A~G 형식으로 표시됩니다.
              </div>
            ) : (
              <>
                <div className="tabs">
                  <button
                    className={tab === "ko" ? "tab active" : "tab"}
                    onClick={() => setTab("ko")}
                  >
                    한국어 원고
                  </button>
                  <button
                    className={tab === "en" ? "tab active" : "tab"}
                    disabled={!isEnTabReady}
                    onClick={() => setTab("en")}
                  >
                    English
                  </button>
                  <button
                    className={tab === "ja" ? "tab active" : "tab"}
                    disabled={!isJaTabReady}
                    onClick={() => setTab("ja")}
                  >
                    日本語
                  </button>
                </div>

                {tab === "ko" && (
                  <KoreanPane
                    draft={koDraft}
                    onChange={setKoDraft}
                    approved={approved}
                    onToggleApprove={handleToggleApprove}
                    onCopy={handleCopy}
                    onSaveFile={handleSaveFile}
                    onRegenerate={handleReprocess}
                    onTranslate={handleTranslate}
                    translatingLang={translatingLang}
                  />
                )}

                {tab === "en" && enDraft && (
                  <TranslationPane
                    lang="en"
                    draft={enDraft}
                    onChange={setEnDraft}
                    onBackToKorean={() => setTab("ko")}
                    onCopy={handleCopy}
                    onSaveFile={handleSaveFile}
                  />
                )}

                {tab === "ja" && jaDraft && (
                  <TranslationPane
                    lang="ja"
                    draft={jaDraft}
                    onChange={setJaDraft}
                    onBackToKorean={() => setTab("ko")}
                    onCopy={handleCopy}
                    onSaveFile={handleSaveFile}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>

      <Toast message={toastMsg} />
    </>
  );
}
