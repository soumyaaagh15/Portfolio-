import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  { text: "HELLO", sub: "[ EN ]", color: "#00f0ff", glow: "rgba(0, 240, 255, 0.7)" },
  { text: "NAMASTE", sub: "[ HI // नमस्ते ]", color: "#ff2e88", glow: "rgba(255, 46, 136, 0.75)" },
  { text: "HALLO", sub: "[ DE ]", color: "#70e000", glow: "rgba(112, 224, 0, 0.7)" },
];

export default function IntroCurtain() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Cycle greetings: HELLO (750ms) -> NAMASTE (950ms) -> HALLO (750ms) -> Open Curtain
    const t1 = setTimeout(() => {
      setGreetingIndex(1); // NAMASTE
    }, 750);

    const t2 = setTimeout(() => {
      setGreetingIndex(2); // HALLO
    }, 1700);

    const t3 = setTimeout(() => {
      setIsOpen(true); // Open curtain wipe
    }, 2450);

    const t4 = setTimeout(() => {
      setIsDismissed(true); // Remove from DOM
    }, 3350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleSkip = () => {
    setIsOpen(true);
    setTimeout(() => setIsDismissed(true), 900);
  };

  if (isDismissed) return null;

  const currentGreeting = GREETINGS[greetingIndex];

  return (
    <div className={`intro-curtain-root ${isOpen ? "is-opening" : ""}`} onClick={handleSkip}>
      {/* Top Half Curtain */}
      <motion.div
        className="intro-curtain-panel curtain-top"
        initial={{ y: "0%" }}
        animate={{ y: isOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="curtain-grid-texture" />
      </motion.div>

      {/* Bottom Half Curtain */}
      <motion.div
        className="intro-curtain-panel curtain-bottom"
        initial={{ y: "0%" }}
        animate={{ y: isOpen ? "100%" : "0%" }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="curtain-grid-texture" />
      </motion.div>

      {/* Center Greeting Word Display */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="intro-greeting-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: "blur(8px)" }}
            transition={{ duration: 0.35 }}
          >
            <div className="intro-pixel-decorations">
              <span className="decor-star star-tl">✦</span>
              <span className="decor-star star-tr">✦</span>
              <span className="decor-badge">SG // WORLD v2.6</span>
              <span className="decor-star star-bl">✦</span>
              <span className="decor-star star-br">✦</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentGreeting.text}
                className="greeting-word-box"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 1.05 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <span
                  className="greeting-text"
                  style={{
                    color: currentGreeting.color,
                    textShadow: `0 0 20px ${currentGreeting.glow}, 0 0 40px ${currentGreeting.glow}, 3px 3px 0px #120826`,
                  }}
                >
                  {currentGreeting.text}
                </span>
                <span className="greeting-subtag">{currentGreeting.sub}</span>
              </motion.div>
            </AnimatePresence>

            <div className="intro-loading-bar-wrap">
              <div className="intro-loading-track">
                <motion.div
                  className="intro-loading-progress"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.45, ease: "linear" }}
                />
              </div>
              <span className="intro-skip-hint">PRESS ANYWHERE TO SKIP [▶]</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
