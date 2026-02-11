"use client";

import { useEffect, useRef } from "react";
import styles from "./SuccessModal.module.css";
import { X } from "lucide-react";
import { PortableText } from "next-sanity";
import { TypedObject } from "@portabletext/types";

interface Props {
  title: string | undefined;
  message: TypedObject | TypedObject[] | undefined;
  close: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({
  title,
  message,
  close,
  isOpen,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle ESC key or backdrop click
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    // "cancel" event fires when user presses Esc
    dialog.addEventListener("cancel", handleCancel);

    // Close on backdrop click
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <X color="black" strokeWidth={3} onClick={onClose} />
      </div>
      <div className={styles.message}>
        {message && <PortableText value={message} />}
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={onClose}
        autoFocus
      >
        {close}
      </button>
    </dialog>
  );
}
