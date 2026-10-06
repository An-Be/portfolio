import { type ReactNode } from "react";
import Nav from "./Nav";
import PaletteDock from "./PaletteDock";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Nav />
      <main style={{ flex: 1, position: "relative", zIndex: 10 }}>
        {children}
      </main>
      {/* <PaletteDock /> */}
    </div>
  );
}
