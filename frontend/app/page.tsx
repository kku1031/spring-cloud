'use client';
//기능을 객체로 만들어서 사용하는 것, 노테이션이다 -> 객체다 -> {}안은 동사다 기능이다 , 객체이름이 리액트다, 훅
import { useMemo, useState } from "react";

// API Gateway를 통한 검색 (브라우저 → Next.js API Routes)
const SEARCH_ENDPOINT = "/api/search";

// 타입은 대문자로 둬야하니까 Home(), 함수
export default function Home() {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("player");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      { value: "player", label: "선수" },
      { value: "team", label: "팀" },
      { value: "schedule", label: "경기 일정" },
      { value: "stadium", label: "경기장" },
    ],
    []
  );

  const handleButtonClick = async () => {
    const trimmed = question.trim();

    if (!trimmed) {
      alert("검색어를 입력해 주세요.");
      return;
    }

    console.log("[Browser] 검색 실행", { domain: category, keyword: trimmed });

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      // POST /api/search → Next.js API Routes → API Gateway → Soccer Service
      const response = await fetch(SEARCH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: category,
          keyword: trimmed,
        }),
      });

      if (!response.ok) {
        const fallback = await response.json().catch(() => null);
        throw new Error(
          fallback?.message ?? `검색 요청에 실패했습니다. (code: ${response.status})`
        );
      }

      const data = await response.json();
      console.log("[Browser] 검색 응답:", data);
      setMessage(data?.message ?? "검색이 완료되었습니다.");
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      console.error("[Browser] 검색 오류:", reason);
      setError(reason);
    } finally {
      setIsLoading(false);
    }
  };
  //자바에서 람다가, 리액트에서 컴포넌트(속성 : 상태 과 기능 : 훅 가져야함), retrun = 렌더링 => 전체를 컴포넌트라함 <가 돔, 감사는거 래핑, 노테이션을 줄때 객체가됨
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {/* 제목 */}
        <div className="w-full flex flex-col items-center gap-4 text-black">
          <h1 className="text-3xl sm:text-4xl font-semibold text-center">
            자바 & 프롬프트 구조 이해하기
          </h1>

          <div className="w-full rounded-3xl border border-gray-200 bg-gray-50/80 p-6 shadow-sm space-y-6 text-left">
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                자료 구조 비유
              </p>
              <p className="mt-2 text-base leading-relaxed text-gray-700">
                자바의 <span className="font-semibold text-gray-900">리스트, 맵(힙)</span> ↔
                프롬프트(커맨드: CLI)의{" "}
                <span className="font-semibold text-gray-900">스택</span>
                <span className="text-sm text-gray-500"> (접시, 위에꺼 먼저 씀)</span>,
                <span className="font-semibold text-gray-900"> 큐</span>
                <span className="text-sm text-gray-500">
                  {" "}
                  (FIFO - 피포, 먼저 온놈이 먼저 타는거, 선입선출)
                </span>
              </p>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                행동 패턴
              </p>
              <p className="mt-2 text-base leading-relaxed text-gray-700">
                <span className="font-semibold text-gray-900">커맨드 패턴</span> :
                만든걸 객체로 만들고 사용만 하게 하는 것 , Git git = new Git 깃을 우리가 쓸때 실제 인스턴스만 가져와서 쓰는 것 처럼 하는게 패턴.
              </p>
            </section>
          </div>
        </div>

        {/* 입력 필드 */}
        <div className="w-full relative">
          <div className="flex flex-col gap-3 px-4 py-4 border border-gray-300 rounded-2xl bg-white shadow-sm hover:border-gray-400 transition-colors">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-[0.3em]">
                Search Category
              </label>
              <select
                className="w-full sm:w-auto rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-gray-400 focus:outline-none"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {/* 플러스 아이콘 */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* 입력 필드 */}
              <input
                type="text"
                placeholder="무엇이든 물어보세요"
                className="flex-1 outline-none text-gray-500 placeholder:text-gray-400 bg-transparent"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />

              {/* 마이크 아이콘 */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <path
                  d="M10 2C8.89543 2 8 2.89543 8 4V10C8 11.1046 8.89543 12 10 12C11.1046 12 12 11.1046 12 10V4C12 2.89543 11.1046 2 10 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 10V11C5 13.7614 7.23858 16 10 16C12.7614 16 15 13.7614 15 11V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 16V18M6 18H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* 사운드 웨이브 아이콘이 있는 원형 버튼 */}
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity"
                onClick={handleButtonClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8H4M6 4V12M10 2V14M12 6V10M14 8H16"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="mt-1 flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? "검색 중..." : "검색 실행"}
            </button>
          </div>
          {message && (
            <p className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
