import * as motion from "motion/react-client";
import { CSSProperties } from "react";
const transition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut",
  repeatType: "reverse",
} as const;

const svgPath = `M 244 30 L 380 120 L 290 160 L 412 240 L 310 260 L 380 355 L 244 380 L 108 355 L 178 260 L 76 240 L 198 160 L 108 120 Z`;

const box: CSSProperties = {
  width: 40,
  height: 40,
  position: "absolute",
  top: 0,
  left: 0,
  offsetPath: `path("${svgPath}")`,
};

export const Path = () => {
  return (
    <div style={{ position: "relative" }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
        <motion.path
          d={svgPath}
          fill="transparent"
          strokeWidth="12"
          stroke="#4a9df866"
          strokeLinecap="round"
          transition={transition}
          initial={{ pathLength: 0.001 }}
          animate={{ pathLength: 1 }}
        />
      </svg>

      {/* Our moving box will go here */}
      <motion.div
        style={box}
        initial={{ offsetDistance: "0%", scale: 2.5 }}
        animate={{ offsetDistance: "100%", scale: 1 }}
        transition={transition}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40.17 40.17"
          width="40"
          height="40"
          className="text-primary"
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
    </div>
  );
};
