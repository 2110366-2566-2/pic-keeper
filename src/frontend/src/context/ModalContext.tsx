"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode, title: string) => void;
  closeModal: () => void;
  content: ReactNode;
  title: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState("");

  const openModal = useCallback((content: ReactNode, title: string) => {
    setContent(content);
    setTitle(title);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    setTitle("");
  }, []);

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, content, title }}
    >
      {children}
    </ModalContext.Provider>
  );
};
