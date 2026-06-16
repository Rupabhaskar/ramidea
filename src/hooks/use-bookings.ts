"use client";

import { useEffect, useState, useRef } from "react";
import type { AdBooking, Advertiser, User } from "@/types";
import {
  subscribeToBookings,
  subscribeToAdvertisers,
  getLiveAdvertiser,
} from "@/services/booking-service";
import { getOrCreateClientAccount } from "@/services/client-account-service";
import { normalizeAdvertiser } from "@/lib/client-account";
import { useAuthStore } from "@/store/auth-store";

export function useBookings() {
  const [bookings, setBookings] = useState<AdBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToBookings((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  return { bookings, loading };
}

export function useAdvertisers() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToAdvertisers((data) => {
      setAdvertisers(data);
      setLoading(false);
    });
  }, []);

  return { advertisers, loading };
}

export function useClientAccount() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [client, setClient] = useState<Advertiser | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const advertiserIdRef = useRef<string | undefined>(user?.advertiserId);

  useEffect(() => {
    if (!user || user.role !== "advertiser") {
      setLoading(false);
      setClient(undefined);
      return;
    }

    let cancelled = false;
    advertiserIdRef.current = user.advertiserId;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const account = await getOrCreateClientAccount(user as User);
        if (cancelled) return;

        if (account) {
          const normalized = normalizeAdvertiser(account);
          advertiserIdRef.current = normalized.id;
          if (user && !user.advertiserId) {
            setUser({ ...user, advertiserId: normalized.id });
          }
          setClient(normalized);
        } else {
          setError("Could not load your client account. Contact your administrator.");
        }
      } catch {
        if (!cancelled) setError("Failed to load client account.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const unsub = subscribeToAdvertisers((advertisers) => {
      const id = advertiserIdRef.current;
      if (!id) return;
      const found = advertisers.find((a) => a.id === id);
      if (found) setClient(normalizeAdvertiser(found));
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [user?.id, user?.email, user?.role, user?.advertiserId, setUser]);

  return { client, loading, error };
}

/** For admin pages that already know the client id */
export function useClientAccountById(advertiserId: string) {
  const [client, setClient] = useState<Advertiser | undefined>(() =>
    getLiveAdvertiser(advertiserId)
  );

  useEffect(() => {
    return subscribeToAdvertisers((advertisers) => {
      setClient(advertisers.find((a) => a.id === advertiserId));
    });
  }, [advertiserId]);

  return client;
}
