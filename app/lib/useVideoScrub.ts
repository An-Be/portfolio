import { useEffect, type RefObject } from "react";

type Options = {
  /** How long the pointer has to sit still before normal playback resumes. */
  idleMs?: number;
  /** 0 to 1. Lower values make scrubbing glide more; higher values snap faster. */
  ease?: number;
};

/**
 * Lets visitors scrub a looping video by moving across it.
 *
 * Desktop: moving the mouse left or right over the area takes over the
 * timeline. Sweeping the full width moves through the whole clip once, so
 * moving faster plays it faster, and moving left plays it backwards.
 * Phones: a horizontal drag does the same, while vertical swipes still scroll.
 * When the pointer stops, the video picks up normal playback from wherever
 * it was left.
 *
 * Needs a video encoded with every frame as a keyframe, otherwise seeking
 * (especially backwards) stutters.
 */
export function useVideoScrub(
  areaRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  { idleMs = 650, ease = 0.22 }: Options = {}
) {
  useEffect(() => {
    const area = areaRef.current;
    const video = videoRef.current;
    if (!area || !video) return;

    // Timeline positions are kept "unwrapped" (they can go past the end or
    // below zero) so easing works across the loop point; wrap() maps them
    // back onto the clip.
    let target: number | null = null;
    let shown = 0;
    let lastX: number | null = null;
    let touchDragging = false;
    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const duration = () =>
      Number.isFinite(video.duration) ? video.duration : 0;

    const wrap = (t: number) => {
      const d = duration();
      return d ? ((t % d) + d) % d : 0;
    };

    const tick = () => {
      raf = 0;
      if (target === null) return;
      shown += (target - shown) * ease;
      const settled = Math.abs(target - shown) < 0.004;
      // Only queue a new seek once the last one has landed, so fast moves
      // don't pile up requests and lag behind the pointer. Keep ticking
      // until the final position has actually been applied.
      if (!video.seeking) {
        video.currentTime = wrap(settled ? target : shown);
        if (settled) return;
      }
      raf = requestAnimationFrame(tick);
    };

    const resume = () => {
      target = null;
      video.play().catch(() => {});
    };

    const scheduleResume = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(resume, idleMs);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !touchDragging) return;
      const d = duration();
      if (!d) return;

      if (lastX === null) {
        lastX = e.clientX;
        return;
      }
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      if (dx === 0) return;

      if (target === null) {
        video.pause();
        shown = target = video.currentTime;
      }
      // One full sweep across the area = one pass through the clip.
      target += (dx / area.clientWidth) * d;
      if (!raf) raf = requestAnimationFrame(tick);
      scheduleResume();
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      touchDragging = true;
      lastX = e.clientX;
    };

    const onEnd = () => {
      touchDragging = false;
      lastX = null;
      if (target !== null) scheduleResume();
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerdown", onDown);
    area.addEventListener("pointerup", onEnd);
    area.addEventListener("pointercancel", onEnd);
    area.addEventListener("pointerleave", onEnd);

    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerdown", onDown);
      area.removeEventListener("pointerup", onEnd);
      area.removeEventListener("pointercancel", onEnd);
      area.removeEventListener("pointerleave", onEnd);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, [areaRef, videoRef, idleMs, ease]);
}
