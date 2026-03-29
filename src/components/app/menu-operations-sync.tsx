"use client";

import { useEffect } from "react";

import { requestJson } from "@/lib/backend/client";
import {
  useMenuOperationsStore,
  type MenuOperationOverride,
} from "@/store/menu-operations-store";

export function MenuOperationsSync() {
  const hasLoaded = useMenuOperationsStore((state) => state.hasLoaded);
  const isLoading = useMenuOperationsStore((state) => state.isLoading);
  const startLoading = useMenuOperationsStore((state) => state.startLoading);
  const setOperations = useMenuOperationsStore((state) => state.setOperations);
  const markLoaded = useMenuOperationsStore((state) => state.markLoaded);

  useEffect(() => {
    if (hasLoaded || isLoading) {
      return;
    }

    let cancelled = false;
    startLoading();

    void requestJson<MenuOperationOverride[]>("/api/menu/operations", {
      method: "GET",
      cache: "no-store",
    })
      .then((operations) => {
        if (!cancelled) {
          setOperations(operations);
        }
      })
      .catch(() => {
        if (!cancelled) {
          markLoaded();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasLoaded, isLoading, markLoaded, setOperations, startLoading]);

  return null;
}
