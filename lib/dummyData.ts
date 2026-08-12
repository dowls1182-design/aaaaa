/**
 * 화면 확인용 임시(더미) 데이터.
 *
 * ⚠️ 다음 단계에서 Claude API를 붙이면 이 파일은 더 이상 쓰이지 않습니다.
 *    (파일은 남겨두고, API가 실패했을 때의 예시로만 활용합니다.)
 *
 * 내용은 목업(docs/mockup.html)의 "쿼드마이너 일본 진출" 예시를 그대로 옮긴 것입니다.
 */

import type { KoreanDraft, TranslatedDraft } from "./types";

/** [링크로 가져오기] 버튼을 눌렀을 때 본문 칸에 채워지는 가짜 본문 */
export const DUMMY_EXTRACTED_BODY = `[예시 본문] 쿼드마이너가 일본 시장 공략에 속도를 내고 있다. 일본 법인 쿼드마이너 재팬을 통해 지역 금융권과 지자체, 제조 기업을 대상으로 개념검증(PoC)을 진행하고 있다.

주력 제품은 네트워크 통신을 패킷 단위로 수집·분석하는 NDR 솔루션 '네트워크 블랙박스'다. 회사는 2024년 일본 도쿄증권거래소 스탠다드 시장 상장사 푸바브레인으로부터 지분 투자를 유치했다.

※ 이것은 화면 확인용 가짜 본문입니다. 다음 단계에서 실제 크롤링을 붙이면, 입력한 주소의 진짜 기사 본문이 여기에 들어옵니다.`;

/** [링크로 가져오기] 시 함께 자동 채워지는 가짜 메타 정보 */
export const DUMMY_EXTRACTED_META = {
  outlet: "재팬코리아데일리",
  reporter: "김주희 기자",
  originalTitle: "쿼드마이너, 일본 금융·공공 시장 공략 가속",
  publishedAt: "2026-03-27",
};

