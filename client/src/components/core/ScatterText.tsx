import { useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

interface ScatterTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  scatterRadius?: number;
  highlightWords?: string[];
  enableInteractive?: boolean;
}

interface CharData {
  char: string;
  index: number;
  isSpace: boolean;
  isHighlight: boolean;
  initScatter: {
    x: number;
    y: number;
    z: number;
    rot: number;
    rotX: number;
    rotY: number;
    scale: number;
  };
}

export function ScatterText({
  text,
  className = "",
  as = "h2",
  scatterRadius = 80,
  highlightWords = ["ABOUT", "ME"],
  enableInteractive = true,
}: ScatterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.4 });
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  // Generate deterministic/stable initial scatter offsets for each character
  const charList: CharData[] = useMemo(() => {
    let globalIdx = 0;
    const words = text.split(" ");
    const result: CharData[] = [];

    words.forEach((word, wordIdx) => {
      const isWordHighlight = highlightWords.some(
        (hw) => word.toUpperCase().includes(hw.toUpperCase())
      );

      const letters = Array.from(word);
      letters.forEach((char) => {
        // Pseudo-random deterministic offsets based on index
        const angle = ((globalIdx * 137.5) % 360) * (Math.PI / 180);
        const dist = 40 + ((globalIdx * 37) % scatterRadius);
        const x = Math.cos(angle) * dist + Math.sin(globalIdx * 3) * 20;
        const y = Math.sin(angle) * dist * 0.85 + Math.cos(globalIdx * 4) * 25;
        const rot = ((globalIdx * 47) % 90) - 45;
        const rotX = ((globalIdx * 31) % 60) - 30;
        const rotY = ((globalIdx * 23) % 60) - 30;

        result.push({
          char,
          index: globalIdx,
          isSpace: false,
          isHighlight: isWordHighlight,
          initScatter: {
            x,
            y,
            z: Math.sin(globalIdx) * 50,
            rot,
            rotX,
            rotY,
            scale: 0.6 + (globalIdx % 5) * 0.1,
          },
        });
        globalIdx++;
      });

      if (wordIdx < words.length - 1) {
        result.push({
          char: " ",
          index: globalIdx,
          isSpace: true,
          isHighlight: false,
          initScatter: { x: 0, y: 0, z: 0, rot: 0, rotX: 0, rotY: 0, scale: 1 },
        });
        globalIdx++;
      }
    });

    return result;
  }, [text, scatterRadius, highlightWords]);

  // Handle mouse move for radial repulsion scatter
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableInteractive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredIndex(null);
  };

  const toggleExplode = () => {
    setIsGlitching(true);
    setIsExploded((prev) => !prev);
    setTimeout(() => setIsGlitching(false), 600);
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <div
      ref={containerRef}
      className={`scatter-text-wrapper ${isGlitching ? "is-glitching-active" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <MotionTag
        className={`scatter-text-heading ${className}`}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {charList.map((item) => {
          if (item.isSpace) {
            return (
              <span key={`space-${item.index}`} className="scatter-space">
                {"\u00A0"}
              </span>
            );
          }

          // Calculate dynamic scatter offsets if exploded or hovered
          let targetX = 0;
          let targetY = 0;
          let targetRot = 0;
          let targetScale = 1;
          let targetOpacity = 1;
          let targetFilter = "none";

          if (isExploded) {
            targetX = item.initScatter.x * 1.6;
            targetY = item.initScatter.y * 1.6;
            targetRot = item.initScatter.rot * 1.5;
            targetScale = item.initScatter.scale * 1.1;
            targetFilter = "drop-shadow(0 0 8px #ff2e88)";
          } else if (mousePos && containerRef.current) {
            // Radial repulsion based on distance to cursor
            const approxCharX = (item.index / charList.length) * (containerRef.current.clientWidth || 300);
            const approxCharY = (containerRef.current.clientHeight || 100) * 0.5;
            const dx = approxCharX - mousePos.x;
            const dy = approxCharY - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              const force = 1 - dist / 140;
              const angle = Math.atan2(dy, dx);
              targetX = Math.cos(angle) * force * 55;
              targetY = Math.sin(angle) * force * 45;
              targetRot = item.initScatter.rot * force * 0.8;
              targetScale = 1 + force * 0.25;
              targetFilter = force > 0.5 ? "drop-shadow(0 0 10px #00f0ff) brightness(1.2)" : "none";
            }
          }

          return (
            <motion.span
              key={`char-${item.index}`}
              className={`scatter-char ${item.isHighlight ? "is-highlight-char" : ""} ${
                hoveredIndex === item.index ? "is-char-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(item.index)}
              variants={{
                hidden: {
                  opacity: 0,
                  x: item.initScatter.x,
                  y: item.initScatter.y,
                  rotateZ: item.initScatter.rot,
                  rotateX: item.initScatter.rotX,
                  scale: 0.6,
                },
                visible: {
                  opacity: targetOpacity,
                  x: targetX,
                  y: targetY,
                  rotateZ: targetRot,
                  rotateX: 0,
                  scale: targetScale,
                  transition: {
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                    mass: 0.8,
                    delay: item.index * 0.018,
                  },
                },
              }}
              animate={{
                x: targetX,
                y: targetY,
                rotateZ: targetRot,
                scale: targetScale,
                filter: targetFilter,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 24,
                },
              }}
              whileHover={{
                scale: 1.35,
                y: -8,
                rotateZ: (item.index % 2 === 0 ? 1 : -1) * 12,
                color: item.isHighlight ? "#ff2e88" : "#00f0ff",
                textShadow: "0 0 12px rgba(0, 240, 255, 0.8), 2px 2px 0px #ff2e88",
                transition: { duration: 0.15 },
              }}
            >
              {item.char}
            </motion.span>
          );
        })}
      </MotionTag>

      {/* Interactive Trigger Button Prompt */}
      {enableInteractive && (
        <div className="scatter-interact-bar">
          <button
            type="button"
            className={`scatter-trigger-btn ${isExploded ? "is-active" : ""}`}
            onClick={toggleExplode}
            title="Click to scatter / assemble text physics"
          >
            <span className="scatter-btn-icon">{isExploded ? "🧲" : "💥"}</span>
            <span className="scatter-btn-text">
              {isExploded ? "MAGNETIZE // REFORM" : "SCATTER // GLITCH TEXT"}
            </span>
            <span className="scatter-key-badge">CLICK</span>
          </button>
          <span className="scatter-hint-text">
            <span>✦</span> HOVER LETTERS OR CLICK TO TRIGGER PARTICLE PHYSICS
          </span>
        </div>
      )}
    </div>
  );
}
