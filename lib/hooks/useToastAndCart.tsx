"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ToastAndCartContextType {
  cartCount: number;
  addToCart: (itemName: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ToastAndCartContext = createContext<ToastAndCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "freshroute_cart_count_v1";

export function ToastAndCartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCartCount(parseInt(saved, 10) || 0);
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addToCart = (itemName: string) => {
    setCartCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(CART_STORAGE_KEY, next.toString());
      } catch {}
      return next;
    });
    showToast(`✓ Added ${itemName} to your active cart`);
  };

  return (
    <ToastAndCartContext.Provider
      value={{
        cartCount,
        addToCart,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Toast popup */}
      <div
        className={`toast ${toastMessage ? "on" : ""}`}
        role="status"
        aria-live="polite"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#35A66F] inline-block flex-shrink-0" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <span>{toastMessage}</span>
      </div>
    </ToastAndCartContext.Provider>
  );
}

export function useToastAndCart() {
  const context = useContext(ToastAndCartContext);
  if (!context) {
    throw new Error("useToastAndCart must be used within ToastAndCartProvider");
  }
  return context;
}
