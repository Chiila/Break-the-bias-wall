"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Station soundtrack — plays through YouTube’s embed (no audio file extraction). */
const VIDEO_ID = "Yj9nQbcMBgk";

type YTPlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YTPlayerConstructor = new (
  hostId: string,
  opts: Record<string, unknown>,
) => YTPlayerInstance;

type WindowWithYT = Window & {
  YT?: { Player: YTPlayerConstructor };
  onYouTubeIframeAPIReady?: () => void;
};

function loadIframeApi(): Promise<void> {
  const w = window as WindowWithYT;
  if (w.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => resolve();
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      done();
    };

    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      )
    ) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.body.appendChild(s);
    }

    const poll = window.setInterval(() => {
      if (w.YT?.Player) {
        window.clearInterval(poll);
        done();
      }
    }, 50);

    window.setTimeout(() => {
      window.clearInterval(poll);
      if (w.YT?.Player) done();
    }, 15000);
  });
}

export function YouTubeMusicToggle() {
  const hostId = useRef(`yt-music-${Math.random().toString(36).slice(2, 11)}`);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const readyRef = useRef<Promise<void> | null>(null);
  const [on, setOn] = useState(false);

  const destroyPlayer = useCallback(() => {
    playerRef.current?.destroy();
    playerRef.current = null;
    readyRef.current = null;
  }, []);

  useEffect(() => () => destroyPlayer(), [destroyPlayer]);

  const ensurePlayer = useCallback(async () => {
    if (playerRef.current) return;
    await loadIframeApi();
    const w = window as WindowWithYT;
    const Player = w.YT?.Player;
    if (!Player) return;

    await new Promise<void>((resolve) => {
      playerRef.current = new Player(hostId.current, {
        videoId: VIDEO_ID,
        width: "160",
        height: "90",
        playerVars: {
          autoplay: 0,
          loop: 1,
          playsinline: 1,
          playlist: VIDEO_ID,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => resolve(),
          onError: () => resolve(),
        },
      });
    });
  }, []);

  const toggle = async () => {
    if (on) {
      playerRef.current?.pauseVideo();
      setOn(false);
      return;
    }
    try {
      if (!readyRef.current) {
        readyRef.current = ensurePlayer();
      }
      await readyRef.current;
      if (!playerRef.current) return;
      playerRef.current.playVideo();
      setOn(true);
    } catch {
      setOn(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[11rem] flex-col items-end gap-2">
      <div
        id={hostId.current}
        className={
          on
            ? "h-[90px] w-40 overflow-hidden rounded-lg border-2 border-black shadow-[3px_3px_0_0_#000]"
            : "pointer-events-none fixed left-[-9999px] top-0 h-[90px] w-40 overflow-hidden opacity-0"
        }
        aria-hidden={!on}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Pause YouTube music" : "Play YouTube music"}
        className="flex items-center gap-2 rounded-full border-2 border-black bg-white/95 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-black shadow-[3px_3px_0_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
      >
        <span className="text-base leading-none" aria-hidden>
          {on ? "♪" : "♫"}
        </span>
        {on ? "Music on" : "Music"}
      </button>
      <span className="text-right font-mono text-[10px] text-black/45">
        Plays on YouTube — tap Music
      </span>
    </div>
  );
}
