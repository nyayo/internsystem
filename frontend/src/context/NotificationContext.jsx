/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext } from "react";
import { toast } from "react-toastify";

const NotificationContext = createContext(null);

function normalizeToastType(type) {
  if (type === "danger") return "error";
  return type ?? "success";
}

export function NotificationProvider({ children }) {
  const showNotification = useCallback((message, type = "success") => {
    const normalizedType = normalizeToastType(type);
    const text = String(message ?? "").trim();
    if (!text) return;

    if (normalizedType === "error") {
      toast.error(text);
      return;
    }
    if (normalizedType === "warning") {
      toast.warn(text);
      return;
    }
    if (normalizedType === "info") {
      toast.info(text);
      return;
    }
    toast.success(text);
  }, []);

  const hideNotification = useCallback(() => toast.dismiss(), []);

  return (
    <NotificationContext.Provider
      value={{ notification: null, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
