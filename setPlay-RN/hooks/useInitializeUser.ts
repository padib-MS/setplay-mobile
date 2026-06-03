import { useDjStore } from "@/stores/useDjStore";
import { useGigStore } from "@/stores/useGigStore";
import { useProducerStore } from "@/stores/useProducerStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useRef } from "react";

export function useInitializeUser(userId: string | undefined) {
  const fetchUserData = useUserStore((state) => state.fetchUserData);
  const userRole = useUserStore((state) => state.user?.role);
  const fetchDjData = useDjStore((state) => state.fetchDjData);
  const fetchProducerData = useProducerStore(
    (state) => state.fetchProducerData,
  );
  const loadMyGigs = useGigStore((state) => state.loadMyGigs);
  const loadavailableGenres = useGigStore((s) => s.setAvailableGenres);

  const hasLoadedRef = useRef(false);
  const lastRoleRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (hasLoadedRef.current || !userId) return;
    hasLoadedRef.current = true;

    const load = async () => {
      try {
        await fetchUserData(userId);
        loadavailableGenres();
      } catch {
        hasLoadedRef.current = false;
      }
    };
    load();
  }, [userId, fetchUserData]);

  useEffect(() => {
    if (!userRole || !userId || lastRoleRef.current === userRole) return;
    lastRoleRef.current = userRole;

    const load = async () => {
      if (userRole === "DJ") {
        await fetchDjData(userId);
      } else {
        await fetchProducerData(userId);
      }
      await loadMyGigs();
    };
    load();
  }, [userId, userRole, fetchDjData, fetchProducerData, loadMyGigs]);
}
