// src/contexts/ModalContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

export type ModalType = "addDiscount" | "addCategory" | "addRole";

// Define which page each modal lives on
const modalRoutes: Record<ModalType, string> = {
  addDiscount: "/admin/settings",
  addCategory: "/admin/settings",
  addRole: "/admin/settings",
};

type ModalContextType = {
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const router = useRouter();

  const openModal = useCallback(
    (modal: ModalType) => {
      const path = modalRoutes[modal];
      // Navigate to the correct page first
      router.push(path);
      // Then set the active modal
      setActiveModal(modal);
    },
    [router]
  );

  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
