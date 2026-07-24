"use client";

import { useEffect } from "react";
import { hydrateAuthFromStorage } from "@/lib/auth_store";

export default function AuthHydrator() {
  useEffect(() => {
    hydrateAuthFromStorage();
  }, []);

  return null;
}