import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "gemini-3.6-flash";
const MAX_TEXT_LENGTH = 100_000;

type GeminiRequest = {
  system?: unknown;
  prompt?: unknown;
  useUrlContext?: unknown;
};

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 Gemini API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  let payload: GeminiRequest;
  try {
    payload = (await request.json()) as GeminiRequest;
  } catch {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if (
    !isText(payload.system) ||
    !isText(payload.prompt) ||
    payload.system.length > MAX_TEXT_LENGTH ||
    payload.prompt.length > MAX_TEXT_LENGTH
  ) {
    return NextResponse.json(
      { error: "AI 요청 내용이 없거나 허용된 길이를 초과했습니다." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: payload.prompt }] }],
          system_instruction: { parts: [{ text: payload.system }] },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
          },
          ...(payload.useUrlContext === true ? { tools: [{ url_context: {} }] } : {}),
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Gemini API 요청에 실패했습니다." },
        { status: response.status >= 500 ? 502 : response.status },
      );
    }

    const data = (await response.json()) as {
      promptFeedback?: { blockReason?: string };
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    if (data.promptFeedback?.blockReason) {
      return NextResponse.json(
        { error: `Gemini 요청이 차단되었습니다: ${data.promptFeedback.blockReason}` },
        { status: 422 },
      );
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      return NextResponse.json(
        { error: "Gemini에서 빈 응답을 반환했습니다." },
        { status: 502 },
      );
    }

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Gemini API와 통신하지 못했습니다." },
      { status: 502 },
    );
  }
}
