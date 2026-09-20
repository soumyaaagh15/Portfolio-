/**
 * InfiniteSlider — continuously moving horizontal strip with smooth, game-like motion.
 *
 * Props
 * ─────
 * speed          Normal scroll speed in px/s  (default 50)
 * speedOnHover   Scroll speed while hovering  (default 12)
 * gap            Gap between children in px   (default 24)
 * direction      "left" | "right"             (default "left")
 * children       React nodes (the slide items)
 * pauseOnFocus   Pause when window loses focus (default true)
 */

import {
  useRef,
  useState,
  useEffect,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type CSSProperties,
} from "react";
import { useReducedMotion } from "framer-motion";

export interface InfiniteSliderProps {
  children: ReactNode;
  speed?: number;
  speedOnHover?: number;
  gap?: number;
  direction?: "left" | "right";
  className?: string;
  style?: CSSProperties;
  pauseOnFocus?: boolean;
}

export function InfiniteSlider({
  children,
  speed = 50,
  speedOnHover = 12,
  gap = 24,
  direction = "left",
  className = "",
  style,
  pauseOnFocus = true,
}: InfiniteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const prefersReduced = useReducedMotion();

  // Smoother speed interpolation for buttery motion
  const currentSpeedRef = useRef(speed);
  const targetSpeedRef = useRef(speed);

  // Measure the natural track width once children are rendered
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const firstSet = track.querySelector<HTMLElement>(
        ":scope > .is-slider-set:first-child",
      );
      if (firstSet) setTrackWidth(firstSet.scrollWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [children, gap]);

  // Handle window focus/blur for pause
  useEffect(() => {
    if (!pauseOnFocus) return;
    const onBlur = () => setIsFocused(false);
    const onFocus = () => setIsFocused(true);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [pauseOnFocus]);

  // Smooth speed interpolation (lerp) for organic acceleration/deceleration
  useEffect(() => {
    targetSpeedRef.current = isHovered ? speedOnHover : speed;
  }, [isHovered, speed, speedOnHover]);

  // Animation loop with smoothed speed
  useEffect(() => {
    if (prefersReduced || trackWidth === 0) return;

    const tick = () => {
      // Only animate when tab is focused
      if (!isFocused) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Smooth speed interpolation (lerp factor 0.08 for gentle easing)
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.08;
      
      const delta = direction === "left" 
        ? -currentSpeedRef.current / 60 
        : currentSpeedRef.current / 60;
      
      posRef.current += delta;

      // Seamless loop: once we've scrolled one full set width, reset
      if (direction === "left" && posRef.current <= -trackWidth) {
        posRef.current += trackWidth;
      }
      if (direction === "right" && posRef.current >= 0) {
        posRef.current -= trackWidth;
      }

      const track = trackRef.current;
      if (track) {
        // Use transform3d for GPU acceleration
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [trackWidth, direction, prefersReduced, isFocused]);

  // Collect children as an array
  const items = Children.toArray(children).filter(isValidElement);
  if (items.length === 0) return null;

  // Build a single set
  const makeSet = (keyPrefix: string) => (
    <div
      className="is-slider-set"
      style={{ display: "flex", alignItems: "stretch", gap, flexShrink: 0 }}
      aria-hidden={keyPrefix === "b" ? true : undefined}
    >
      {items.map((child, i) =>
        cloneElement(child as React.ReactElement, {
          key: `${keyPrefix}-${i}`,
        }),
      )}
    </div>
  );

  return (
    <div
      className={`infinite-slider-root ${className}`}
      style={{ overflow: "hidden", ...style }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The moving track — we render two identical sets back-to-back */}
      <div
        ref={trackRef}
        className="infinite-slider-track"
        style={{
          display: "flex",
          alignItems: "stretch",
          willChange: "transform",
          transform:
            direction === "right"
              ? `translate3d(${-trackWidth}px, 0, 0)`
              : "translate3d(0, 0, 0)",
        }}
      >
        {makeSet("a")}
        {makeSet("b")}
      </div>
    </div>
  );
}
