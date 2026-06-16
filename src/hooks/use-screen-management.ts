"use client";

import { useEffect, useState } from "react";
import type { Screen, ScreenGroup, Zone } from "@/types";
import {
  subscribeToScreens,
  subscribeToZones,
  subscribeToScreenGroups,
  getScreenManagementSummary,
} from "@/services/screen-management-service";

export function useScreens() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToScreens((data) => {
      setScreens(data);
      setLoading(false);
    });
  }, []);

  return { screens, loading };
}

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToZones((data) => {
      setZones(data);
      setLoading(false);
    });
  }, []);

  return { zones, loading };
}

export function useScreenGroups() {
  const [groups, setGroups] = useState<ScreenGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToScreenGroups((data) => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  return { groups, loading };
}

export function useScreenSummary() {
  const { screens } = useScreens();
  const { zones } = useZones();
  const { groups } = useScreenGroups();

  return {
    ...getScreenManagementSummary(),
    screens,
    zones,
    groups,
  };
}