/** [재가공] 버튼을 눌렀을 때 오른쪽에 표시되는 가짜 A~G 결과 */
export const DUMMY_KOREAN_DRAFT: KoreanDraft = {
  /* ---------------- A. 객관적 사실 목록 (주제별) ---------------- */
  factGroups: [
    {
      topic: "일본 사업 구조",
      facts: [
        "쿼드마이너는 일본 법인 쿼드마이너 재팬을 통해 현지 사업을 전개한다.",
        "일본 사업의 주요 대상은 지역 금융권, 지자체, 제조 기업이다.",
        "현지 고객을 상대로 개념검증(PoC)을 진행하고 있다.",
      ],
    },
    {
      topic: "제품",
      facts: [
        "주력 제품은 NDR 솔루션 '네트워크 블랙박스'다.",
        "네트워크 통신을 패킷 단위로 수집·분석하는 방식이다.",
      ],
    },
    {
      topic: "현지 투자",
      facts: [
        "2024년 일본 상장사 푸바브레인으로부터 지분 투자를 유치했다.",
        "푸바브레인은 도쿄증권거래소 스탠다드 시장 상장사다.",
      ],
    },
  ],

  /* ---------------- B. 제외해야 할 표현과 내용 ---------------- */
  excluded: [
    {
      expression: "일본 시장을 빠르게 장악하고 있다",
      reason: "근거가 제시되지 않은 과장 수식어",
    },
    {
      expression: "업계에서는 올해 실적이 크게 개선될 것으로 내다본다",
      reason: "기자의 전망·해석 (객관적 사실이 아님)",
    },
    {
      expression: "회사 관계자는 “현지 반응이 뜨겁다”고 말했다",
      reason: "직접 인용문 (원문 고유 표현이므로 재사용 불가)",
    },
    {
      expression: "사실상 유일한 대안",
      reason: "비교 우위를 단정하는 표현",
    },
  ],

  /* ---------------- C. 사실 확인이 필요한 항목 ---------------- */
  needsCheck: [
    {
      label: "사실 확인 필요",
      detail:
        "쿼드마이너 재팬의 정확한 법인 설립 시점(연·월) — 원문에 명시되지 않음",
    },
    {
      label: "환율 및 기준일 확인 필요",
      detail:
        "원문의 투자 금액(엔화)을 원화로 환산할 경우 적용 환율과 기준일을 확정해야 함",
    },
  ],

  /* ---------------- D. 새로운 한국어 제목 ---------------- */
  title:
    "쿼드마이너, 일본 법인 중심으로 금융·공공 시장 확대…현지 상장사 지분 투자 유치",

  /* ---------------- E. 한국어 요약문 ---------------- */
  summary:
    "쿼드마이너가 일본 법인 쿼드마이너 재팬을 앞세워 금융·공공 부문을 중심으로 현지 사업을 넓혀가고 있다. 주력 제품은 네트워크 이상행위를 패킷 단위로 수집·분석하는 NDR 솔루션 '네트워크 블랙박스'다.",

  /* ---------------- F. 한국어 본문 (소제목 + 본문 블록) ---------------- */
  bodyBlocks: [
    {
      id: "blk-1",
      subhead: "쿼드마이너 재팬을 통한 일본 시장 전개",
      paragraphs:
        "일본 사업은 현지 법인 쿼드마이너 재팬이 맡고 있다. 지역 금융권과 지자체, 제조 기업을 상대로 개념검증(PoC)을 진행하는 방식으로 시장에 접근하고 있다.",
      bullets: [],
    },
    {
      id: "blk-2",
      subhead: "주력 제품 '네트워크 블랙박스'",
      paragraphs:
        "회사의 주력 제품은 NDR(Network Detection and Response) 솔루션 '네트워크 블랙박스'다. 네트워크를 오가는 통신을 패킷 단위로 수집·분석한다.",
      bullets: [
        "수집 단위: 패킷",
        "적용 분야: 네트워크 이상행위 탐지 및 분석",
        "주요 대상 고객: 금융, 공공, 제조",
      ],
    },
    {
      id: "blk-3",
      subhead: "현지 투자 및 파트너십",
      paragraphs:
        "2024년 일본 도쿄증권거래소 스탠다드 시장 상장사 푸바브레인으로부터 지분 투자를 유치했다.",
      bullets: [],
    },
  ],

  /* ---------------- F. 출처 안내 ---------------- */
  sourceNote:
    "본 콘텐츠는 원문 보도에서 객관적으로 확인된 사실만을 추출해 재구성한 독립 콘텐츠입니다.",

  /* ---------------- F. 환율·수치·날짜 참고 ---------------- */
  references: [
    "엔화 금액을 원화로 표기할 경우, 환산 환율과 기준일을 본문에 함께 밝혀야 합니다. (C항목 확인 필요)",
    "지분 투자 유치 시점은 2024년으로, 원문 게시일(2026-03-27) 기준 과거 사실입니다.",
  ],

  /* ---------------- G. 원문 유사성 자체 점검 (9개 항목) ---------------- */
  /* ⚠️ 아래 9개 항목 이름은 임시입니다.
     다음 단계에서 회사 재가공 지침 전문을 받으면 실제 항목명으로 교체합니다. */
  similarityChecks: [
    {
      no: 1,
      label: "원문 제목을 그대로 또는 유사하게 사용하지 않았는가",
      verdict: "적합",
      note: "제목을 사실 중심으로 새로 작성함",
    },
    {
      no: 2,
      label: "원문 문장을 그대로 옮긴 부분이 없는가",
      verdict: "적합",
      note: "모든 문장을 재작성함",
    },
    {
      no: 3,
      label: "원문의 문단 순서·구조를 따라가지 않았는가",
      verdict: "수정 필요",
      note: "'제품 → 투자' 순서가 원문과 동일함. 소제목 순서 조정을 검토하세요.",
    },
    {
      no: 4,
      label: "원문 고유의 표현·비유를 재사용하지 않았는가",
      verdict: "적합",
      note: "과장 수식어 및 비유 표현을 모두 제외함 (B항목 참고)",
    },
    {
      no: 5,
      label: "기자의 평가·해석·전망이 포함되지 않았는가",
      verdict: "적합",
      note: "전망성 서술 1건을 제외함 (B항목 참고)",
    },
    {
      no: 6,
      label: "직접 인용문을 사용하지 않았는가",
      verdict: "적합",
      note: "인용문 1건을 제외함 (B항목 참고)",
    },
    {
      no: 7,
      label: "원문에 없는 사실을 추가하지 않았는가",
      verdict: "적합",
      note: "A항목의 사실 범위를 벗어나지 않음",
    },
    {
      no: 8,
      label: "수치·날짜·고유명사가 원문과 일치하는가",
      verdict: "적합",
      note: "2024년, 도쿄증권거래소 스탠다드 시장, 푸바브레인 — 일치 확인",
    },
    {
      no: 9,
      label: "출처 안내가 규정 형식에 맞는가",
      verdict: "적합",
      note: "표준 출처 문구를 사용함",
    },
  ],
};

