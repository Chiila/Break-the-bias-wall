"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BIASES,
  CORRUPTED_CODE_SEGMENTS,
  isValidSecretPhrase,
} from "@/data/biases";
import { YouTubeMusicToggle } from "@/components/YouTubeMusicToggle";

type Phase = "code" | "finish";

const HOT_PINK = "#FF69B4";
const HIGHLIGHTER = "#FFF44F";

const CONFETTI_COLORS = [
  HOT_PINK,
  HIGHLIGHTER,
  "#FFB7D9",
  "#ff8cc8",
  "#d81b60",
  "#fce4ec",
  "#1a1a1a",
];

const WALL_SHARDS = Array.from({ length: BIASES.length }, (_, i) => ({
  id: i,
  x: Math.sin(i * 1.73) * 210,
  y: Math.cos(i * 2.09) * 210,
  rot: ((i * 23) % 90) - 45,
}));

export function DebuggingChallenge() {
  const [patches, setPatches] = useState<Record<string, string>>({});
  const [modalBiasId, setModalBiasId] = useState<string | null>(null);
  const [patchDraft, setPatchDraft] = useState("");
  const [phraseBuffer, setPhraseBuffer] = useState("");
  const [phraseShake, setPhraseShake] = useState(false);
  const [phase, setPhase] = useState<Phase>("code");
  const keypadSectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const allPatched = BIASES.every(
    (b) => (patches[b.id]?.trim().length ?? 0) > 0,
  );

  useEffect(() => {
    if (allPatched && phase === "code") {
      keypadSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [allPatched, phase]);

  useEffect(() => {
    if (phase !== "finish" || reduceMotion) return;

    const z = 250;
    const burst = () => {
      void confetti({
        particleCount: 110,
        spread: 78,
        startVelocity: 38,
        origin: { y: 0.62, x: 0.5 },
        colors: CONFETTI_COLORS,
        zIndex: z,
        scalar: 1.05,
      });
    };

    const sides = () => {
      void confetti({
        particleCount: 55,
        angle: 60,
        spread: 58,
        origin: { x: 0, y: 0.68 },
        colors: CONFETTI_COLORS,
        zIndex: z,
      });
      void confetti({
        particleCount: 55,
        angle: 120,
        spread: 58,
        origin: { x: 1, y: 0.68 },
        colors: CONFETTI_COLORS,
        zIndex: z,
      });
    };

    const t0 = window.setTimeout(burst, 80);
    const t1 = window.setTimeout(sides, 300);

    const until = Date.now() + 2400;
    const stream = window.setInterval(() => {
      if (Date.now() > until) {
        window.clearInterval(stream);
        return;
      }
      void confetti({
        particleCount: 3,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.72 },
        colors: CONFETTI_COLORS,
        zIndex: z,
      });
      void confetti({
        particleCount: 3,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.72 },
        colors: CONFETTI_COLORS,
        zIndex: z,
      });
    }, 140);

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearInterval(stream);
    };
  }, [phase, reduceMotion]);

  const openModal = (id: string) => {
    setModalBiasId(id);
    setPatchDraft(patches[id] ?? "");
  };

  const closeModal = () => {
    setModalBiasId(null);
    setPatchDraft("");
  };

  const savePatch = () => {
    if (!modalBiasId || !patchDraft.trim()) return;
    setPatches((p) => ({ ...p, [modalBiasId]: patchDraft.trim() }));
    closeModal();
  };

  const appendToPhrase = (ch: string) => {
    if (phraseBuffer.length >= 96) return;
    setPhraseBuffer((k) => k + ch);
  };

  const appendWordChip = (word: string) => {
    setPhraseBuffer((p) => {
      const next =
        p.length === 0
          ? word
          : p.endsWith(" ")
            ? `${p}${word}`
            : `${p} ${word}`;
      return next.slice(0, 96);
    });
  };

  const backspacePhrase = () => setPhraseBuffer((k) => k.slice(0, -1));

  const tryExecute = useCallback(() => {
    if (isValidSecretPhrase(phraseBuffer)) {
      setPhase("finish");
      return;
    }
    setPhraseShake(true);
    setTimeout(() => setPhraseShake(false), 500);
  }, [phraseBuffer]);

  const restart = () => {
    setPatches({});
    setModalBiasId(null);
    setPatchDraft("");
    setPhraseBuffer("");
    setPhase("code");
  };

  const activeBias = modalBiasId
    ? BIASES.find((b) => b.id === modalBiasId)
    : null;

  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-8 pt-4">
      <YouTubeMusicToggle />
      <DoodleLayer />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4 sm:gap-12 md:gap-16">
        <Image
          src="/AWSCC.png"
          alt="AWSCC logo"
          width={480}
          height={192}
          className="h-24 w-auto max-h-32 object-contain sm:h-32 sm:max-h-40 md:h-40 md:max-h-48"
          priority
        />
        <Image
          src="/AWSUG.png"
          alt="AWS User Group logo"
          width={480}
          height={192}
          className="h-24 w-auto max-h-32 object-contain sm:h-32 sm:max-h-40 md:h-40 md:max-h-48"
          priority
        />
      </div>

      <header className="relative z-10 mx-auto max-w-4xl px-4 pt-4 text-center">
        <p
          className="font-hand text-2xl text-black drop-shadow-sm sm:text-3xl"
          style={{ color: "#1a1a1a" }}
        >
          The Tech Burn Book presents…
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-black sm:text-4xl">
          <span style={{ color: HOT_PINK }}>The Debugging Challenge</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-hand text-lg text-black/85">
          Tap all 15 biased “bugs” in the corrupted code. Patch each with the
          real truth. Then enter the wall passphrase.
        </p>
      </header>

      <main className="relative z-10 mx-auto mt-8 max-w-4xl px-4">
        <AnimatePresence mode="wait">
          {phase !== "finish" && (
            <motion.section
              key="challenge"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="space-y-8"
            >
              <NotebookCodeBlock
                patches={patches}
                onBugClick={openModal}
              />

              <motion.section
                ref={keypadSectionRef}
                className="rounded-2xl border-2 border-black bg-[#ffe4ef] p-4 shadow-[4px_4px_0_0_#000]"
                initial={false}
                animate={{
                  opacity: allPatched ? 1 : 0.45,
                  filter: allPatched ? "none" : "grayscale(0.15)",
                  scale: allPatched ? 1 : 0.98,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-black">
                    Break the wall — passphrase console
                  </h2>
                  {!allPatched && (
                    <span className="font-hand text-base text-black/70">
                      Patch all 15 biases to unlock
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs text-black/60">
                  Type or tap keys. Wrong tries shake the console — the phrase
                  isn&apos;t shown.
                </p>

                <div className="mt-4">
                  <PassphraseConsole
                    disabled={!allPatched}
                    value={phraseBuffer}
                    shake={phraseShake}
                    onChange={setPhraseBuffer}
                    onAppend={appendToPhrase}
                    onAppendWord={appendWordChip}
                    onBack={backspacePhrase}
                    onClear={() => setPhraseBuffer("")}
                    onEnter={tryExecute}
                  />
                </div>
              </motion.section>
            </motion.section>
          )}

          {phase === "finish" && (
            <FinishScreen
              key="finish"
              shards={WALL_SHARDS}
              onRestart={restart}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeBias && (
          <PatchModal
            bias={activeBias}
            draft={patchDraft}
            onDraft={setPatchDraft}
            onClose={closeModal}
            onSave={savePatch}
          />
        )}
      </AnimatePresence>

      <footer
        className="relative z-10 mx-auto mt-14 max-w-4xl border-t-2 border-dashed border-black/25 px-4 pb-10 pt-8 text-center"
        role="contentinfo"
      >
        <p className="font-hand text-xl text-black sm:text-2xl">
          <span className="font-semibold">HERmazing Race</span>
          <span className="text-black/75">: Run the World</span>
        </p>
        <p className="mt-2 font-mono text-sm uppercase tracking-widest text-black/50">
          by Seala
        </p>
      </footer>
    </div>
  );
}

function DoodleLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute -left-4 top-24 h-24 w-24 rotate-12 opacity-35"
        viewBox="0 0 100 100"
      >
        <path
          d="M50 20 C35 35 25 55 50 85 C75 55 65 35 50 20"
          fill="none"
          stroke="#c2185b"
          strokeWidth="4"
        />
      </svg>
      <svg
        className="absolute right-8 top-40 h-16 w-16 -rotate-6 opacity-40"
        viewBox="0 0 100 100"
      >
        <path
          d="M50 10 L61 40 L95 40 L68 62 L79 95 L50 72 L21 95 L32 62 L5 40 L39 40 Z"
          fill="none"
          stroke="#000"
          strokeWidth="3"
        />
      </svg>
      <svg
        className="absolute bottom-32 left-1/4 h-20 w-20 opacity-30"
        viewBox="0 0 100 100"
      >
        <path
          d="M20 50 L50 15 L80 50 L50 85 Z"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="5"
        />
      </svg>
      <div
        className="absolute right-[12%] top-[18%] h-14 w-14 rotate-[-15deg] rounded-full border-4 border-[#d81b60]/50"
        style={{ boxShadow: "inset 0 0 0 8px rgba(216,27,96,0.15)" }}
      />
    </div>
  );
}

function NotebookCodeBlock({
  patches,
  onBugClick,
}: {
  patches: Record<string, string>;
  onBugClick: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="relative mx-auto max-w-3xl"
      initial={false}
      animate={{ rotate: 0.4 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <div className="tape tape-tl" aria-hidden />
      <div className="tape tape-tr" aria-hidden />
      <div className="notebook-paper max-h-[min(70vh,720px)] overflow-y-auto border-2 border-black px-4 py-5 shadow-[6px_6px_0_0_rgba(0,0,0,0.85)] sm:px-7 sm:py-7">
        <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-dashed border-black/25 pb-2">
          <span className="font-hand text-xl text-black">corrupted_logic.js</span>
          <span className="font-mono text-[10px] uppercase text-black/50">
            do not compile{" "}
            <motion.span
              className="inline-block text-[#c62828]"
              aria-hidden
              animate={
                reduceMotion
                  ? undefined
                  : {
                      rotate: [0, 18, -14, 12, 0],
                      scale: [1, 1.35, 1.2, 1.35, 1],
                    }
              }
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✗
            </motion.span>{" "}
            · 15 bugs
          </span>
        </div>
        <div
          role="region"
          aria-label="Corrupted source code"
          className="font-mono text-[0.65rem] leading-relaxed text-black sm:text-sm whitespace-pre-wrap break-words"
        >
          {CORRUPTED_CODE_SEGMENTS.map((seg, i) => {
            if (seg.kind === "text") {
              return (
                <span key={i} className="text-black/55">
                  {seg.value}
                </span>
              );
            }
            const bias = BIASES.find((b) => b.id === seg.id);
            if (!bias) return null;
            return (
              <BugChip
                key={i}
                bias={bias}
                patched={patches[bias.id]}
                onClick={() => onBugClick(bias.id)}
              />
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

function BugChip({
  bias,
  patched,
  onClick,
}: {
  bias: (typeof BIASES)[number];
  patched?: string;
  onClick: () => void;
}) {
  const isDone = Boolean(patched?.trim());
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-0.5 inline cursor-pointer rounded px-1 py-0.5 align-baseline font-hand text-base transition-colors sm:text-lg"
      style={{
        backgroundColor: isDone ? HIGHLIGHTER : "transparent",
        boxShadow: isDone
          ? "0 0 0 2px #000"
          : `0 2px 0 0 ${HOT_PINK}, inset 0 -2px 0 0 ${HOT_PINK}`,
      }}
    >
      <span className={isDone ? "line-through decoration-2 decoration-black/40" : ""}>
        &quot;{bias.bugSnippet}&quot;
      </span>
      {isDone && (
        <span className="ml-1 font-mono text-[10px] font-bold text-green-800">
          ✓
        </span>
      )}
    </button>
  );
}

function PatchModal({
  bias,
  draft,
  onDraft,
  onClose,
  onSave,
}: {
  bias: (typeof BIASES)[number];
  draft: string;
  onDraft: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close patch modal"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patch-modal-title"
        className="relative z-10 w-full max-w-md"
        initial={false}
        animate={{ scale: 1, rotate: -2, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, rotate: 4, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div
          className="sticky-note border-2 border-black px-5 py-5 shadow-[8px_8px_0_0_#000]"
          style={{ background: "#fffef0" }}
        >
          <p
            id="patch-modal-title"
            className="font-hand text-2xl font-semibold text-black"
          >
            What&apos;s the real truth?
          </p>
          <p className="mt-2 font-mono text-xs text-black/70">
            Bias flagged:{" "}
            <span className="font-bold text-black">{bias.bugSnippet}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] text-black/55">
            Patch goal: {bias.patchGoal}
          </p>
          <label className="mt-4 block font-mono text-xs font-bold uppercase tracking-wide text-black">
            Empowering patch
            <textarea
              value={draft}
              onChange={(e) => onDraft(e.target.value)}
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2 font-hand text-lg text-black shadow-[3px_3px_0_0_#FF69B4] outline-none focus:ring-2 focus:ring-[#FFF44F]"
              placeholder="Write what your team stands for…"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={!draft.trim()}
              className="rounded-full border-2 border-black bg-[#FF69B4] px-5 py-2 font-mono text-sm font-bold text-black shadow-[3px_3px_0_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40"
            >
              Save patch
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-dashed border-black bg-transparent px-4 py-2 font-hand text-lg text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const QWERTY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

const WORD_CHIPS = ["BIAS", "ENDS", "WHERE", "COURAGE", "BEGINS"] as const;

function PassphraseConsole({
  disabled,
  value,
  shake,
  onChange,
  onAppend,
  onAppendWord,
  onBack,
  onClear,
  onEnter,
}: {
  disabled: boolean;
  value: string;
  shake: boolean;
  onChange: (v: string) => void;
  onAppend: (c: string) => void;
  onAppendWord: (w: string) => void;
  onBack: () => void;
  onClear: () => void;
  onEnter: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-2xl border-2 border-black p-3 sm:p-4 ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
      style={{
        background: `linear-gradient(145deg, ${HOT_PINK} 0%, #ffb7d9 50%, #ff8cc8 100%)`,
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35)",
      }}
    >
      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-black/80">
        Passphrase entry
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 96))}
          disabled={disabled}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          className="mt-2 w-full rounded-lg border-2 border-black bg-black px-3 py-3 font-mono text-base text-[#FFF44F] shadow-[inset_0_2px_0_rgba(255,255,255,0.08)] outline-none ring-offset-2 focus:ring-2 focus:ring-[#FFF44F] disabled:opacity-60 sm:text-lg"
          placeholder="Tap keys or type here…"
        />
      </label>

      <p className="mt-2 font-hand text-sm text-black/80">
        Word chips (adds a space between words):
      </p>
      <div className="mt-1 flex flex-wrap gap-2">
        {WORD_CHIPS.map((w) => (
          <button
            key={w}
            type="button"
            disabled={disabled}
            onClick={() => onAppendWord(w)}
            className="rounded-full border-2 border-black bg-[#FFF44F] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 sm:text-sm"
          >
            {w}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {QWERTY_ROWS.map((row, ri) => (
          <div
            key={ri}
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
          >
            {row.map((k) => (
              <button
                key={k}
                type="button"
                disabled={disabled}
                onClick={() => onAppend(k)}
                className="min-h-11 min-w-9 rounded-lg border-2 border-black bg-white/95 py-2 font-mono text-sm font-bold text-black shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 sm:min-w-10 sm:text-base"
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAppend(" ")}
          className="min-h-11 flex-1 rounded-lg border-2 border-black bg-white/95 py-2 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-[2px_2px_0_0_#000] sm:text-sm"
        >
          Space
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onBack}
          className="min-h-11 min-w-[4.5rem] rounded-lg border-2 border-black bg-white/95 py-2 font-mono text-sm font-bold text-black shadow-[2px_2px_0_0_#000]"
          aria-label="Backspace"
        >
          ⌫
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          className="min-h-11 min-w-[4.5rem] rounded-lg border-2 border-dashed border-black bg-[#ffe4ef] py-2 font-mono text-xs font-bold uppercase text-black"
        >
          Clear
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onEnter}
        className="mt-4 w-full rounded-xl border-2 border-black bg-black py-3 font-mono text-sm font-bold uppercase tracking-widest text-[#FFF44F] shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] active:translate-x-0.5 active:translate-y-0.5"
      >
        Execute patch
      </button>
    </motion.div>
  );
}

function FinishScreen({
  shards,
  onRestart,
}: {
  shards: typeof WALL_SHARDS;
  onRestart: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-2"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full overflow-hidden rounded-2xl border-4 border-black bg-[#fff8fc] shadow-[8px_8px_0_0_#000]">
        <div className="relative aspect-[4/3] w-full">
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6"
            initial={false}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="font-hand text-3xl text-black">Bias Wall</p>
            <p className="max-w-sm text-center font-mono text-xs text-black/60">
              (the page we&apos;re done with)
            </p>
          </motion.div>

          {shards.map((s) => (
            <motion.div
              key={s.id}
              className="absolute left-1/2 top-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2 border border-black/20 bg-gradient-to-br from-[#FF69B4]/80 to-[#ffe4ef]"
              style={{ clipPath: "polygon(20% 0%, 100% 10%, 90% 100%, 0% 85%)" }}
              initial={false}
              animate={{
                x: s.x,
                y: s.y,
                rotate: s.rot,
                opacity: 0,
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))}

          <motion.svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 400 300"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <motion.g
              style={{ transformOrigin: "200px 150px" }}
              initial={false}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      rotate: [0, 2.5, -2, 1.8, 0],
                      scale: [1, 1.04, 0.98, 1.03, 1],
                    }
              }
              transition={{
                delay: 1.05,
                duration: 3.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.path
                d="M 40 40 L 360 260"
                stroke="#d50000"
                strokeWidth="14"
                strokeLinecap="round"
                initial={false}
                animate={
                  reduceMotion
                    ? { pathLength: 1, opacity: 1 }
                    : {
                        pathLength: 1,
                        opacity: [0.75, 1, 0.82, 1, 0.75],
                      }
                }
                transition={
                  reduceMotion
                    ? { delay: 0.5, duration: 0.45, ease: "easeInOut" }
                    : {
                        pathLength: { delay: 0.5, duration: 0.45, ease: "easeInOut" },
                        opacity: {
                          delay: 1.05,
                          duration: 2.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
              />
              <motion.path
                d="M 360 50 L 50 250"
                stroke="#d50000"
                strokeWidth="14"
                strokeLinecap="round"
                initial={false}
                animate={
                  reduceMotion
                    ? { pathLength: 1, opacity: 1 }
                    : {
                        pathLength: 1,
                        opacity: [0.82, 0.78, 1, 0.88, 0.82],
                      }
                }
                transition={
                  reduceMotion
                    ? { delay: 0.62, duration: 0.45, ease: "easeInOut" }
                    : {
                        pathLength: { delay: 0.62, duration: 0.45, ease: "easeInOut" },
                        opacity: {
                          delay: 1.15,
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
              />
            </motion.g>
          </motion.svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center">
            <motion.p
              className="font-mono text-2xl font-black uppercase text-black sm:text-4xl"
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 16 }}
            >
              Wall{" "}
              <span style={{ color: HOT_PINK }}>debugged</span>
            </motion.p>
            <motion.p
              className="font-hand text-xl text-black sm:text-2xl"
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.05 }}
            >
              That&apos;s not fetch — you broke the bias.
            </motion.p>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onRestart}
        className="mt-10 w-full max-w-md rounded-full border-4 border-black bg-[#FFF44F] px-8 py-4 font-mono text-lg font-black uppercase tracking-widest text-black shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 sm:text-xl"
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 180, damping: 18 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Restart challenge
      </motion.button>
    </motion.section>
  );
}
