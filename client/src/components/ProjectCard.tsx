import { useRef, useState } from "react";

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  prototypeUrl: string | null; // null = coming soon
  /** Visual accent color for the placeholder — keeps cards visually distinct */
  accentHue?: number;
  /** Optional index number to drive layout variation */
  index?: number;
}

interface ProjectCardProps {
  project: Project;
  /** 0-based position index — used to vary card layouts */
  position?: number;
}

/**
 * ProjectCard — editorial project poster with game-like hover effects.
 * Designed to sit inside the InfiniteSlider strip.
 */
export function ProjectCard({ project, position = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hoverCoords, setHoverCoords] = useState({ x: 0, y: 0 });

  const isClickable = project.prototypeUrl !== null;

  const handleClick = () => {
    if (isClickable) {
      window.open(project.prototypeUrl!, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setHoverCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Very subtle layout variation — odd / even cards get a slightly different
  // internal composition without becoming inconsistent.
  const isVariant = position % 2 === 1;

  return (
    <article
      ref={cardRef}
      className={`project-card ${isVariant ? "is-variant" : ""} ${hovered ? "is-hovered" : ""} ${!isClickable ? "is-coming-soon" : ""}`}
      role={isClickable ? "button" : "article"}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={
        isClickable
          ? `${project.name} — view prototype`
          : `${project.name} — coming soon`
      }
      onClick={handleClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        "--hover-x": `${hoverCoords.x}px`,
        "--hover-y": `${hoverCoords.y}px`,
      } as React.CSSProperties}
    >
      {/* ── Visual / placeholder ── */}
      <div className="project-visual-wrap" aria-hidden="true">
        <div
          className="project-visual-placeholder"
          style={{
            "--accent-hue": project.accentHue ?? 330,
          } as React.CSSProperties}
        >
          {/* Grid lines for texture */}
          <div className="pv-grid" />
          {/* Scanline overlay on hover */}
          <div className="pv-scanline" />
          {/* Centered project initial */}
          <div className="pv-monogram">{project.name.charAt(0)}</div>
          {/* Small label */}
          <div className="pv-tag">VISUAL / PENDING</div>
        </div>
        {/* Corner brackets for game UI feel */}
        <div className="card-corner card-corner-tl" />
        <div className="card-corner card-corner-tr" />
        <div className="card-corner card-corner-bl" />
        <div className="card-corner card-corner-br" />
      </div>

      {/* ── Card body ── */}
      <div className="project-card-body">
        {/* Top row */}
        <div className="project-card-top">
          <p className="project-index">
            {String((position ?? 0) + 1).padStart(2, "0")}
          </p>
          <p className={`project-cta ${isClickable ? "" : "is-hidden"}`} aria-hidden={!isClickable}>
            {isClickable ? "VIEW PROTOTYPE →" : "COMING SOON"}
          </p>
        </div>

        {/* Project name */}
        <h3 className="project-name">{project.name}</h3>

        {/* Description */}
        <p className="project-description">{project.description}</p>

        {/* Tech tags */}
        <ul className="project-tags" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech} className="project-tag">
              {tech}
            </li>
          ))}
        </ul>

        {/* Coming-soon label — visible only when no URL */}
        {!isClickable && (
          <p className="project-soon-label" aria-live="polite">
            PROTOTYPE COMING SOON
          </p>
        )}
      </div>
    </article>
  );
}
