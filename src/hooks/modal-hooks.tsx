import { create } from "zustand";

interface modalHooksProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const modalHooks = create<modalHooksProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

