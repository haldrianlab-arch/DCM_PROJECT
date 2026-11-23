"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Nilai kecil yang diingat di browser (localStorage), misalnya sidebar diciutkan atau grup
 * menu terbuka. Dibaca lewat useSyncExternalStore sehingga server dan render pertama memakai
 * `fallback`, lalu browser memakai nilai tersimpan tanpa setState di dalam effect.
 * Bila storage diblokir (mode privat, pengaturan browser), nilai tetap `fallback`.
 */
const EVENT = "sirama:stored-value";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function useStoredValue(key: string): [string | null, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const setValue = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Storage diblokir: perubahan tidak diingat.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [value, setValue];
}
