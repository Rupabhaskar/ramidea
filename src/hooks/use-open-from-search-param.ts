"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Open a dialog when a URL search param is set, without setState in useEffect. */
export function useOpenFromSearchParam(param: string, match: string, clearHref: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramActive = searchParams.get(param) === match;
  const [prevParamActive, setPrevParamActive] = useState(paramActive);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);

  if (paramActive !== prevParamActive) {
    setPrevParamActive(paramActive);
    if (paramActive) {
      setManualOpen(true);
    }
  }

  useEffect(() => {
    if (paramActive) {
      router.replace(clearHref, { scroll: false });
    }
  }, [paramActive, clearHref, router]);

  const open = manualOpen ?? paramActive;
  const setOpen = (next: boolean) => setManualOpen(next);

  return [open, setOpen] as const;
}
