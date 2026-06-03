import { create } from "zustand";

type ModeType = "business" | "viewer";

interface ModeState {
  currentMode: ModeType;
  toggleMode: () => void;
}

export const useModeStore = create<ModeState>((set) => ({
  currentMode: "business",
  toggleMode: () =>
    set((state) => ({
      currentMode: state.currentMode === "business" ? "viewer" : "business",
    })),
}));
