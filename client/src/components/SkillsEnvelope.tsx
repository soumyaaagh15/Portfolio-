import React, { useEffect, useRef, useState } from "react";
import { animate, createDraggable, createScope, spring } from "animejs";

type Skill = {
  name: string;
  detail: string;
  mark: string;
  kind: "html" | "css" | "js" | "react" | "concept";
  level: string;
};

const skills: Skill[] = [
  { name: "HTML5", detail: "Semantic Structure", mark: "<>", kind: "html", level: "LVL 99" },
  { name: "CSS3", detail: "Layouts & Animations", mark: "#", kind: "css", level: "LVL 95" },
  { name: "JavaScript", detail: "Async & Logic", mark: "JS", kind: "js", level: "LVL 92" },
  { name: "React", detail: "Components & Hooks", mark: "⚛", kind: "react", level: "LVL 90" },
  { name: "DSA", detail: "Patterns & Algorithms", mark: "∑", kind: "concept", level: "LVL 85" },
  { name: "Web Dev", detail: "Architecture & APIs", mark: "↗", kind: "concept", level: "LVL 90" },
  { name: "Backend", detail: "Node & Databases", mark: "{}", kind: "concept", level: "LVL 82" },
  { name: "UI / UX", detail: "Visual Storytelling", mark: "✦", kind: "concept", level: "LVL 88" },
];

