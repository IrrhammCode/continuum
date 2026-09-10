import React, { createContext, useContext, useState, useCallback } from "react";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  ual?: string;
  durationMs?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global fallback for calling showToast outside React tree if needed
let globalShowToast: ((toast: Omit<ToastItem, "id">) => void) | null = null;
export const toast = (t: Omit<ToastItem, "id">) => {
  if (globalShowToast) {
    globalShowToast(t);
  } else {
    console.log(`[Toast Fallback] ${t.title}: ${t.message}`);
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const duration = t.durationMs ?? (t.type === "error" ? 6000 : 4500);
      const newItem: ToastItem = { ...t, id, durationMs: duration };

      setToasts((prev) => [...prev.slice(-3), newItem]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  globalShowToast = showToast;

  const handleCopyUal = (id: string, ual: string) => {
    navigator.clipboard.writeText(ual);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="hud-toast-container" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={`hud-toast ${item.type}`}>
            <div className="hud-toast-header">
              <span className={`hud-toast-badge ${item.type}`}>
                <i className="hud-pulse-dot" />
                {item.type === "success"
                  ? "DKG ANCHORED"
                  : item.type === "error"
                  ? "SYSTEM ERROR"
                  : "LIVEPEER AGENT"}
              </span>
              <button
                type="button"
                className="hud-toast-close"
                onClick={() => removeToast(item.id)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>

            <div className="hud-toast-body">
              <h4 className="hud-toast-title">{item.title}</h4>
              <p className="hud-toast-msg">{item.message}</p>

              {item.ual && (
                <div
                  className="hud-toast-ual"
                  onClick={() => handleCopyUal(item.id, item.ual!)}
                  title="Click to copy UAL"
                >
                  <span className="hud-ual-label">
                    {copiedId === item.id ? "✓ COPIED" : "UAL"}
                  </span>
                  <code className="hud-ual-text">{item.ual}</code>
                  <span className="hud-copy-icon">⎘</span>
                </div>
              )}
            </div>

            <div
              className="hud-toast-progress"
              style={{ animationDuration: `${item.durationMs ?? 4500}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: toast };
  }
  return ctx;
};
