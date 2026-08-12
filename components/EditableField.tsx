"use client";

import { useEffect, useRef } from "react";

/**
 * 직접 수정할 수 있는 글 칸 (D·E·F에서 사용).
 *
 * 평소에는 그냥 글처럼 보이고, 마우스를 올리거나 클릭하면 편집 칸처럼 보입니다.
 * 글이 길어지면 칸 높이가 자동으로 늘어나서, 안쪽 스크롤바가 생기지 않습니다.
 */
type Props = {
  value: string;
  onChange: (next: string) => void;
  /** 제목처럼 크게 보이게 하려면 "mtitle", 소제목은 "subhead" */
  variant?: "mtitle" | "subhead" | "body";
  placeholder?: string;
  ariaLabel?: string;
};

export default function EditableField({
  value,
  onChange,
  variant = "body",
  placeholder,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // 내용에 맞춰 높이를 자동으로 맞춥니다.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const variantClass = variant === "body" ? "" : ` ${variant}`;

  return (
    <textarea
      ref={ref}
      className={`editable${variantClass}`}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      rows={1}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