export default function SkillsEnvelope() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeLootBadges, setActiveLootBadges] = useState<number[]>([]);
  const [characterAction, setCharacterAction] = useState<"walking" | "idle_near" | "excited">("walking");
  const [promptText, setPromptText] = useState("CLICK TO OPEN");

  const isOpenedRef = useRef(false);

  // Envelope 3D Tilt Parallax on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpenedRef.current || !envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 8;
    const rotateX = -(y / (rect.height / 2)) * 8;
    envelopeRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPromptText("CLICK TO OPEN");
    if (!isOpenedRef.current && envelopeRef.current) {
      envelopeRef.current.style.transform = "";
    }
  };

  const handleMouseEnter = () => {
    if (!isOpenedRef.current) {
      setIsHovered(true);
      setPromptText("OPEN SKILL INVENTORY");
    }
  };

  // Step-by-Step Envelope Opening Sequence
  const openEnvelope = () => {
    if (isOpenedRef.current || isOpening) return;
    isOpenedRef.current = true;
    setIsOpening(true);
    setPromptText("SKILLS UNLOCKED!");

    const section = sectionRef.current;
    if (!section) return;

    const envelope = envelopeRef.current;
    const flap = section.querySelector<HTMLElement>(".envelope-flap-hinge");
    const skillsEl = Array.from(section.querySelectorAll<HTMLElement>(".skill-card-item"));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      if (flap) flap.style.display = "none";
      setIsOpen(true);
      setIsOpening(false);
      setCharacterAction("excited");
      skillsEl.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translate(0, 0) scale(1) rotate(0deg)";
      });
      return;
    }

    // STEP 1: Tiny physical bounce reaction on the envelope body
    if (envelope) {
      animate(envelope, {
        scale: [1, 0.97, 1.02, 1],
        translateY: [0, 4, -4, 0],
        duration: 350,
        ease: "out(3)",
      });
    }

    // STEP 2: The triangle latch flap lifts open upward and smoothly disappears
    if (flap) {
      animate(flap, {
        rotateX: [0, -110],
        translateY: [0, -20],
        opacity: [1, 0],
        scale: [1, 0.9],
        duration: 420,
        ease: "easeOut",
        onComplete: () => {
          flap.style.display = "none";
          setIsOpen(true);
          setIsOpening(false);
          setCharacterAction("excited");

          // STEP 3: Coordinated emergent trajectories for the skill cards
          const targetPositions = [
            { y: -290, x: -210, rot: -7 }, // HTML5 (top left)
            { y: -310, x: -70, rot: -2 },  // CSS3 (top mid-left)
            { y: -310, x: 70, rot: 2 },    // JS (top mid-right)
            { y: -290, x: 210, rot: 7 },   // React (top right)
            { y: -160, x: -240, rot: -5 }, // DSA (mid left)
            { y: -175, x: -80, rot: -1 },  // Web Dev (mid center-left)
            { y: -175, x: 80, rot: 1 },    // Backend (mid center-right)
            { y: -160, x: 240, rot: 5 },   // UI/UX (mid right)
          ];

          skillsEl.forEach((el, index) => {
            const target = targetPositions[index] || { y: -200, x: 0, rot: 0 };

            animate(el, {
              translateY: [0, target.y],
              translateX: [0, target.x],
              rotateZ: [0, target.rot],
              scale: [0.75, 1.05, 1],
              opacity: [0, 1],
              delay: index * 75,
              duration: 750,
              ease: spring({ bounce: 0.45, duration: 750 }),
              onBegin: () => {
                setActiveLootBadges((prev) => [...prev, index]);
                setTimeout(() => {
                  setActiveLootBadges((prev) => prev.filter((i) => i !== index));
                }, 1800);
              },
            });
          });
        },
      });
    } else {
      setIsOpen(true);
      setIsOpening(false);
      setCharacterAction("excited");
    }
  };

  // Scroll into view auto-open / ready listener
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isOpenedRef.current) {
          // Scroll entry invitation
          setTimeout(() => {
            if (!isOpenedRef.current) {
              openEnvelope();
            }
          }, 600);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(section);

    // Setup draggable physics on skill cards
    const skillsEl = Array.from(section.querySelectorAll<HTMLElement>(".skill-card-item"));
    scopeRef.current = createScope({ root: section }).add(() => {
      skillsEl.forEach((el) => {
        createDraggable(el, {
          container: [0, 0, 0, 0],
          releaseEase: spring({ bounce: 0.55 }),
          onGrab: () => el.classList.add("is-grabbed"),
          onRelease: () => el.classList.remove("is-grabbed"),
        });
      });
    });

    return () => {
      observer.disconnect();
      scopeRef.current?.revert();
    };
  }, []);

  // Pixel Character & Ambient Sparkles Canvas (Integrated Game World)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const V_WIDTH = 540;
    const V_HEIGHT = 160;

    const offscreen = document.createElement("canvas");
    offscreen.width = V_WIDTH;
    offscreen.height = V_HEIGHT;
    const octx = offscreen.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = false;

    // Sparkles
    const sparkles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string }> = [];
    const SPARKLE_COLORS = ["#00f0ff", "#ff2e88", "#ffd166", "#70e000", "#ffffff"];

    const addSparkle = (x: number, y: number, burst = false) => {
      sparkles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (burst ? 3 : 0.8),
        vy: (Math.random() - (burst ? 1.2 : 0.6)) * (burst ? 2.8 : 0.9),
        life: 0,
        maxLife: burst ? 28 + Math.random() * 20 : 38 + Math.random() * 25,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
      });
    };

    let charX = 60;
    const charTargetX = 175; // Stops near the centered envelope
    let charJumpY = 0;

    const render = () => {
      frame++;
      octx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

      // Character walk progression
      if (charX < charTargetX) {
        charX += 0.9;
      }

      // Celebratory reaction when unlocked
      if (characterAction === "excited") {
        charJumpY = Math.abs(Math.sin(frame * 0.16)) * -8;
      }

      // Occasional ambient pixel sparkles around the envelope
      if (frame % 16 === 0) {
        addSparkle(220 + Math.random() * 100, 20 + Math.random() * 60);
      }

      // Particle burst when opening
      if (isOpening && frame % 3 === 0) {
        addSparkle(270 + (Math.random() - 0.5) * 80, 45, true);
        addSparkle(270 + (Math.random() - 0.5) * 80, 45, true);
      }

      // Render Sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const alpha = Math.max(0, 1 - s.life / s.maxLife);
        octx.fillStyle = s.color;
        octx.globalAlpha = alpha;
        octx.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 2);
        if (s.life >= s.maxLife) sparkles.splice(i, 1);
      }
      octx.globalAlpha = 1;

      // Draw Pixel Ground Grass Line
      octx.fillStyle = "#2b9348";
      octx.fillRect(0, 134, V_WIDTH, 4);
      octx.fillStyle = "#55a630";
      octx.fillRect(0, 132, V_WIDTH, 2);
      octx.fillStyle = "#80b918";
      octx.fillRect(0, 131, V_WIDTH, 1);

      // Draw Mini Pixel Character
      const S = 2;
      const px = Math.floor(charX);
      const py = Math.floor(118 + charJumpY);
      const isWalking = charX < charTargetX - 1;
      const walkCycle = isWalking ? Math.floor((frame / 6) % 4) : 0;

      // Shadow
      octx.fillStyle = "rgba(0,0,0,0.35)";
      octx.fillRect(px - 5 * S, 133, 10 * S, 2 * S);

      // Scarf (Pink)
      octx.fillStyle = "#ff2e88";
      octx.fillRect(px - 5 * S, py + 2 * S, 3 * S, 5 * S + Math.sin(frame * 0.2) * 2);

      // Body (Purple hoodie)
      octx.fillStyle = "#2c1654";
      octx.fillRect(px - 4 * S, py + 1 * S, 8 * S, 7 * S);

      // Legs / Shoes (Neon cyan accents)
      octx.fillStyle = "#1e1435";
      if (walkCycle === 1) {
        octx.fillRect(px - 3 * S, py + 7 * S, 2 * S, 4 * S);
        octx.fillRect(px + 1 * S, py + 8 * S, 2 * S, 3 * S);
      } else {
        octx.fillRect(px - 3 * S, py + 8 * S, 2 * S, 3 * S);
        octx.fillRect(px + 1 * S, py + 8 * S, 2 * S, 3 * S);
      }
      octx.fillStyle = "#00f0ff";
      octx.fillRect(px - 4 * S, py + 10 * S, 3 * S, 2 * S);
      octx.fillRect(px + 1 * S, py + 10 * S, 3 * S, 2 * S);

      // Face
      octx.fillStyle = "#ffd6ba";
      octx.fillRect(px - 3 * S, py - 5 * S, 6 * S, 6 * S);

      // Hair
      octx.fillStyle = "#120826";
      octx.fillRect(px - 4 * S, py - 7 * S, 8 * S, 3 * S);

      // Glasses (Neon cyan)
      octx.fillStyle = "#00f0ff";
      octx.fillRect(px - 2 * S, py - 3 * S, 2 * S, 2 * S);
      octx.fillRect(px + 1 * S, py - 3 * S, 2 * S, 2 * S);

      // Headphones (Pink)
      octx.fillStyle = "#ff2e88";
      octx.fillRect(px - 4 * S, py - 4 * S, 1 * S, 3 * S);
      octx.fillRect(px + 3 * S, py - 4 * S, 1 * S, 3 * S);

      // Emote Bubble
      if (characterAction === "excited") {
        octx.fillStyle = "#120d28";
        octx.fillRect(px - 2, py - 18 * S, 14, 11);
        octx.strokeStyle = "#00f0ff";
        octx.strokeRect(px - 2, py - 18 * S, 14, 11);
        octx.fillStyle = "#ffd166";
        octx.font = "8px 'Press Start 2P', monospace";
        octx.fillText("✦", px + 1, py - 9 * S);
      }

      // Draw onto visible canvas
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, V_WIDTH, V_HEIGHT, 0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(render);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [characterAction, isOpening]);

  return (
    <section className={`skills-stage ${isOpen ? "is-open" : ""}`} ref={sectionRef} id="skills">
      {/* Top Header Tagline */}
      <div className="skills-header">
        <div className="skills-header-left">
          <span className="skills-header-num">02 // INVENTORY</span>
          <span className="skills-header-sub">MY SKILL INVENTORY</span>
        </div>
        <span className="skills-header-status">
          {isOpen ? "★ 8/8 ABILITIES UNLOCKED" : "✉ SPECIAL QUEST COLLECTIBLE"}
        </span>
      </div>

      {/* 1. CLEAN CENTERED HEADLINE COMPOSITION */}
      <div className="skills-centered-header">
        <div className="skills-quest-badge">
          <span className="skills-quest-star">✦</span>
          <span>SPECIAL QUEST COLLECTIBLE</span>
        </div>
        <h2 className="skills-main-title">SKILLS</h2>
        <p className="skills-subline">MY SKILL INVENTORY</p>
      </div>

      {/* 2. CENTERED 3D ENVELOPE STAGE & SKILL CARDS */}
      <div className="skills-stage-center-container">
        <div
          className={`envelope-stage-wrapper ${!isOpen ? "is-idle" : "is-unlocked"}`}
          aria-label="A 3D game envelope opening to reveal skill collectibles"
        >
          {/* Skill Collectible Cards Container (Originates from inside the envelope cavity) */}
          <div className="skills-cards-origin-field" aria-live="polite">
            {skills.map((skill, index) => {
              const isLootAcquired = activeLootBadges.includes(index);

              return (
                <div
                  className={`skill-card-item card-index-${index + 1} ${skill.kind} ${
                    isLootAcquired ? "is-loot-popping" : ""
                  }`}
                  key={skill.name}
                  tabIndex={0}
                >
                  {/* Temporary Unlock Notification Pill */}
                  {isLootAcquired && (
                    <span className="loot-badge-pill">
                      <span className="loot-star">✦</span> UNLOCKED
                    </span>
                  )}
                  <div className="card-top-row">
                    <span className="card-mark-icon">{skill.mark}</span>
                    <span className="card-level-tag">{skill.level}</span>
                  </div>
                  <strong className="card-title">{skill.name}</strong>
                  <small className="card-detail">{skill.detail}</small>
                </div>
              );
            })}
          </div>

          {/* 3D Physical Interactive Envelope */}
          <div
            ref={envelopeRef}
            className={`envelope-3d-box ${!isOpen ? "envelope-bobbing-active" : ""}`}
            onClick={openEnvelope}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Click to open 3D skill package"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openEnvelope();
            }}
          >
            {/* Interactive Tooltip Prompt (Disappears when open) */}
            {!isOpen && (
              <div className={`envelope-game-prompt ${isHovered ? "is-hover-state" : ""}`}>
                <span className="prompt-dot" />
                <span className="prompt-label">{promptText}</span>
                <span className="prompt-arrow-icon">▼</span>
              </div>
            )}

            {/* Envelope Back Plate & Interior Cavity */}
            <div className="envelope-layer envelope-back-plate" />
            <div className="envelope-layer envelope-interior-cavity" />

            {/* The True 3D Top Flap Hinged at Top (Rotates 0deg -> -180deg) */}
            <div className="envelope-flap-hinge" aria-hidden="true">
              <div className="flap-face flap-front">
                <div className="flap-triangle" />
                <div className="flap-crease" />
              </div>
              <div className="flap-face flap-back">
                <div className="flap-triangle-back" />
              </div>
            </div>

            {/* Envelope Front Pocket Plate with 3D Depth, Folds, and Wax Seal */}
            <div className="envelope-layer envelope-front-pocket">
              <div className="pocket-diagonal diagonal-left" />
              <div className="pocket-diagonal diagonal-right" />
              <div className="envelope-emboss-seal">
                <span className="seal-heart">♡</span>
              </div>
              <div className="envelope-brand-text">
                <span>SG // DEV</span>
                <i>ABILITIES INVENTORY</i>
              </div>
            </div>

            {/* Subtle Soft 3D Shadow underneath */}
            <div className="envelope-ground-shadow" />
          </div>
        </div>

        {/* Character Ground Canvas */}
        <canvas ref={canvasRef} className="skills-character-ground-canvas" aria-hidden="true" />
      </div>

      {/* Footer bar */}
      <div className="skills-footer">
        <span>02—03 // COLLECTIBLES</span>
        <span>DRAG CARDS TO REORDER // PHYSICAL ABILITY INVENTORY</span>
      </div>
    </section>
  );
}
