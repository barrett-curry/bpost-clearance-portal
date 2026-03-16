"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface BehindTheScenesContextValue {
  isBehindTheScenes: boolean;
  toggle: () => void;
}

const BehindTheScenesContext = createContext<BehindTheScenesContextValue>({
  isBehindTheScenes: false,
  toggle: () => {},
});

export function BehindTheScenesProvider({ children }: { children: ReactNode }) {
  const [isBehindTheScenes, setIsBehindTheScenes] = useState(false);

  return (
    <BehindTheScenesContext.Provider
      value={{
        isBehindTheScenes,
        toggle: () => setIsBehindTheScenes((prev) => !prev),
      }}
    >
      {children}
    </BehindTheScenesContext.Provider>
  );
}

export function useBehindTheScenes() {
  return useContext(BehindTheScenesContext);
}
