/** 화면 아래에 잠깐 떴다 사라지는 안내 메시지 */
export default function Toast({ message }: { message: string }) {
  return (
    <div className={message ? "toast show" : "toast"} role="status" aria-live="polite">
      {message}
    </div>
  );
}
