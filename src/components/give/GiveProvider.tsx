"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import GiveModal from "./GiveModal";

const GiveContext = createContext<() => void>(() => {});

// Opens the site-wide Give modal from anywhere (header, cards, etc.)
export const useGive = () => useContext(GiveContext);

export default function GiveProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const showFloating = !pathname.startsWith("/admin");

  return (
    <GiveContext.Provider value={() => setOpen(true)}>
      {children}
      {showFloating && !open && (
        <button className="gc-give-fab" onClick={() => setOpen(true)} aria-label="Give">
          <Heart size={18} strokeWidth={2.5} />
          Give
        </button>
      )}
      {open && <GiveModal onClose={() => setOpen(false)} />}
    </GiveContext.Provider>
  );
}
