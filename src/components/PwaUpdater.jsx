import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import toast from "react-hot-toast";

/**
 * Wires up the service worker: silently caches the app for offline use,
 * and nudges the user to refresh when a new version has been deployed.
 * Renders nothing — it just drives toasts.
 */
export default function PwaUpdater() {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      // Check for a new version every 30 min while the tab stays open.
      if (!registration) return;
      setInterval(() => registration.update(), 30 * 60 * 1000);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success("Ready to work offline.", { icon: "📦", id: "pwa-offline" });
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast(
        (t) => (
          <span className="flex items-center gap-3">
            New version available.
            <button
              type="button"
              onClick={() => {
                updateServiceWorker(true);
                toast.dismiss(t.id);
              }}
              className="border-2 border-ink bg-ink px-2 py-1 font-display text-xs tracking-wide text-paper"
            >
              REFRESH
            </button>
          </span>
        ),
        { duration: Infinity, id: "pwa-refresh", icon: "🔄" }
      );
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
