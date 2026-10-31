"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface DeliveryLocation {
  locality: string;
  city: string;
  state?: string;
  pincode?: string;
  isDetected?: boolean;
}

interface LocationContextType {
  location: DeliveryLocation | null;
  status: "idle" | "detecting" | "success" | "error";
  errorMsg: string | null;
  detectLocation: () => Promise<boolean>;
  setManualLocation: (loc: DeliveryLocation) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = "freshroute_delivery_loc_v2";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [status, setStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load persisted location from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.locality && parsed?.city) {
          setLocation(parsed);
          setStatus("success");
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const detectLocation = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !navigator?.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser. Please enter your location manually.");
      setStatus("error");
      return false;
    }

    setStatus("detecting");
    setErrorMsg(null);

    return new Promise((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Reverse geocode via OpenStreetMap Nominatim with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000);

            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
              {
                headers: {
                  "Accept": "application/json",
                  "User-Agent": "FreshRoute-AgriMarketplace/1.0",
                },
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (!res.ok) {
              throw new Error("Geocoding service unavailable");
            }

            const data = await res.json();
            const addr = data.address || {};

            // Prioritize local neighbourhood / sub-district
            const locality =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.quarter ||
              addr.city_district ||
              addr.village ||
              addr.town ||
              addr.county ||
              "Central Area";

            // Prioritize municipal city or district
            const city =
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.state_district ||
              addr.county ||
              addr.state ||
              "Metro Region";

            const newLoc: DeliveryLocation = {
              locality,
              city,
              state: addr.state,
              pincode: addr.postcode,
              isDetected: true,
            };

            setLocation(newLoc);
            setStatus("success");
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newLoc));
            } catch {}

            resolve(true);
          } catch {
            // Graceful fallback when reverse geocoding is rate-limited or offline
            const fallbackLoc: DeliveryLocation = {
              locality: "Current Location",
              city: "Detected Region",
              isDetected: true,
            };
            setLocation(fallbackLoc);
            setStatus("success");
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackLoc));
            } catch {}
            resolve(true);
          }
        },
        (err) => {
          let message = "Unable to retrieve location.";
          if (err.code === 1) {
            message = "Location access was denied. You can enter your PIN code or city manually.";
          } else if (err.code === 2) {
            message = "Location information is currently unavailable. Please enter your city manually.";
          } else if (err.code === 3) {
            message = "Location request timed out. Please try again or select from the presets.";
          }
          setErrorMsg(message);
          setStatus("error");
          resolve(false);
        },
        options
      );
    });
  };

  const setManualLocation = (loc: DeliveryLocation) => {
    setLocation(loc);
    setStatus("success");
    setErrorMsg(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {}
  };

  const clearLocation = () => {
    setLocation(null);
    setStatus("idle");
    setErrorMsg(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        status,
        errorMsg,
        detectLocation,
        setManualLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useDeliveryLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useDeliveryLocation must be used within a LocationProvider");
  }
  return context;
}
