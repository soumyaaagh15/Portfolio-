import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FIRST_NAME = ["S", "O", "U", "M", "Y", "A"];
const LAST_NAME = ["G", "H", "O", "S", "H"];
const TOTAL_LETTERS = FIRST_NAME.length + LAST_NAME.length; // 11

// Glitch characters for the letter unlock effect
const GLITCH_CHARS = "!@#$<>{}_+*&~%?01";

interface PixelHeroProps {
  onNavClick?: (targetId: string) => void;
}

export default function PixelHero({ onNavClick }: PixelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [letterGlitches, setLetterGlitches] = useState<{ [key: string]: string }>({});

  // Trigger glitch animation when a letter unlocks
  const triggerLetterGlitch = (letterKey: string, realChar: string) => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame >= 4) {
        clearInterval(interval);
        setLetterGlitches((prev) => ({ ...prev, [letterKey]: realChar }));
      } else {
        const randChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        setLetterGlitches((prev) => ({ ...prev, [letterKey]: randChar }));
      }
    }, 45);
  };

  // Setup GSAP ScrollTrigger for pinned scroll experience
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let prevRevealedCount = -1;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=1900", // Pinned scroll distance for smooth character unlocking
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        setIsUnlocked(p >= 0.88);

        // Calculate how many letters should be unlocked
        // Progress range 0.10 -> 0.84 maps to 0 -> TOTAL_LETTERS
        let currentLetterProgress = 0;
        if (p > 0.1) {
          const normalized = Math.min(1, Math.max(0, (p - 0.1) / 0.74));
          currentLetterProgress = Math.floor(normalized * (TOTAL_LETTERS + 0.99));
        }

        if (currentLetterProgress > prevRevealedCount) {
          // Trigger glitch for newly revealed letters
          for (let i = prevRevealedCount + 1; i <= currentLetterProgress; i++) {
            if (i < FIRST_NAME.length) {
              triggerLetterGlitch(`fn_${i}`, FIRST_NAME[i]);
            } else if (i - FIRST_NAME.length < LAST_NAME.length) {
              const idx = i - FIRST_NAME.length;
              triggerLetterGlitch(`ln_${idx}`, LAST_NAME[idx]);
            }
          }
          prevRevealedCount = currentLetterProgress;
        } else if (currentLetterProgress < prevRevealedCount) {
          prevRevealedCount = currentLetterProgress;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // Pixel Canvas Background and Character Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;

    // Fixed virtual pixel resolution for authentic pixel art look
    const V_WIDTH = 480;
    const V_HEIGHT = 270;

    // Stars pool
    const stars: Array<{ x: number; y: number; size: number; color: string; speed: number; phase: number }> = [];
    const STAR_COLORS = ["#ffffff", "#00f0ff", "#ff2e88", "#b5179e", "#ffd166", "#70e000"];
    for (let i = 0; i < 75; i++) {
      stars.push({
        x: Math.random() * V_WIDTH,
        y: Math.random() * (V_HEIGHT * 0.68),
        size: Math.random() > 0.85 ? 2 : 1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        speed: 0.02 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Fireflies pool near grass
    const fireflies: Array<{ x: number; y: number; baseX: number; baseY: number; phase: number }> = [];
    for (let i = 0; i < 20; i++) {
      const baseX = Math.random() * V_WIDTH;
      const baseY = V_HEIGHT * 0.72 + Math.random() * 40;
      fireflies.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Cloud pixels
    const clouds = [
      { x: 30, y: 35, w: 55, h: 12, speed: 0.06 },
      { x: 220, y: 55, w: 75, h: 14, speed: 0.04 },
      { x: 380, y: 25, w: 60, h: 10, speed: 0.05 },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    // Offscreen buffer for crisp low-res pixel art scaled to screen
    const offscreen = document.createElement("canvas");
    offscreen.width = V_WIDTH;
    offscreen.height = V_HEIGHT;
    const octx = offscreen.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = false;

    // Character drawing function (Cute 16x20 pixel coder/adventurer sprite)
    const drawPixelCharacter = (cx: number, cy: number, frame: number, isWalking: boolean) => {
      const walkCycle = isWalking ? Math.floor((frame / 6) % 4) : 0;
      const bob = isWalking ? (walkCycle === 1 || walkCycle === 3 ? -1 : 0) : Math.sin(frame * 0.08) > 0 ? 0 : -1;

      const px = Math.floor(cx);
      const py = Math.floor(cy + bob);

      // Character scale: 2x pixel grid
      const S = 2;

      // Draw shadow
      octx.fillStyle = "rgba(4, 3, 15, 0.6)";
      octx.fillRect(px - 6 * S, cy + 13 * S, 12 * S, 3 * S);

      // Scarf / Cape trailing (magenta/pink)
      octx.fillStyle = "#ff2e88";
      const capeWave = Math.sin(frame * 0.15 + (isWalking ? frame * 0.2 : 0)) * 2;
      octx.fillRect(px - 5 * S - (isWalking ? 2 * S : 0), py + 2 * S, 3 * S, 6 * S + capeWave);

      // Legs / Shoes
      octx.fillStyle = "#1e1435";
      if (walkCycle === 0 || !isWalking) {
        octx.fillRect(px - 3 * S, py + 8 * S, 2 * S, 5 * S);
        octx.fillRect(px + 1 * S, py + 8 * S, 2 * S, 5 * S);
        octx.fillStyle = "#00f0ff"; // neon shoe accents
        octx.fillRect(px - 4 * S, py + 12 * S, 3 * S, 2 * S);
        octx.fillRect(px + 1 * S, py + 12 * S, 3 * S, 2 * S);
      } else if (walkCycle === 1) {
        octx.fillRect(px - 2 * S, py + 7 * S, 2 * S, 5 * S);
        octx.fillRect(px + 2 * S, py + 9 * S, 2 * S, 4 * S);
        octx.fillStyle = "#00f0ff";
        octx.fillRect(px - 3 * S, py + 11 * S, 3 * S, 2 * S);
        octx.fillRect(px + 2 * S, py + 12 * S, 3 * S, 2 * S);
      } else if (walkCycle === 2) {
        octx.fillRect(px - 1 * S, py + 8 * S, 2 * S, 5 * S);
        octx.fillRect(px - 1 * S, py + 8 * S, 2 * S, 5 * S);
        octx.fillStyle = "#00f0ff";
        octx.fillRect(px - 2 * S, py + 12 * S, 4 * S, 2 * S);
      } else {
        octx.fillRect(px + 1 * S, py + 7 * S, 2 * S, 5 * S);
        octx.fillRect(px - 3 * S, py + 9 * S, 2 * S, 4 * S);
        octx.fillStyle = "#00f0ff";
        octx.fillRect(px + 1 * S, py + 11 * S, 3 * S, 2 * S);
        octx.fillRect(px - 4 * S, py + 12 * S, 3 * S, 2 * S);
      }

      // Torso / Hoodie (Deep Cyber Indigo)
      octx.fillStyle = "#2c1654";
      octx.fillRect(px - 4 * S, py + 1 * S, 8 * S, 8 * S);

      // Hoodie emblem (Glowing neon cyan pixel)
      octx.fillStyle = "#00f0ff";
      octx.fillRect(px - 1 * S, py + 3 * S, 2 * S, 2 * S);

      // Head / Face
      octx.fillStyle = "#ffd6ba"; // Warm skin tone
      octx.fillRect(px - 3 * S, py - 5 * S, 6 * S, 6 * S);

      // Hair (Dark purple/black stylish pixel hair)
      octx.fillStyle = "#120826";
      octx.fillRect(px - 4 * S, py - 7 * S, 8 * S, 3 * S);
      octx.fillRect(px - 4 * S, py - 5 * S, 2 * S, 3 * S);
      octx.fillRect(px + 2 * S, py - 5 * S, 2 * S, 2 * S);
      // Cute tuft
      octx.fillRect(px - 2 * S, py - 8 * S, 4 * S, 1 * S);

      // Glasses / Eyes (Neon cyan frame & sparkle)
      octx.fillStyle = "#00f0ff";
      octx.fillRect(px - 2 * S, py - 3 * S, 2 * S, 2 * S);
      octx.fillRect(px + 1 * S, py - 3 * S, 2 * S, 2 * S);
      octx.fillStyle = "#ffffff";
      octx.fillRect(px - 2 * S, py - 3 * S, 1 * S, 1 * S);
      octx.fillRect(px + 1 * S, py - 3 * S, 1 * S, 1 * S);

      // Cute headphones / antennas
      octx.fillStyle = "#ff2e88";
      octx.fillRect(px - 4 * S, py - 4 * S, 1 * S, 3 * S);
      octx.fillRect(px + 3 * S, py - 4 * S, 1 * S, 3 * S);
      octx.fillRect(px - 3 * S, py - 7 * S, 6 * S, 1 * S);

      // Floating companion pixel orb / pet
      const petX = px + (isWalking ? -12 * S : 10 * S) + Math.sin(frame * 0.1) * 2;
      const petY = py - 8 * S + Math.cos(frame * 0.12) * 3;
      octx.fillStyle = "#00f0ff";
      octx.fillRect(petX, petY, 3 * S, 3 * S);
      octx.fillStyle = "#ffffff";
      octx.fillRect(petX + 1 * S, petY + 1 * S, 1 * S, 1 * S);
    };

    const render = () => {
      frameCount++;

      // 1. Sky Gradient (Deep black navy -> dark purple neon horizon)
      const skyGrad = octx.createLinearGradient(0, 0, 0, V_HEIGHT);
      skyGrad.addColorStop(0, "#050512");
      skyGrad.addColorStop(0.5, "#0e0924");
      skyGrad.addColorStop(0.78, "#210d3a");
      skyGrad.addColorStop(1, "#38104a");
      octx.fillStyle = skyGrad;
      octx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // 2. Stars
      stars.forEach((star) => {
        const twinkle = Math.sin(frameCount * star.speed + star.phase);
        if (twinkle > -0.3) {
          octx.fillStyle = star.color;
          octx.globalAlpha = Math.max(0.2, (twinkle + 1) / 2);
          octx.fillRect(star.x, star.y, star.size, star.size);
        }
      });
      octx.globalAlpha = 1;

      // 3. Pixel Cyber Moon / Orb
      const moonX = V_WIDTH - 65;
      const moonY = 40;
      const moonR = 18;
      // Glow aura
      octx.fillStyle = "rgba(0, 240, 255, 0.08)";
      octx.beginPath();
      octx.arc(moonX, moonY, moonR + 8, 0, Math.PI * 2);
      octx.fill();
      // Moon body
      octx.fillStyle = "#f3eafe";
      octx.beginPath();
      octx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      octx.fill();
      // Pixel craters
      octx.fillStyle = "#d0b0f7";
      octx.fillRect(moonX - 8, moonY - 6, 5, 4);
      octx.fillRect(moonX + 2, moonY + 2, 6, 5);
      octx.fillRect(moonX - 4, moonY + 6, 4, 3);
      // Orbital neon ring
      octx.strokeStyle = "rgba(255, 46, 136, 0.6)";
      octx.lineWidth = 1.5;
      octx.beginPath();
      octx.ellipse(moonX, moonY, moonR + 10, 5, -0.28, 0, Math.PI * 2);
      octx.stroke();

      // 4. Retro Pixel Clouds
      clouds.forEach((c) => {
        c.x = (c.x + c.speed) % (V_WIDTH + c.w + 20);
        const drawX = c.x - c.w;
        octx.fillStyle = "rgba(255, 46, 136, 0.15)";
        octx.fillRect(drawX, c.y, c.w, c.h);
        octx.fillStyle = "rgba(181, 23, 158, 0.25)";
        octx.fillRect(drawX + 8, c.y - 4, c.w - 16, c.h + 6);
        octx.fillStyle = "rgba(255, 255, 255, 0.2)";
        octx.fillRect(drawX + 16, c.y - 2, c.w - 32, 4);
      });

      // 5. Distant Mountain Silhouettes (Purple Cyber Ridge)
      octx.fillStyle = "#160b2e";
      octx.beginPath();
      octx.moveTo(0, V_HEIGHT * 0.76);
      octx.lineTo(40, V_HEIGHT * 0.58);
      octx.lineTo(95, V_HEIGHT * 0.72);
      octx.lineTo(160, V_HEIGHT * 0.52);
      octx.lineTo(230, V_HEIGHT * 0.7);
      octx.lineTo(310, V_HEIGHT * 0.48);
      octx.lineTo(390, V_HEIGHT * 0.68);
      octx.lineTo(450, V_HEIGHT * 0.55);
      octx.lineTo(V_WIDTH, V_HEIGHT * 0.7);
      octx.lineTo(V_WIDTH, V_HEIGHT);
      octx.lineTo(0, V_HEIGHT);
      octx.closePath();
      octx.fill();

      // Midground Hills with neon edge
      octx.fillStyle = "#1e0f3d";
      octx.beginPath();
      octx.moveTo(0, V_HEIGHT * 0.8);
      octx.lineTo(80, V_HEIGHT * 0.69);
      octx.lineTo(190, V_HEIGHT * 0.78);
      octx.lineTo(290, V_HEIGHT * 0.66);
      octx.lineTo(410, V_HEIGHT * 0.75);
      octx.lineTo(V_WIDTH, V_HEIGHT * 0.69);
      octx.lineTo(V_WIDTH, V_HEIGHT);
      octx.lineTo(0, V_HEIGHT);
      octx.closePath();
      octx.fill();

      // Neon highlight rim on hills
      octx.strokeStyle = "rgba(0, 240, 255, 0.35)";
      octx.lineWidth = 1;
      octx.beginPath();
      octx.moveTo(0, V_HEIGHT * 0.8);
      octx.lineTo(80, V_HEIGHT * 0.69);
      octx.lineTo(190, V_HEIGHT * 0.78);
      octx.lineTo(290, V_HEIGHT * 0.66);
      octx.lineTo(410, V_HEIGHT * 0.75);
      octx.lineTo(V_WIDTH, V_HEIGHT * 0.69);
      octx.stroke();

      // Distant pixel pine trees
      const treeCols = [25, 60, 140, 200, 260, 340, 420];
      treeCols.forEach((tx) => {
        const ty = V_HEIGHT * 0.73;
        octx.fillStyle = "#110724";
        octx.fillRect(tx, ty - 16, 8, 16);
        octx.fillRect(tx - 3, ty - 12, 14, 10);
        octx.fillRect(tx - 6, ty - 6, 20, 8);
      });

      // 6. Foreground Grassy Ground Platform
      const groundY = V_HEIGHT * 0.82;

      // Dark soil bedrock
      octx.fillStyle = "#0a0715";
      octx.fillRect(0, groundY + 12, V_WIDTH, V_HEIGHT - (groundY + 12));

      // Dirt block layer with pixel noise
      octx.fillStyle = "#1b122c";
      octx.fillRect(0, groundY + 4, V_WIDTH, 10);
      for (let dx = 0; dx < V_WIDTH; dx += 8) {
        octx.fillStyle = dx % 16 === 0 ? "#281745" : "#130a21";
        octx.fillRect(dx, groundY + 6, 4, 4);
      }

      // Lush Grass Top (Vibrant green / neon lime pixel layer)
      octx.fillStyle = "#2b9348";
      octx.fillRect(0, groundY, V_WIDTH, 5);
      octx.fillStyle = "#55a630";
      octx.fillRect(0, groundY - 2, V_WIDTH, 3);
      octx.fillStyle = "#80b918";
      octx.fillRect(0, groundY - 3, V_WIDTH, 2);

      // Pixel grass tufts & tiny neon flowers
      for (let gx = 4; gx < V_WIDTH; gx += 12) {
        const bladeH = 3 + ((gx * 7) % 4);
        octx.fillStyle = "#aacc00";
        octx.fillRect(gx, groundY - 3 - bladeH, 2, bladeH);

        // Flowers
        if (gx % 36 === 0) {
          octx.fillStyle = gx % 72 === 0 ? "#ff2e88" : "#00f0ff";
          octx.fillRect(gx - 1, groundY - 4 - bladeH, 4, 3);
          octx.fillStyle = "#ffffff";
          octx.fillRect(gx, groundY - 3 - bladeH, 2, 1);
        }
      }

      // Glowing pixel mushrooms
      const mushroomPositions = [45, 115, 320, 440];
      mushroomPositions.forEach((mx) => {
        // stem
        octx.fillStyle = "#f4f0e8";
        octx.fillRect(mx + 2, groundY - 6, 2, 6);
        // cap (glowing pink / cyan)
        octx.fillStyle = mx % 90 === 0 ? "#00f0ff" : "#ff2e88";
        octx.fillRect(mx, groundY - 10, 6, 4);
        octx.fillStyle = "#ffffff";
        octx.fillRect(mx + 1, groundY - 9, 1, 1);
        octx.fillRect(mx + 4, groundY - 9, 1, 1);
      });

      // 7. Fireflies drifting around grass
      fireflies.forEach((f) => {
        f.x = f.baseX + Math.sin(frameCount * 0.03 + f.phase) * 14;
        f.y = f.baseY + Math.cos(frameCount * 0.04 + f.phase) * 6;
        const pulse = (Math.sin(frameCount * 0.08 + f.phase) + 1) / 2;
        octx.fillStyle = pulse > 0.4 ? "#70e000" : "#ffd166";
        octx.globalAlpha = Math.max(0.2, pulse);
        octx.fillRect(f.x, f.y, 2, 2);
      });
      octx.globalAlpha = 1;

      // 8. Animated Small Pixel Character Walking on the Grass!
      // Character position is driven by scroll progress across the grass
      const currentScrollP = scrollProgressRef.current;
      const charStartX = 55;
      const charEndX = V_WIDTH - 65;
      const charTargetX = charStartX + currentScrollP * (charEndX - charStartX);

      // Character is walking if scroll is changing or actively exploring
      const isWalking = Math.abs(charTargetX - lastCharXRef.current) > 0.3 || (currentScrollP > 0.02 && currentScrollP < 0.98);
      lastCharXRef.current = charTargetX;

      const characterGroundY = groundY - 26;
      drawPixelCharacter(charTargetX, characterGroundY, frameCount, isWalking);

      // Render offscreen buffer scaled up to the screen canvas (sharp pixel rendering)
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, V_WIDTH, V_HEIGHT, 0, 0, canvas.width, canvas.height);

      // Scanline overlay on screen
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Refs for animation frame sync
  const scrollProgressRef = useRef(0);
  const lastCharXRef = useRef(55);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Determine unlock thresholds for each letter
  // Total span is roughly progress 0.10 to 0.84
  const getLetterStatus = (index: number) => {
    const startP = 0.10 + (index / TOTAL_LETTERS) * 0.68;
    const isUnlockedLetter = scrollProgress >= startP;
    const progressDiff = Math.max(0, scrollProgress - startP);
    const popIntensity = Math.min(1, progressDiff * 8); // 0 to 1 quick snap
    return {
      isUnlocked: isUnlockedLetter,
      popIntensity,
      startP,
    };
  };

  const handleSkipClick = () => {
    const aboutEl = document.getElementById("about");
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} className="pixel-hero-section" id="top">
      {/* Dynamic Pixel Art Canvas Background */}
      <canvas ref={canvasRef} className="pixel-hero-canvas" aria-label="Pixel art game environment" />

      {/* Retro HUD Top Header Bar */}
      <header className="pixel-hud-header" aria-label="Game HUD Navigation">
        <div className="hud-player-tag">
          <span className="hud-live-dot" />
          <span className="hud-label-dim">PLAYER:</span>
          <span className="hud-label-bright">SOUMYA_01</span>
          <span className="hud-bracket">[LVL 2026]</span>
        </div>

        <nav className="pixel-hud-nav" aria-label="Main Portfolio Navigation">
          <a
            href="#about"
            className="pixel-hud-link"
            onClick={(e) => {
              if (onNavClick) {
                e.preventDefault();
                onNavClick("about");
              }
            }}
          >
            <span className="hud-link-arrow">▶</span> ABOUT
          </a>
          <a
            href="#skills"
            className="pixel-hud-link"
            onClick={(e) => {
              if (onNavClick) {
                e.preventDefault();
                onNavClick("skills");
              }
            }}
          >
            <span className="hud-link-arrow">▶</span> SKILLS
          </a>
          <a
            href="#projects"
            className="pixel-hud-link"
            onClick={(e) => {
              if (onNavClick) {
                e.preventDefault();
                onNavClick("projects");
              }
            }}
          >
            <span className="hud-link-arrow">▶</span> PROJECTS
          </a>
        </nav>
      </header>

      {/* Main Dominant Centerpiece: SOUMYA GHOSH (Scroll-Driven Letter Reveal) */}
      <div className="pixel-hero-centerpiece">
        {/* Intro Status Pill / Banner */}
        <div className={`pixel-status-pill ${scrollProgress > 0.08 ? "has-started" : ""}`}>
          <span className="pixel-icon">✦</span>
          <span className="pixel-status-text">
            {scrollProgress < 0.10
              ? "DISCOVERING PLAYER IDENTITY..."
              : scrollProgress < 0.85
              ? `DECRYPTING HERO TITLE: ${Math.min(100, Math.floor(((scrollProgress - 0.10) / 0.74) * 100))}%`
              : "★ TITLE UNLOCKED: HERO OF CODE ★"}
          </span>
          <span className="pixel-icon">✦</span>
        </div>

        {/* DOMINANT HERO TEXT */}
        <div className="pixel-hero-title-group" role="heading" aria-level={1} aria-label="SOUMYA GHOSH">
          {/* Word 1: SOUMYA */}
          <div className="pixel-word-row word-soumya">
            {FIRST_NAME.map((char, index) => {
              const status = getLetterStatus(index);
              const displayChar = letterGlitches[`fn_${index}`] || char;

              return (
                <span
                  key={`fn_${index}`}
                  className={`pixel-letter ${status.isUnlocked ? "is-revealed" : "is-hidden"} ${
                    isUnlocked ? "is-locked" : ""
                  }`}
                  style={{
                    transform: status.isUnlocked
                      ? `translateY(${Math.max(0, (1 - status.popIntensity) * 18)}px) scale(${
                          1 + (1 - status.popIntensity) * 0.22
                        })`
                      : "translateY(32px) scale(0.65)",
                    opacity: status.isUnlocked ? 1 : 0.04,
                    filter: status.isUnlocked ? "blur(0px)" : "blur(4px)",
                  }}
                >
                  <span className="pixel-letter-face">{status.isUnlocked ? displayChar : "_"}</span>
                  {status.isUnlocked && <span className="pixel-letter-glint" />}
                </span>
              );
            })}
          </div>

          {/* Word 2: GHOSH */}
          <div className="pixel-word-row word-ghosh">
            {LAST_NAME.map((char, index) => {
              const globalIndex = FIRST_NAME.length + index;
              const status = getLetterStatus(globalIndex);
              const displayChar = letterGlitches[`ln_${index}`] || char;

              return (
                <span
                  key={`ln_${index}`}
                  className={`pixel-letter ${status.isUnlocked ? "is-revealed" : "is-hidden"} ${
                    isUnlocked ? "is-locked" : ""
                  }`}
                  style={{
                    transform: status.isUnlocked
                      ? `translateY(${Math.max(0, (1 - status.popIntensity) * 18)}px) scale(${
                          1 + (1 - status.popIntensity) * 0.22
                        })`
                      : "translateY(32px) scale(0.65)",
                    opacity: status.isUnlocked ? 1 : 0.04,
                    filter: status.isUnlocked ? "blur(0px)" : "blur(4px)",
                  }}
                >
                  <span className="pixel-letter-face">{status.isUnlocked ? displayChar : "_"}</span>
                  {status.isUnlocked && <span className="pixel-letter-glint" />}
                </span>
              );
            })}
          </div>
        </div>

        {/* Subtitle & Tagline (Reveals with unlock or subtle hint) */}
        <div className={`pixel-hero-meta ${scrollProgress > 0.4 ? "is-visible" : ""}`}>
          <div className="pixel-role-badge">
            <span className="pixel-role-dot" />
            <span>COMPUTER SCIENCE & CREATIVE TECHNOLOGY</span>
          </div>
          <p className="pixel-tagline">Building at the intersection of technology, creativity, and human intent.</p>
        </div>
      </div>

      {/* Bottom HUD: XP Bar, Scroll Indicator & Skip Button */}
      <footer className="pixel-hud-footer">
        {/* XP / Scroll Progress Bar */}
        <div className="hud-xp-box">
          <div className="hud-xp-label">
            <span>SCROLL_XP</span>
            <span className="hud-xp-percent">{Math.min(100, Math.floor(scrollProgress * 100))}%</span>
          </div>
          <div className="hud-xp-track">
            <div
              className="hud-xp-fill"
              style={{ width: `${Math.min(100, Math.max(3, scrollProgress * 100))}%` }}
            />
          </div>
        </div>

        {/* Interactive Scroll Prompt / Title Unlocked Prompt */}
        <div className="hud-scroll-prompt">
          {scrollProgress < 0.88 ? (
            <div className="prompt-scroll-hint">
              <span className="prompt-arrows">▼ ▼ ▼</span>
              <span className="prompt-text">SCROLL DOWN TO UNLOCK TITLE</span>
              <span className="prompt-arrows">▼ ▼ ▼</span>
            </div>
          ) : (
            <a href="#about" className="prompt-unlocked-btn" onClick={handleSkipClick}>
              <span className="prompt-star">★</span>
              <span className="prompt-unlocked-text">SOUMYA GHOSH UNLOCKED • ENTER PORTFOLIO</span>
              <span className="prompt-arrow-anim">▼</span>
            </a>
          )}
        </div>

        {/* Quick Skip Link */}
        <button type="button" className="hud-skip-btn" onClick={handleSkipClick}>
          <span>SKIP INTRO</span>
          <span className="hud-skip-arrow">⏭</span>
        </button>
      </footer>
    </section>
  );
}
