import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface HobbiesSectionProps {
  onNavClick?: (targetId: string) => void;
}

export default function HobbiesSection({ onNavClick }: HobbiesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const [hoveredSticker, setHoveredSticker] = useState<string | null>(null);

  // Pixel Ground & World Elements Canvas (Character, Cat, Flowers, Signs, Grass)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const V_WIDTH = 640;
    const V_HEIGHT = 140;

    const offscreen = document.createElement("canvas");
    offscreen.width = V_WIDTH;
    offscreen.height = V_HEIGHT;
    const octx = offscreen.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = false;

    // Stars pool
    const stars: Array<{ x: number; y: number; size: number; color: string; speed: number; phase: number }> = [];
    const STAR_COLORS = ["#ffffff", "#00f0ff", "#ff2e88", "#ffd166", "#70e000", "#c77dff"];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * V_WIDTH,
        y: Math.random() * 85,
        size: Math.random() > 0.8 ? 2 : 1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        speed: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let charX = 75;
    const charTargetX = 85;

    const render = () => {
      frame++;
      octx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

      // Render Twinkling Stars
      stars.forEach((s) => {
        const alpha = 0.35 + Math.sin(frame * s.speed + s.phase) * 0.45;
        octx.fillStyle = s.color;
        octx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        octx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      });
      octx.globalAlpha = 1;

      // Draw Pixel Ground (Grass + Multi-Tone Soil Platform)
      const groundY = 104;

      // Purple/Blue Dark Sub-Soil Underneath
      octx.fillStyle = "#1e1035";
      octx.fillRect(0, groundY + 12, V_WIDTH, 30);
      octx.fillStyle = "#2d164d";
      octx.fillRect(0, groundY + 8, V_WIDTH, 8);

      // Soil Middle Band (Magenta / Dark Violet)
      octx.fillStyle = "#5c1d6b";
      octx.fillRect(0, groundY + 4, V_WIDTH, 6);
      octx.fillStyle = "#8a288f";
      octx.fillRect(0, groundY + 2, V_WIDTH, 3);

      // Vibrant Green Grass Top Layers
      octx.fillStyle = "#157a3c";
      octx.fillRect(0, groundY, V_WIDTH, 3);
      octx.fillStyle = "#2ec466";
      octx.fillRect(0, groundY - 2, V_WIDTH, 2);
      octx.fillStyle = "#5dfc96";
      octx.fillRect(0, groundY - 3, V_WIDTH, 1);

      // Pixel Grass Tufts along the edge
      for (let x = 4; x < V_WIDTH; x += 14) {
        octx.fillStyle = "#5dfc96";
        octx.fillRect(x, groundY - 5, 2, 2);
        octx.fillRect(x + 2, groundY - 4, 1, 2);
      }

      // Draw Left Bush & Signpost
      // Signpost
      octx.fillStyle = "#3e2723";
      octx.fillRect(28, groundY - 24, 4, 24);
      octx.fillStyle = "#8e24aa";
      octx.fillRect(18, groundY - 28, 24, 7);
      octx.fillStyle = "#ab47bc";
      octx.fillRect(19, groundY - 27, 22, 5);
      octx.fillStyle = "#e1bee7";
      octx.fillRect(22, groundY - 25, 4, 2);

      // Left Lush Bush with Flowers
      octx.fillStyle = "#1b5e20";
      octx.fillRect(2, groundY - 18, 22, 18);
      octx.fillStyle = "#2e7d32";
      octx.fillRect(4, groundY - 22, 18, 14);
      octx.fillStyle = "#4caf50";
      octx.fillRect(6, groundY - 24, 14, 8);

      // Pink & Blue Flowers in bushes
      octx.fillStyle = "#ff4081";
      octx.fillRect(8, groundY - 14, 3, 3);
      octx.fillRect(16, groundY - 8, 3, 3);
      octx.fillStyle = "#ffd54f";
      octx.fillRect(9, groundY - 13, 1, 1);
      octx.fillRect(17, groundY - 7, 1, 1);

      // Draw Right Bush & Signpost
      octx.fillStyle = "#1b5e20";
      octx.fillRect(V_WIDTH - 28, groundY - 22, 26, 22);
      octx.fillStyle = "#2e7d32";
      octx.fillRect(V_WIDTH - 24, groundY - 26, 20, 16);
      octx.fillStyle = "#4caf50";
      octx.fillRect(V_WIDTH - 20, groundY - 28, 14, 8);

      octx.fillStyle = "#ff4081";
      octx.fillRect(V_WIDTH - 18, groundY - 16, 3, 3);
      octx.fillStyle = "#00e5ff";
      octx.fillRect(V_WIDTH - 10, groundY - 10, 3, 3);

      // Draw Character (Left side on grass)
      const S = 2;
      const charPy = groundY - 24;
      const charBob = Math.sin(frame * 0.08) * 1.5;

      // Shadow
      octx.fillStyle = "rgba(0,0,0,0.35)";
      octx.fillRect(charX - 4 * S, groundY - 2, 9 * S, 3);

      // Character Body & Dress
      octx.fillStyle = "#2e7d32";
      octx.fillRect(charX - 3 * S, charPy + 6 * S + charBob, 7 * S, 6 * S);
      octx.fillStyle = "#ffffff";
      octx.fillRect(charX - 2 * S, charPy + 7 * S + charBob, 5 * S, 4 * S);

      // Face
      octx.fillStyle = "#ffd6ba";
      octx.fillRect(charX - 3 * S, charPy - 1 * S + charBob, 6 * S, 6 * S);

      // Hair (Long dark brown hair)
      octx.fillStyle = "#3e2723";
      octx.fillRect(charX - 4 * S, charPy - 3 * S + charBob, 8 * S, 3 * S);
      octx.fillRect(charX - 5 * S, charPy - 1 * S + charBob, 3 * S, 9 * S);
      octx.fillRect(charX + 2 * S, charPy - 1 * S + charBob, 3 * S, 8 * S);

      // Hair Flower Accessory (Pink)
      octx.fillStyle = "#ff4081";
      octx.fillRect(charX + 1 * S, charPy - 2 * S + charBob, 3 * S, 3 * S);
      octx.fillStyle = "#fff59d";
      octx.fillRect(charX + 2 * S, charPy - 1 * S + charBob, 1 * S, 1 * S);

      // Eyes
      octx.fillStyle = "#120826";
      octx.fillRect(charX - 1 * S, charPy + 1 * S + charBob, 1 * S, 2 * S);
      octx.fillRect(charX + 1 * S, charPy + 1 * S + charBob, 1 * S, 2 * S);

      // Legs / Shoes
      octx.fillStyle = "#ffd6ba";
      octx.fillRect(charX - 2 * S, charPy + 11 * S + charBob, 2 * S, 3 * S);
      octx.fillRect(charX + 1 * S, charPy + 11 * S + charBob, 2 * S, 3 * S);
      octx.fillStyle = "#ffffff";
      octx.fillRect(charX - 3 * S, charPy + 13 * S + charBob, 3 * S, 2 * S);
      octx.fillRect(charX + 1 * S, charPy + 13 * S + charBob, 3 * S, 2 * S);

      // Draw Cute White Cat on Right Side
      const catX = V_WIDTH - 78;
      const catY = groundY - 14;
      const catTailWag = Math.sin(frame * 0.15) * 2;

      // Cat Shadow
      octx.fillStyle = "rgba(0,0,0,0.3)";
      octx.fillRect(catX - 6, groundY - 2, 18, 3);

      // Cat Body (White)
      octx.fillStyle = "#ffffff";
      octx.fillRect(catX - 4, catY + 4, 12, 8);
      // Cat Head
      octx.fillRect(catX - 8, catY, 7, 7);
      // Cat Ears
      octx.fillStyle = "#ff80ab";
      octx.fillRect(catX - 8, catY - 2, 2, 2);
      octx.fillRect(catX - 3, catY - 2, 2, 2);
      // Cat Eyes (Cyan)
      octx.fillStyle = "#00e5ff";
      octx.fillRect(catX - 7, catY + 2, 1, 2);
      octx.fillRect(catX - 4, catY + 2, 1, 2);
      // Cat Tail (Curled up)
      octx.fillStyle = "#ffffff";
      octx.fillRect(catX + 8, catY + 2 + catTailWag, 3, 6);
      octx.fillRect(catX + 9, catY + catTailWag, 3, 3);

      // Little White Flowers around the Grass
      octx.fillStyle = "#ffffff";
      octx.fillRect(170, groundY - 6, 4, 4);
      octx.fillRect(240, groundY - 5, 3, 3);
      octx.fillRect(390, groundY - 6, 4, 4);
      octx.fillRect(480, groundY - 5, 3, 3);
      octx.fillStyle = "#ffd54f";
      octx.fillRect(171, groundY - 5, 2, 2);
      octx.fillRect(391, groundY - 5, 2, 2);

      // Render to main canvas
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
  }, []);

  // Sequential Sticker Reveal Animation:
  // small -> smoothly grows to medium size -> stays briefly -> shrinks slightly into its final position
  const stickerVariants = {
    hidden: { scale: 0.15, opacity: 0, y: 35 },
    visible: (customDelay: number) => ({
      scale: [0.15, 1.18, 1.15, 1.0],
      opacity: [0, 1, 1, 1],
      y: [35, -12, -8, 0],
      transition: {
        delay: customDelay,
        duration: 1.1,
        times: [0, 0.45, 0.75, 1],
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <section className="hobbies-pixel-page" id="hobbies" ref={containerRef} aria-label="Hobbies — Things I Love">
      {/* 1. TOP RETRO GAME NAVIGATION BAR */}
      <header className="retro-game-navbar">
        <div className="nav-brand-group">
          <span className="nav-heart-icon">♥</span>
          <span className="nav-player-name">SOUMYA GHOSH</span>
        </div>

        <nav className="nav-links-cluster">
          <button type="button" onClick={() => onNavClick?.("hero")} className="nav-link-btn">
            Home
          </button>
          <button type="button" onClick={() => onNavClick?.("about")} className="nav-link-btn">
            About Me
          </button>
          <button type="button" onClick={() => onNavClick?.("skills")} className="nav-link-btn">
            Skills
          </button>
          <button type="button" onClick={() => onNavClick?.("projects")} className="nav-link-btn">
            Projects
          </button>
          <button type="button" className="nav-link-btn is-active">
            ♥ Hobbies
          </button>
          <button type="button" onClick={() => onNavClick?.("contact")} className="nav-link-btn">
            Contact
          </button>
        </nav>

        <div className="nav-badge-right">
          <span className="nav-star-gold">★</span>
          <span>2026</span>
        </div>
      </header>

      {/* 2. THEATER STAGE CURTAINS (LEFT & RIGHT) */}
      <div className="stage-curtain curtain-left" aria-hidden="true">
        <div className="curtain-fabric" />
        <div className="curtain-tassel" />
        <span className="curtain-star-accent">★</span>
      </div>

      <div className="stage-curtain curtain-right" aria-hidden="true">
        <div className="curtain-fabric" />
        <div className="curtain-tassel" />
        <span className="curtain-star-accent">★</span>
      </div>

      {/* 3. HANGING WOODEN SIGNS (LEFT: HELLO ♥ | RIGHT: NAMASTE / HALLO ☺) */}
      <div className="hanging-signs-layer" aria-hidden="true">
        {/* Left Sign: HELLO ♥ */}
        <div className="hanging-sign sign-left">
          <div className="sign-chain left-chain" />
          <div className="sign-chain right-chain" />
          <div className="sign-board">
            <span>HELLO ♥</span>
          </div>
        </div>

        {/* Right Sign: NAMASTE / HALLO ☺ */}
        <div className="hanging-sign sign-right">
          <div className="sign-chain left-chain" />
          <div className="sign-chain right-chain" />
          <div className="sign-board">
            <span>NAMASTE</span>
            <span>HALLO ☺</span>
          </div>
        </div>
      </div>

      {/* 4. MAIN CENTER TITLE: ★ HOBBIES ★ ♡ THINGS I LOVE ♡ */}
      <div className="hobbies-main-header">
        <div className="hobbies-title-row">
          <span className="header-sparkle-star left">✦</span>
          <h2 className="pixel-3d-title">HOBBIES</h2>
          <span className="header-sparkle-star right">✦</span>
        </div>
        <p className="pixel-sub-caption">♡ THINGS I LOVE ♡</p>
      </div>

      {/* 5. 2D STICKER COLLECTION COLLAGE (4 EXACT HOBBY GROUPS WITH WHITE OUTLINES & DOODLES) */}
      <div className="hobbies-stickers-stage">
        {/* STICKER 1: BOOK — “ANXIOUS PEOPLE” by Fredrik Backman */}
        <div className="sticker-group-item group-book">
          <motion.div
            className={`pixel-sticker-diecut sticker-book-diecut ${
              hoveredSticker === "book" ? "is-hovered" : ""
            }`}
            custom={0.15}
            variants={stickerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              scale: 1.08,
              y: -8,
              rotate: -2,
              transition: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredSticker("book")}
            onMouseLeave={() => setHoveredSticker(null)}
          >
            <div className="book-art-cover">
              <div className="book-cover-inner">
                <span className="book-art-title">ANXIOUS</span>
                <span className="book-art-title">PEOPLE</span>
                <div className="book-silhouette-crowd">
                  <span className="person-dot" />
                  <span className="person-dot" />
                  <span className="person-dot" />
                  <span className="person-dot" />
                </div>
                <span className="book-art-author">FREDRIK</span>
                <span className="book-art-author">BACKMAN</span>
              </div>
              <div className="book-gold-ribbon" />
            </div>
          </motion.div>

          {/* Doodled Note on the side */}
          <div className="sticker-doodle-note note-book">
            <span>Good books</span>
            <span>=</span>
            <span>Happy me</span>
            <span className="doodle-heart">♡</span>
          </div>
        </div>

        {/* STICKER 2: TENNIS — Two Rackets & Bouncing Ball */}
        <div className="sticker-group-item group-tennis">
          <motion.div
            className={`pixel-sticker-diecut sticker-tennis-diecut ${
              hoveredSticker === "tennis" ? "is-hovered" : ""
            }`}
            custom={0.4}
            variants={stickerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              scale: 1.08,
              y: -8,
              rotate: 3,
              transition: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredSticker("tennis")}
            onMouseLeave={() => setHoveredSticker(null)}
          >
            <div className="tennis-illustration-wrap">
              {/* Crossed Rackets */}
              <div className="crossed-rackets">
                <div className="racket-art racket-purple-left">
                  <div className="racket-oval">
                    <div className="racket-mesh" />
                  </div>
                  <div className="racket-handle" />
                </div>
                <div className="racket-art racket-pink-right">
                  <div className="racket-oval">
                    <div className="racket-mesh" />
                  </div>
                  <div className="racket-handle" />
                </div>
              </div>

              {/* Looping Bouncing Tennis Ball */}
              <div className="tennis-ball-animated">
                <div className="ball-fuzzy-body">
                  <div className="ball-curve-line" />
                </div>
                <div className="ball-motion-sparkles">
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Doodled Note on the side */}
          <div className="sticker-doodle-note note-tennis">
            <span>Tennis</span>
            <span>=</span>
            <span>Therapy</span>
            <span className="doodle-heart">♡</span>
          </div>
        </div>

        {/* STICKER 3: POTTERY — Vase, Ceramic Bowl, Jars & Sponge Collection */}
        <div className="sticker-group-item group-pottery">
          <motion.div
            className={`pixel-sticker-diecut sticker-pottery-diecut ${
              hoveredSticker === "pottery" ? "is-hovered" : ""
            }`}
            custom={0.65}
            variants={stickerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              scale: 1.08,
              y: -8,
              rotate: -3,
              transition: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredSticker("pottery")}
            onMouseLeave={() => setHoveredSticker(null)}
          >
            <div className="pottery-illustration-wrap">
              {/* Large Earthenware Vase */}
              <div className="pottery-vase-terracotta">
                <div className="vase-lip" />
                <div className="vase-belly">
                  <span className="vase-painted-leaf">🌿</span>
                </div>
              </div>

              {/* Front Ceramic Bowl */}
              <div className="pottery-glazed-bowl">
                <div className="bowl-rim" />
                <div className="bowl-body" />
              </div>

              {/* Tool Jar with Brushes/Tools */}
              <div className="pottery-tool-jar">
                <div className="tools-protruding">
                  <span className="tool-stem brush-1" />
                  <span className="tool-stem brush-2" />
                  <span className="tool-stem brush-3" />
                </div>
                <div className="jar-body" />
              </div>

              {/* Mini Clay Pot & Yellow Sponge */}
              <div className="pottery-small-jar" />
              <div className="pottery-sponge-yellow">
                <span className="sponge-pore" />
                <span className="sponge-pore" />
              </div>
            </div>
          </motion.div>

          {/* Doodled Note on the side */}
          <div className="sticker-doodle-note note-pottery">
            <span>Pottery</span>
            <span>=</span>
            <span>Peace</span>
            <span className="doodle-heart">♡</span>
          </div>
        </div>

        {/* STICKER 4: GERMAN — Goethe-Zertifikat A2 + Deutsch Book */}
        <div className="sticker-group-item group-german">
          <motion.div
            className={`pixel-sticker-diecut sticker-german-diecut ${
              hoveredSticker === "german" ? "is-hovered" : ""
            }`}
            custom={0.9}
            variants={stickerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover={{
              scale: 1.08,
              y: -8,
              rotate: 3,
              transition: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredSticker("german")}
            onMouseLeave={() => setHoveredSticker(null)}
          >
            <div className="german-illustration-wrap">
              {/* Goethe-Zertifikat A2 Document */}
              <div className="german-cert-sheet">
                <span className="cert-top-title">GOETHE-ZERTIFIKAT</span>
                <span className="cert-level-big">A2</span>
                <div className="cert-lines-placeholder">
                  <span />
                  <span />
                  <span />
                </div>
                {/* German Flag Badge */}
                <div className="german-flag-pill">
                  <span className="flag-b" />
                  <span className="flag-r" />
                  <span className="flag-y" />
                </div>
              </div>

              {/* Layered Deutsch Book */}
              <div className="deutsch-book-cover">
                <div className="deutsch-book-spine" />
                <div className="deutsch-book-front">
                  <span className="deutsch-book-title">Deutsch</span>
                  <span className="deutsch-book-motif">★</span>
                </div>
                <div className="deutsch-pages-edge" />
              </div>
            </div>
          </motion.div>

          {/* Doodled Note on the side */}
          <div className="sticker-doodle-note note-german">
            <span>Eine</span>
            <span>neue</span>
            <span>Sprache</span>
            <span>=</span>
            <span>Neue</span>
            <span>Welt</span>
            <span className="doodle-heart">♡</span>
          </div>
        </div>
      </div>

      {/* 6. CHARACTER & WORLD GROUND CANVAS */}
      <canvas ref={canvasRef} className="hobbies-ground-canvas" aria-hidden="true" />
    </section>
  );
}
