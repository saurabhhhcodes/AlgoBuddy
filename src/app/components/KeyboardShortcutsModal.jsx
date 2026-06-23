"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, X } from "lucide-react";

const SHORTCUT_GROUPS = [
  {
    title: "Global",
    items: [
      { keys: "?", action: "Open this help" },
      { keys: "Ctrl / Cmd + /", action: "Open this help" },
      { keys: "Ctrl / Cmd + K", action: "Open command palette" },
      { keys: "Esc", action: "Close dialogs and panels" },
    ],
  },
  {
    title: "Visualizer",
    items: [
      { keys: "Space", action: "Play / pause" },
      { keys: "R", action: "Reset current visualizer" },
      { keys: "+", action: "Increase speed" },
      { keys: "-", action: "Decrease speed" },
      { keys: "→ / ←", action: "Step forward / backward" },
    ],
  },
];

function ShortcutKey({ children }) {
  return (
    <kbd className="inline-flex items-center rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-surface-600 dark:text-surface-300 shadow-sm">
      {children}
    </kbd>
  );
}

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleOpen = () => openModal();

    const handleKeyDown = (event) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        document.activeElement?.isContentEditable;

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (typing) return;

      const isSlash = event.key === "/" || event.code === "Slash";
      const isQuestion = event.key === "?" || (event.shiftKey && isSlash);

      if (isQuestion || ((event.ctrlKey || event.metaKey) && isSlash)) {
        event.preventDefault();
        openModal();
      }
    };

    window.addEventListener("open-shortcuts-help", handleOpen);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-shortcuts-help", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const previous = body.style.overflow;

    if (isOpen) {
      body.style.overflow = "hidden";
      setTimeout(() => dialogRef.current?.focus(), 0);
    }

    return () => {
      body.style.overflow = previous;
    };
  }, [isOpen]);

  const shortcutGroups = useMemo(() => SHORTCUT_GROUPS, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10020] flex items-start justify-center px-4 pt-[12vh]">
      <button
        aria-label="Close shortcuts help"
        onClick={closeModal}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabIndex={-1}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-neutral-950 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between gap-4 border-b border-surface-200 dark:border-surface-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">
                Keyboard shortcuts
              </h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Quick actions for navigation and the visualizer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label="Close keyboard shortcuts"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 dark:border-surface-700 text-surface-500 hover:text-surface-900 dark:hover:text-white hover:border-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          {shortcutGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-neutral-900/60 p-4"
            >
              <h3 className="text-sm font-bold uppercase tracking-wide text-surface-500 dark:text-surface-400">
                {group.title}
              </h3>

              <div className="mt-3 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.keys}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white dark:bg-neutral-950 border border-surface-200 dark:border-surface-700 px-3 py-2"
                  >
                    <ShortcutKey>{item.keys}</ShortcutKey>
                    <span className="text-sm text-right text-surface-600 dark:text-surface-300">
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
