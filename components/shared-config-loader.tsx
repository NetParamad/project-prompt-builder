"use client";

import * as React from "react";
import { decodeShareConfig } from "@/lib/share/codec";
import { useConfig } from "@/lib/store/useConfig";

/**
 * Applies a `?c=` Share Link on first load, winning over stored state.
 * Invalid payloads are ignored so stored state applies instead.
 */
export function SharedConfigLoader() {
  const applySharedConfig = useConfig((s) => s.applySharedConfig);

  React.useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("c");
    if (!param) return;
    const config = decodeShareConfig(param);
    if (config) applySharedConfig(config);
  }, [applySharedConfig]);

  return null;
}
