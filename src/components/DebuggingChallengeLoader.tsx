"use client";

import dynamic from "next/dynamic";

const DebuggingChallenge = dynamic(
  () =>
    import("@/components/DebuggingChallenge").then((mod) => mod.DebuggingChallenge),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-dvh items-center justify-center bg-[#ffd6e8] font-mono text-sm text-black/55">
        Loading challenge…
      </div>
    ),
  },
);

export function DebuggingChallengeLoader() {
  return <DebuggingChallenge />;
}
