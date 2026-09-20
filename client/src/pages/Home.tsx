import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScatterText } from "@/components/core/ScatterText";
import SkillsEnvelope from "@/components/SkillsEnvelope";
import ProjectsSection from "@/components/ProjectsSection";
import PixelHero from "@/components/PixelHero";
import HobbiesSection from "@/components/HobbiesSection";
import ContactSection from "@/components/ContactSection";
import IntroCurtain from "@/components/IntroCurtain";
import GameWorldBackground from "@/components/GameWorldBackground";

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

function ScrambleLabel({ children, className = "" }: { children: string; className?: string }) {
  const [label, setLabel] = useState(children);
  const [active, setActive] = useState(false);

  const scramble = () => {
    setActive(true);
    let frame = 0;
    const totalFrames = 8;
    const timer = window.setInterval(() => {
      frame += 1;
      const next = children
        .split("")
        .map((char, index) => {
          if (char === " " || frame > totalFrames - index * 0.7) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      setLabel(next);
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setLabel(children);
        setActive(false);
      }
    }, 36);
  };

  return (
    <span
      className={`technical-label ${active ? "is-scrambling" : ""} ${className}`}
      tabIndex={0}
      onMouseEnter={scramble}
      onFocus={scramble}
    >
      {label}
    </span>
  );
}

const learningList = ["DSA", "WEB DEVELOPMENT", "AI + APIS", "BACKEND", "UI/UX", "CREATIVE TECHNOLOGY"];

export default function Home() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paper = document.querySelector(".about-paper");
    if (!paper) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        paper,
        { y: 80, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: paper, start: "top 86%", end: "top 48%", scrub: 1 },
        }
      );

      gsap.fromTo(
        ".about-heading-wrap, .about-copy",
        { y: 42, opacity: 0.7 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: ".about-grid", start: "top 78%", end: "top 43%", scrub: 1 },
        }
      );

      gsap.fromTo(
        ".learning-item",
        { x: 34, opacity: 0.6 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".learning-section", start: "top 86%", end: "top 55%", scrub: 1 },
        }
      );
    }, document.body);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="portfolio-shell">
      {/* Global Interactive Pixel Starfield & Cyber Horizon Background */}
      <GameWorldBackground />

      {/* Intro Greeting Sequence: HELLO -> NAMASTE -> HALLO + Curtain Reveal */}
      <IntroCurtain />

      {/* 
        First Page: Pixel-Art Game Intro & Scroll-Driven SOUMYA GHOSH Title Unlock
      */}
      <PixelHero onNavClick={handleNavClick} />

      {/* Editorial / Pixel About Stage */}
      <section className="about-stage" id="about">
        <div className="about-paper">
          <div className="paper-labels" aria-hidden="true">
            <ScrambleLabel className="label-top-left">HOVER ME</ScrambleLabel>
            <ScrambleLabel className="label-top-right">SYSTEM_01</ScrambleLabel>
            <ScrambleLabel className="label-mid-right">HELLO_WORLD</ScrambleLabel>
            <ScrambleLabel className="label-bottom-left">/ABOUT</ScrambleLabel>
            <ScrambleLabel className="label-bottom-right">BUILDING...</ScrambleLabel>
            <ScrambleLabel className="label-edge">SOUMYA.EXE</ScrambleLabel>
          </div>

          <div className="about-topline">
            <span>01 / ABOUT</span>
            <span>learning in public, quietly</span>
          </div>

          <div className="about-grid">
            <div className="about-heading-wrap">
              {/* Interactive Scatter Text Physics Title */}
              <ScatterText
                text="A LITTLE ABOUT ME."
                as="h2"
                className="about-title"
                highlightWords={["ABOUT", "ME"]}
              />
              <div className="about-rule" />
              <p className="about-aside">
                A computer science student with a soft spot for the space between logic and feeling.
              </p>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                I’m Soumya — a Computer Science Engineering undergraduate learning by building.
              </p>
              <p>
                I’m exploring web development, software engineering, AI integration and UI/UX, with a growing interest in
                how technology can become simpler, more useful and more human.
              </p>
              <p>
                I like moving between code and creativity — from DSA and backend logic to designing interfaces,
                experimenting with ideas and building projects around real people and their needs.
              </p>
              <p>Currently: learning, building, experimenting, and figuring things out one project at a time.</p>
            </div>
          </div>

          <div className="learning-section">
            <div className="learning-heading">
              <span className="tiny-index">02</span>
              <h3>AREAS OF INTEREST</h3>
            </div>
            <div className="learning-list">
              {learningList.map((item, index) => (
                <div className="learning-item" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                  <i aria-hidden="true">↗</i>
                </div>
              ))}
            </div>
          </div>

          <div className="paper-footer">
            <span>made with curiosity</span>
            <span>SOUMYA / 2026</span>
          </div>
        </div>
      </section>

      {/* Skills Envelope Showcase */}
      <section id="skills">
        <SkillsEnvelope />
      </section>

      {/* Projects Showcase */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* Hobbies Showcase — 2D Collectible Stickers */}
      <HobbiesSection onNavClick={handleNavClick} />

      {/* Final Page: Contact Me — 4 Pixel Game Cards */}
      <ContactSection />
    </main>
  );
}
