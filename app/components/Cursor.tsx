"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Cursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Light spring so the icon trails just slightly — feels alive
  const x = useSpring(mouseX, { stiffness: 700, damping: 50 });
  const y = useSpring(mouseY, { stiffness: 700, damping: 50 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updatePointerType = () => setIsFinePointer(mediaQuery.matches);
    updatePointerType();

    mediaQuery.addEventListener("change", updatePointerType);

    return () => {
      mediaQuery.removeEventListener("change", updatePointerType);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - 20); // center the 40px icon on the pointer
      mouseY.set(e.clientY - 20);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isFinePointer, mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 40,
        height: 40,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40.17 40.17"
        width="40"
        height="40"
        style={{ color: "#9dd9d2" }}
      >
        <g>
          <path
            fill="currentColor"
            d="M12.19,39.17c-6.17,0-11.19-5.02-11.19-11.19v-15.78C1,6.02,6.02,1,12.19,1h15.78c6.17,0,11.19,5.02,11.19,11.19v15.78c0,6.17-5.02,11.19-11.19,11.19h-15.78ZM8.03,20.08l6.03,10.44h12.05l6.03-10.44-6.03-10.44h-12.05l-6.03,10.44Z"
          />
          <path
            fill="currentColor"
            d="M27.97,1.5c5.9,0,10.69,4.8,10.69,10.69v15.78c0,5.9-4.8,10.69-10.69,10.69h-15.78c-5.9,0-10.69-4.8-10.69-10.69v-15.78C1.5,6.3,6.3,1.5,12.19,1.5h15.78M13.77,31.02h12.63l.29-.5,5.74-9.94.29-.5-.29-.5-5.74-9.94-.29-.5h-12.63l-.29.5-5.74,9.94-.29.5.29.5,5.74,9.94.29.5M27.97.5h-15.78C5.74.5.5,5.74.5,12.19v15.78c0,6.46,5.24,11.69,11.69,11.69h15.78c6.46,0,11.69-5.24,11.69-11.69v-15.78c0-6.46-5.24-11.69-11.69-11.69h0ZM14.35,30.02l-5.74-9.94,5.74-9.94h11.47l5.74,9.94-5.74,9.94h-11.47Z"
          />
        </g>
      </svg>
    </motion.div>
  );
}
