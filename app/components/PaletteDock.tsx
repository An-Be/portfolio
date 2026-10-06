"use client";
import { useEffect, useState } from "react";
import { PALETTE, initAccent, applyAccent } from "@/app/lib/accent";

export default function PaletteDock() {
  const [active, setActive] = useState<string>(PALETTE[0].hex);

  useEffect(() => {
    const stored = initAccent();
    setActive(stored);
  }, []);

  const handleClick = (hex: string) => {
    applyAccent(hex);
    setActive(hex);
  };

  return (
    <div className="pg-palette" style={{ position: "fixed", zIndex: 50 }}>
      {PALETTE.map(({ label, hex }) => (
        <button
          key={label}
          className="pg-sw"
          style={{
            background: hex,
            outline: active === hex ? "2.5px solid var(--palette-gray-900)" : "none",
            outlineOffset: 2,
          }}
          aria-label={label}
          onClick={() => handleClick(hex)}
        />
      ))}
    </div>
  );
}
