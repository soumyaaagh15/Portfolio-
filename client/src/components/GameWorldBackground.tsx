import React, { useEffect, useRef } from "react";

export default function GameWorldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    let isVisible = true;

    // Fixed virtual pixel resolution for authentic pixel art look
    const V_WIDTH = 640;
    const V_HEIGHT = 360;

    const offscreen = document.createElement("canvas");
    offscreen.width = V_WIDTH;
    offscreen.height = V_HEIGHT;
    const octx = offscreen.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = false;

    // Stars pool
    const STAR_COLORS = ["#ffffff", "#00f0ff", "#ff2e88", "#ffd166", "#70e000", "#c77dff"];
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      phase: number;
    }> = [];

    for (let i = 0; i < 95; i++) {
      stars.push({
        x: Math.random() * V_WIDTH,
        y: Math.random() * V_HEIGHT,
        size: Math.random() > 0.82 ? 2 : 1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        speed: 0.02 + Math.random() * 0.045,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Floating pixel embers / fireflies
    const embers: Array<{
      x: number;
      y: number;
      baseX: number;
      speedY: number;
      size: number;
      color: string;
      phase: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 28; i++) {
      const bx = Math.random() * V_WIDTH;
      embers.push({
        x: bx,
        y: Math.random() * V_HEIGHT,
        baseX: bx,
        speedY: 0.15 + Math.random() * 0.35,
        size: Math.random() > 0.7 ? 2 : 1,
        color: Math.random() > 0.4 ? "#00f0ff" : Math.random() > 0.5 ? "#ff2e88" : "#ffd166",
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.6,
      });
    }

    // Clouds pool
    const clouds = [
      { x: 40, y: 50, w: 70, h: 14, speed: 0.04 },
      { x: 260, y: 110, w: 90, h: 16, speed: 0.03 },
      { x: 480, y: 65, w: 80, h: 12, speed: 0.05 },
    ];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      frame++;

      // 1. Cosmic Sky Gradient
      const skyGrad = octx.createLinearGradient(0, 0, 0, V_HEIGHT);
      skyGrad.addColorStop(0, "#050410");
      skyGrad.addColorStop(0.35, "#0b0720");
      skyGrad.addColorStop(0.7, "#170a30");
      skyGrad.addColorStop(1, "#080516");
      octx.fillStyle = skyGrad;
      octx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      // 2. Distant Subtle Cyber Grid lines (Perspective floor at bottom)
      octx.strokeStyle = "rgba(0, 240, 255, 0.06)";
      octx.lineWidth = 1;
      const gridY = V_HEIGHT * 0.65;
      for (let y = gridY; y < V_HEIGHT; y += 12) {
        octx.beginPath();
        octx.moveTo(0, y);
        octx.lineTo(V_WIDTH, y);
        octx.stroke();
      }
      for (let x = -40; x < V_WIDTH + 80; x += 36) {
        octx.beginPath();
        octx.moveTo(x, gridY);
        octx.lineTo(x + (x - V_WIDTH / 2) * 0.65, V_HEIGHT);
        octx.stroke();
      }

      // 3. Cyber Moon / Orbital Neon Halo in Top Right
      const moonX = V_WIDTH - 60;
      const moonY = 48;
      const moonR = 16;
      // Moon glow
      octx.fillStyle = "rgba(0, 240, 255, 0.07)";
      octx.beginPath();
      octx.arc(moonX, moonY, moonR + 10, 0, Math.PI * 2);
      octx.fill();

      // Moon body
      octx.fillStyle = "#ede2fe";
      octx.beginPath();
      octx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      octx.fill();

      // Craters
      octx.fillStyle = "#cca8fa";
      octx.fillRect(moonX - 6, moonY - 5, 4, 3);
      octx.fillRect(moonX + 2, moonY + 2, 5, 4);
      octx.fillRect(moonX - 3, moonY + 5, 3, 2);

      // Neon Orbital Ring
      octx.strokeStyle = "rgba(255, 46, 136, 0.55)";
      octx.lineWidth = 1.2;
      octx.beginPath();
      octx.ellipse(moonX, moonY, moonR + 8, 4.5, -0.3, 0, Math.PI * 2);
      octx.stroke();

      // 4. Retro Pixel Clouds
      clouds.forEach((c) => {
        c.x = (c.x + c.speed) % (V_WIDTH + c.w + 40);
        const drawX = c.x - c.w;
        octx.fillStyle = "rgba(255, 46, 136, 0.12)";
        octx.fillRect(drawX, c.y, c.w, c.h);
        octx.fillStyle = "rgba(181, 23, 158, 0.2)";
        octx.fillRect(drawX + 8, c.y - 3, c.w - 16, c.h + 5);
        octx.fillStyle = "rgba(255, 255, 255, 0.15)";
        octx.fillRect(drawX + 16, c.y - 1, c.w - 32, 3);
      });

      // 5. Pixel Stars
      stars.forEach((star) => {
        const twinkle = Math.sin(frame * star.speed + star.phase);
        if (twinkle > -0.2) {
          octx.fillStyle = star.color;
          octx.globalAlpha = Math.max(0.18, Math.min(1, (twinkle + 1) / 2));
          octx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
        }
      });
      octx.globalAlpha = 1;

      // 6. Floating Cyber Embers / Fireflies
      embers.forEach((emb) => {
        emb.y -= emb.speedY;
        if (emb.y < -10) {
          emb.y = V_HEIGHT + 10;
          emb.baseX = Math.random() * V_WIDTH;
        }
        emb.x = emb.baseX + Math.sin(frame * 0.03 + emb.phase) * 16;
        const pulse = 0.5 + Math.sin(frame * 0.06 + emb.phase) * 0.5;

        octx.fillStyle = emb.color;
        octx.globalAlpha = emb.alpha * pulse;
        octx.fillRect(Math.floor(emb.x), Math.floor(emb.y), emb.size, emb.size);
      });
      octx.globalAlpha = 1;

      // Render offscreen buffer to high-res on-screen canvas
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="global-game-background-container" aria-hidden="true">
      <canvas ref={canvasRef} className="global-game-background-canvas" />
      <div className="global-game-grid-overlay" />
      <div className="global-game-scanlines" />
    </div>
  );
}