/** [영어 번역] 버튼을 눌렀을 때 표시되는 가짜 영어 원고 */
export const DUMMY_ENGLISH_DRAFT: TranslatedDraft = {
  title:
    "Quad Miners Expands Japan Operations Across Finance and Public Sectors, Secures Equity Investment from Listed Local Partner",
  summary:
    "Quad Miners is expanding its operations in Japan through its local entity, Quad Miners Japan, with a focus on the finance and public sectors. Its flagship product is Network Blackbox, an NDR solution that captures and analyzes network traffic at the packet level.",
  bodyBlocks: [
    {
      id: "en-1",
      subhead: "Expanding in Japan through Quad Miners Japan",
      paragraphs:
        "The company's operations in Japan are handled by its local entity, Quad Miners Japan, which runs proofs of concept (PoC) with regional financial institutions, municipalities, and manufacturers.",
      bullets: [],
    },
    {
      id: "en-2",
      subhead: "Flagship Product: Network Blackbox",
      paragraphs:
        "Network Blackbox is an NDR (Network Detection and Response) solution that collects and analyzes network traffic at the packet level.",
      bullets: [
        "Collection unit: packet",
        "Use case: network anomaly detection and analysis",
        "Target sectors: finance, public, manufacturing",
      ],
    },
    {
      id: "en-3",
      subhead: "Local Investment and Partnership",
      paragraphs:
        "In 2024, Quad Miners secured an equity investment from Fubabrain, a company listed on the Tokyo Stock Exchange Standard Market.",
      bullets: [],
    },
  ],
  seoTitle: "Quad Miners Expands in Japan's Finance & Public Sectors",
  metaDescription:
    "Quad Miners grows its Japan business with its NDR solution Network Blackbox and a local equity investment.",
  urlSlug: "quad-miners-japan-expansion",
  sourceNote:
    "Reconstructed from objectively verified facts in the original report.",
};

/** [일본어 번역] 버튼을 눌렀을 때 표시되는 가짜 일본어 원고 */
export const DUMMY_JAPANESE_DRAFT: TranslatedDraft = {
  title:
    "クアッドマイナー、日本法人を中心に金融・公共分野へ事業拡大　現地上場企業から出資を受ける",
  summary:
    "クアッドマイナーは日本法人クアッドマイナー・ジャパンを通じて、金融・公共分野を中心に日本での事業を拡大している。主力製品は、ネットワーク通信をパケット単位で収集・分析するNDRソリューション「ネットワークブラックボックス」である。",
  bodyBlocks: [
    {
      id: "ja-1",
      subhead: "日本法人を通じた事業展開",
      paragraphs:
        "日本事業は現地法人クアッドマイナー・ジャパンが担当し、地域金融機関・自治体・製造業を対象にPoCを進めている。",
      bullets: [],
    },
    {
      id: "ja-2",
      subhead: "主力製品「ネットワークブラックボックス」",
      paragraphs:
        "ネットワークブラックボックスは、ネットワーク通信をパケット単位で収集・分析するNDRソリューションである。",
      bullets: [
        "収集単位：パケット",
        "用途：ネットワーク異常行為の検知・分析",
        "主な対象分野：金融、公共、製造",
      ],
    },
    {
      id: "ja-3",
      subhead: "現地での出資・提携",
      paragraphs:
        "2024年、東京証券取引所スタンダード市場の上場企業フバブレインから出資を受けた。",
      bullets: [],
    },
  ],
  seoTitle: "クアッドマイナー、日本の金融・公共分野で事業拡大",
  metaDescription:
    "NDRソリューション「ネットワークブラックボックス」と現地出資により日本事業を拡大。",
  urlSlug: "quad-miners-japan-expansion",
  sourceNote: "客観的に確認された事実に基づき再構成。",
};
