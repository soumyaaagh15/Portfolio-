/**
 * ProjectsSection — 03 / WORK
 *
 * Prototype URLs are intentionally left as placeholder constants so the
 * portfolio owner can replace them in one place without hunting through JSX.
 *
 * Set each URL to a string to enable the link, or to null to show
 * "COMING SOON".
 */

import { useEffect, useRef, useState } from "react";
import { InfiniteSlider } from "@/components/core/infinite-slider";
import { ProjectCard, type Project } from "@/components/ProjectCard";

// ─────────────────────────────────────────────────────────────────
//  PROTOTYPE URL CONFIGURATION
//  Replace the null values below with your actual prototype URLs.
// ─────────────────────────────────────────────────────────────────
const KHATA_PROTOTYPE_URL: string | null = null;              // e.g. "https://your-khata-prototype.com"
const AI_CODE_REVIEW_PROTOTYPE_URL: string | null = null;     // e.g. "https://your-ai-code-review.com"
const DOCUMENT_READER_PROTOTYPE_URL: string | null = null;    // e.g. "https://your-document-reader.com"
const HEALTHCARE_ASSISTANT_PROTOTYPE_URL: string | null = null; // e.g. "https://your-healthcare-assistant.com"

const projects: Project[] = [
  {
    name: "KHATA",
    description:
      "Voice-first digital bookkeeping designed around the everyday needs of small businesses.",
    technologies: ["React", "Vite", "PWA", "OCR", "Voice"],
    prototypeUrl: KHATA_PROTOTYPE_URL,
    accentHue: 330,
  },
  {
    name: "AI CODE REVIEW",
    description:
      "An AI-assisted code review experience designed to help developers understand what their code could improve.",
    technologies: ["React", "AI", "APIs", "JavaScript"],
    prototypeUrl: AI_CODE_REVIEW_PROTOTYPE_URL,
    accentHue: 260,
  },
  {
    name: "DOCUMENT READER",
    description:
      "Turning documents into structured, readable information using OCR and AI-assisted processing.",
    technologies: ["OCR", "AI", "APIs", "React"],
    prototypeUrl: DOCUMENT_READER_PROTOTYPE_URL,
    accentHue: 185,
  },
  {
    name: "HEALTHCARE ASSISTANT",
    description:
      "A conversational healthcare experience designed around accessibility, voice interaction and simpler access to healthcare information.",
    technologies: ["React", "Supabase", "APIs", "AI", "OCR"],
    prototypeUrl: HEALTHCARE_ASSISTANT_PROTOTYPE_URL,
    accentHue: 150,
  },
];

// Game-themed sticker definitions
const STICKER_TYPES = [
  { emoji: "🎮", label: "PLAY", className: "sticker-game" },
  { emoji: "⚡", label: "BOOST", className: "sticker-boost" },
  { emoji: "🏆", label: "LEVEL UP", className: "sticker-trophy" },
  { emoji: "💾", label: "SAVE", className: "sticker-save" },
  { emoji: "🎯", label: "TARGET", className: "sticker-target" },
  { emoji: "🚀", label: "LAUNCH", className: "sticker-rocket" },
  { emoji: "⭐", label: "BONUS", className: "sticker-star" },
  { emoji: "🔑", label: "UNLOCK", className: "sticker-key" },
  { emoji: "💎", label: "GEMS", className: "sticker-gem" },
  { emoji: "🎪", label: "DEMO", className: "sticker-demo" },
];

function GameStickers() {
  const [stickers, setStickers] = useState<Array<{ id: number; type: typeof STICKER_TYPES[0]; x: number; y: number; rotation: number; scale: number; delay: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const generateStickers = () => {
      const rect = container.getBoundingClientRect();
      const count = Math.min(12, Math.max(6, Math.floor(rect.width / 180)));
      const newStickers = Array.from({ length: count }, (_, i) => {
        const type = STICKER_TYPES[Math.floor(Math.random() * STICKER_TYPES.length)];
        return {
          id: Date.now() + i,
          type,
          x: Math.random() * (rect.width - 80),
          y: Math.random() * (rect.height - 80),
          rotation: (Math.random() - 0.5) * 30,
          scale: 0.7 + Math.random() * 0.6,
          delay: Math.random() * 4,
        };
      });
      setStickers(newStickers);
    };

    generateStickers();

    const ro = new ResizeObserver(() => generateStickers());
    ro.observe(container);

    const interval = setInterval(() => {
      setStickers(prev => prev.map((s, i) =>
        Math.random() < 0.15 ? { ...s, ...STICKER_TYPES[Math.floor(Math.random() * STICKER_TYPES.length)], delay: Math.random() * 2 } : s
      ));
    }, 8000);

    return () => {
      ro.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="projects-stickers-layer"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className={`project-sticker ${sticker.type.className}`}
          style={{
            left: `${sticker.x}px`,
            top: `${sticker.y}px`,
            transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            animationDelay: `${sticker.delay}s`,
            '--rot': `${sticker.rotation}deg`,
          } as React.CSSProperties}
        >
          <span className="sticker-emoji">{sticker.type.emoji}</span>
          <span className="sticker-label">{sticker.type.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="projects-stage" id="work" aria-label="Work — projects">
      {/* Game-themed decorative stickers in background */}
      <GameStickers />

      {/* ── Section header ── */}
      <header className="projects-header">
        <div className="projects-header-inner">
          <div className="projects-topline">
            <span className="projects-label">03 / WORK</span>
            <span className="projects-index-label">WORK_03</span>
          </div>

          <h2 className="projects-heading">
            THINGS
            <br />
            I'VE BUILT.
          </h2>

          <p className="projects-subline">
            some experiments, some hackathons, some things I couldn't stop thinking about.
          </p>
        </div>

        {/* Decorative rule line */}
        <div className="projects-rule" aria-hidden="true" />
      </header>

      {/* ── Infinite project slider ── */}
      <div className="projects-slider-wrap" aria-label="Continuously scrolling project strip">
        <InfiniteSlider speedOnHover={12} gap={24} speed={50}>
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} position={index} />
          ))}
        </InfiniteSlider>
      </div>

      {/* ── Section footer ── */}
      <footer className="projects-footer" aria-hidden="true">
        <span>PROJECT_INDEX: 03</span>
        <span>continuous stream / hover to slow</span>
      </footer>
    </section>
  );
}
