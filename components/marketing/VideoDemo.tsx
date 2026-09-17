"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics";

import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/** Progress milestones, reported once each per view. */
const PROGRESS_MILESTONES = [25, 50, 75] as const;
const PROGRESS_EVENTS = {
  25: "video_25_percent",
  50: "video_50_percent",
  75: "video_75_percent",
} as const;

const PlayGlyph = ({ className }: { className?: string }) => (
  <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true" className={className}>
    <path d="M2 1.6 18 11 2 20.4z" fill="currentColor" />
  </svg>
);

/**
 * Product video.
 *
 * Three states, and the distinction matters:
 *
 *   1. No asset configured — a composed "coming soon" panel. Honest, and the same
 *      server-rendered and client-rendered, so nothing contradictory reaches a
 *      crawler.
 *   2. Asset configured but not yet approached — a poster shell. Nothing is
 *      fetched until the section is within 300px of the viewport, so a page view
 *      costs no media bytes.
 *   3. In view — the native player (or a hosted embed), instrumented for
 *      loaded/play/pause/complete plus 25/50/75% progress.
 *
 * With an iframe only the events the provider actually exposes can be measured;
 * this component records the load and never pretends to know more than that.
 */
export function VideoDemo({
  videoSrc,
  posterSrc,
  embedUrl,
}: {
  videoSrc: string | null;
  posterSrc: string | null;
  embedUrl?: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const milestones = useRef<Set<number>>(new Set());

  const useEmbed = !videoSrc && Boolean(embedUrl);
  const hasMedia = Boolean(videoSrc) || useEmbed;

  useEffect(() => {
    if (!hasMedia) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMedia]);

  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(true);
    void video.play();
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || !Number.isFinite(video.duration)) return;

    const progress = video.currentTime / video.duration;
    for (const threshold of PROGRESS_MILESTONES) {
      if (progress >= threshold / 100 && !milestones.current.has(threshold)) {
        milestones.current.add(threshold);
        trackEvent(PROGRESS_EVENTS[threshold], { asset: "dispense-demo" });
      }
    }
  }, []);

  return (
    <section id="demo" className="section-tight">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Demo"
            title="See Dispense in action."
            description="A short walkthrough of setting up sub-wallets, scheduling a payout and reading the activity history."
            align="center"
            className="mx-auto items-center"
          />
        </Reveal>

        <Reveal className="mt-12" y={30}>
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-[24px] border border-line bg-night"
          >
            {/* Aspect-ratio box: the player can never overflow or shift the page,
                at any width from 320px up. */}
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
              {!hasMedia ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-8 text-center">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 grid-atmosphere-dark opacity-40"
                    style={{
                      maskImage: "radial-gradient(60% 60% at 50% 40%, #000 0%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(60% 60% at 50% 40%, #000 0%, transparent 75%)",
                    }}
                  />
                  <span className="relative flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/75">
                    <PlayGlyph />
                  </span>
                  <div className="relative flex flex-col gap-2">
                    <span className="t-h3 text-white">Product demo coming soon</span>
                    <span className="t-small mx-auto max-w-[42ch] text-white/60">
                      A 30–60 second walkthrough of the app will be published here. The app itself is
                      available to explore first through the screens on this page.
                    </span>
                  </div>
                </div>
              ) : shouldLoad && useEmbed && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Dispense product demo"
                  loading="lazy"
                  className="absolute inset-0 size-full border-0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  onLoad={() => {
                    setLoaded(true);
                    trackEvent("video_loaded", { asset: "embed" });
                  }}
                />
              ) : shouldLoad && videoSrc ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 size-full object-cover"
                    src={videoSrc}
                    poster={posterSrc ?? undefined}
                    preload="metadata"
                    playsInline
                    controls={playing}
                    onLoadedMetadata={() => {
                      setLoaded(true);
                      trackEvent("video_loaded", { asset: "dispense-demo" });
                    }}
                    onPlay={() => {
                      setPlaying(true);
                      trackEvent("video_play", { asset: "dispense-demo" });
                    }}
                    onPause={() => {
                      setPlaying(false);
                      if (loaded) trackEvent("video_pause", { asset: "dispense-demo" });
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                      setPlaying(false);
                      trackEvent("video_complete", { asset: "dispense-demo" });
                    }}
                  />
                  {!playing ? (
                    <button
                      type="button"
                      onClick={handlePlay}
                      className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-night/70 transition-colors hover:bg-night/60"
                    >
                      <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-brand shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105">
                        <PlayGlyph />
                      </span>
                      <span className="text-[0.9375rem] font-semibold text-white">
                        Play the 30-second demo
                      </span>
                    </button>
                  ) : null}
                </>
              ) : (
                /* Media exists but has not been approached yet: a poster shell,
                   so the page ships no media bytes and no contradictory copy. */
                <div className="absolute inset-0">
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 1240px"
                      className="object-cover opacity-70"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-night/55" />
                  <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/70">
                    <PlayGlyph />
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-white/60">
                {["Wallet and sub-wallets", "Scheduling a payout", "Activity history"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="pill w-fit border-white/15 bg-white/[0.06] text-white/70">
                {hasMedia ? "Ready to play" : "Awaiting final asset"}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
