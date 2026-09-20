import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Bottom Canvas (Bushes, Signpost, Flowers, Ground, Stars)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const V_WIDTH = 640;
    const V_HEIGHT = 80;

    const offscreen = document.createElement("canvas");
    offscreen.width = V_WIDTH;
    offscreen.height = V_HEIGHT;
    const octx = offscreen.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = false;

    const render = () => {
      frame++;
      octx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

      const groundY = 65;

      // Bottom Dark Subsoil
      octx.fillStyle = "#150a25";
      octx.fillRect(0, groundY + 4, V_WIDTH, 15);
      octx.fillStyle = "#2d164d";
      octx.fillRect(0, groundY + 2, V_WIDTH, 4);

      // Grass Top
      octx.fillStyle = "#157a3c";
      octx.fillRect(0, groundY, V_WIDTH, 2);
      octx.fillStyle = "#2ec466";
      octx.fillRect(0, groundY - 1, V_WIDTH, 1);
      octx.fillStyle = "#5dfc96";
      octx.fillRect(0, groundY - 2, V_WIDTH, 1);

      // Left Lush Bush & Signpost
      // Left Wooden Signpost
      octx.fillStyle = "#4e342e";
      octx.fillRect(26, groundY - 20, 4, 20);
      octx.fillStyle = "#ab47bc";
      octx.fillRect(16, groundY - 24, 24, 6);
      octx.fillStyle = "#e1bee7";
      octx.fillRect(20, groundY - 22, 5, 2);

      // Left Bushes
      octx.fillStyle = "#1b5e20";
      octx.fillRect(0, groundY - 22, 28, 22);
      octx.fillStyle = "#2e7d32";
      octx.fillRect(2, groundY - 26, 22, 18);
      octx.fillStyle = "#4caf50";
      octx.fillRect(6, groundY - 28, 14, 10);

      // Left Flowers (Pink, Blue, Yellow)
      octx.fillStyle = "#ff4081";
      octx.fillRect(10, groundY - 14, 4, 4);
      octx.fillRect(22, groundY - 10, 3, 3);
      octx.fillStyle = "#00e5ff";
      octx.fillRect(4, groundY - 8, 3, 3);
      octx.fillStyle = "#ffd54f";
      octx.fillRect(11, groundY - 13, 2, 2);

      // Right Lush Bush & Heart Signpost
      // Right Signpost
      octx.fillStyle = "#4e342e";
      octx.fillRect(V_WIDTH - 30, groundY - 18, 4, 18);
      octx.fillStyle = "#d81b60";
      octx.fillRect(V_WIDTH - 38, groundY - 22, 20, 6);
      octx.fillStyle = "#ffffff";
      octx.fillRect(V_WIDTH - 30, groundY - 20, 4, 2);

      // Right Bushes
      octx.fillStyle = "#1b5e20";
      octx.fillRect(V_WIDTH - 28, groundY - 22, 28, 22);
      octx.fillStyle = "#2e7d32";
      octx.fillRect(V_WIDTH - 24, groundY - 26, 22, 18);
      octx.fillStyle = "#4caf50";
      octx.fillRect(V_WIDTH - 20, groundY - 28, 14, 10);

      // Right Flowers
      octx.fillStyle = "#ff4081";
      octx.fillRect(V_WIDTH - 18, groundY - 14, 4, 4);
      octx.fillStyle = "#00e5ff";
      octx.fillRect(V_WIDTH - 12, groundY - 8, 3, 3);
      octx.fillStyle = "#ffd54f";
      octx.fillRect(V_WIDTH - 17, groundY - 13, 2, 2);

      // Random small flower dots along the floor
      octx.fillStyle = "#ff80ab";
      octx.fillRect(120, groundY - 4, 3, 3);
      octx.fillRect(280, groundY - 4, 3, 3);
      octx.fillRect(440, groundY - 4, 3, 3);
      octx.fillStyle = "#ffd54f";
      octx.fillRect(121, groundY - 3, 1, 1);
      octx.fillRect(281, groundY - 3, 1, 1);
      octx.fillRect(441, groundY - 3, 1, 1);

      // Render to visible canvas
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

  return (
    <footer className="contact-pixel-page" id="contact" ref={containerRef} aria-label="Contact Me — Let's Connect">
      {/* 1. Centered Header: ★ CONTACT ME ★ — LET'S CONNECT — */}
      <div className="contact-main-header">
        <div className="contact-title-row">
          <span className="contact-star-gold left">★</span>
          <h2 className="contact-pixel-title">CONTACT ME</h2>
          <span className="contact-star-gold right">★</span>
        </div>
        <p className="contact-sub-caption">— LET’S CONNECT —</p>
      </div>

      {/* 2. Large Rounded Pixel Frame with 4 Horizontal Pill Cards */}
      <motion.div
        className="contact-pixel-frame"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Corner Neon Brackets */}
        <div className="frame-corner-bracket tl" />
        <div className="frame-corner-bracket tr" />
        <div className="frame-corner-bracket bl" />
        <div className="frame-corner-bracket br" />

        <div className="contact-pills-row">
          {/* 1. Phone Pill */}
          <div
            className="contact-pill-item pill-phone"
            role="button"
            tabIndex={0}
            onClick={() => handleCopy("phone", "+91 99380 43538")}
            title="Click to copy phone number"
          >
            <div className="pill-icon-wrap icon-phone">
              <span>📞</span>
            </div>
            <span className="pill-text-value">
              {copiedKey === "phone" ? "COPIED! ✓" : "+91 99380 43538"}
            </span>
          </div>

          {/* 2. GitHub Pill */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-pill-item pill-github"
            title="Open GitHub Profile"
          >
            <div className="pill-icon-wrap icon-github">
              <span className="github-cat-icon">🐙</span>
            </div>
            <span className="pill-text-value">github.com/soumya</span>
          </a>

          {/* 3. LinkedIn Pill */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-pill-item pill-linkedin"
            title="Open LinkedIn Profile"
          >
            <div className="pill-icon-wrap icon-linkedin">
              <span className="linkedin-in-text">in</span>
            </div>
            <span className="pill-text-value">linkedin.com/in/soumya</span>
          </a>

          {/* 4. Email Pill */}
          <a
            href="mailto:soumya.ghosh@gmail.com"
            className="contact-pill-item pill-email"
            title="Send an Email"
          >
            <div className="pill-icon-wrap icon-email">
              <span>✉️</span>
            </div>
            <span className="pill-text-value">soumya.ghosh@gmail.com</span>
          </a>
        </div>
      </motion.div>

      {/* 3. Bottom Farewell Banner: ♥ - thanks for visiting - ♥ */}
      <div className="contact-farewell-text">
        <span className="farewell-heart">♥</span>
        <span>- thanks for visiting -</span>
        <span className="farewell-heart">♥</span>
      </div>

      {/* 4. Bottom Canvas Ground (Bushes, Flowers, Ground, Signpost) */}
      <canvas ref={canvasRef} className="contact-ground-canvas" aria-hidden="true" />
    </footer>
  );
}
