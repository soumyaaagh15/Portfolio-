import { motion, type HTMLMotionProps } from "framer-motion";
import { createElement, type ElementType, type ReactNode } from "react";

type TextEffectProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  per?: "word" | "char";
  as?: ElementType;
  preset?: "slide" | "fade";
};

export function TextEffect({ children, per = "word", as = "div", preset = "slide", className, ...props }: TextEffectProps) {
  const text = typeof children === "string" ? children : String(children);
  const units = per === "char" ? Array.from(text) : text.split(" ");
  const MotionTag = motion(as as ElementType);
  const parentVariants = {
    hidden: {},
    show: { transition: { staggerChildren: per === "char" ? 0.025 : 0.075 } },
  };
  const childVariants = preset === "fade"
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" as const } } }
    : { hidden: { opacity: 0, y: "0.7em" }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const } } };

  return (
    <MotionTag
      aria-label={text}
      className={className}
      variants={parentVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.55 }}
      {...props}
    >
      {units.map((unit, index) => (
        <motion.span key={`${unit}-${index}`} variants={childVariants} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {unit}{per === "word" && index < units.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
