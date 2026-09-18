import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiDownload, FiX } from "react-icons/fi";

const DISMISS_KEY = "kotoba:install-dismissed";

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 border-[3px] border-ink bg-paper p-3 panel-shadow sm:inset-x-auto sm:right-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-ink font-display text-paper">
            言
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm tracking-wide text-ink">
              INSTALL KOTOBA
            </p>
            <p className="text-xs text-sumi">
              Add it to your home screen — opens like an app, works offline.
            </p>
          </div>
          <button
            type="button"
            onClick={install}
            aria-label="Install app"
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-gold text-ink transition-colors hover:bg-crimson hover:text-paper"
          >
            <FiDownload size={16} />
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-ink/50 hover:text-ink"
          >
            <FiX size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
