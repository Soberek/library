import React from "react";
import { Modal } from "./modal";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  isDirty?: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
  className,
  isDirty,
}) => {
  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "Masz niezapisane zmiany. Czy na pewno chcesz zamknąć formularz?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth={maxWidth}
      className={className}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
