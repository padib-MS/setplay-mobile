import { useGigStore } from "@/stores/useGigStore";
import { useModeStore } from "@/stores/useModeStore";
import { useUserStore } from "@/stores/useUserStore";
import { useCallback, useMemo } from "react";

export type GigRoute = {
  key: string;
  title: string;
};

export function useGigRoutes() {
  const currentMode = useModeStore((state) => state.currentMode);
  const genres = useGigStore((s) => s.genres);
  const gigsByTab = useGigStore((s) => s.gigsByTab);
  const loadAllGigs = useGigStore((s) => s.loadAllGigs);
  const loadMyGigs = useGigStore((s) => s.loadMyGigs);
  const userRole = useUserStore((state) => state.user?.role);

  const isViewer = currentMode === "viewer";

  const routes: GigRoute[] = useMemo(() => {
    const genreRoutes = genres.map((genre) => ({
      key: genre.toLowerCase().replace(/\s+/g, ""),
      title: genre,
    }));

    if (currentMode === "business") {
      return [{ key: "my", title: "My Gigs" }, ...genreRoutes];
    }
    return [
      { key: "soonest", title: "Soonest" },
      { key: "recent", title: "Recent" },
      ...genreRoutes,
    ];
  }, [currentMode, genres]);

  const handleTabChange = useCallback(
    (routeKey: string) => {
      const key = isViewer ? `viewer_${routeKey}` : routeKey; // ✅
      if (gigsByTab[key] !== undefined) return;

      if (routeKey === "my") {
        loadMyGigs();
        return;
      }

      if (routeKey === "soonest" || routeKey === "recent") {
        loadAllGigs();
        return;
      }

      const genre = genres.find(
        (g) => g.toLowerCase().replace(/\s+/g, "") === routeKey,
      );

      if (genre) {
        loadAllGigs({ genres: [genre] });
      }
    },
    [genres, loadAllGigs, loadMyGigs, gigsByTab, isViewer],
  );

  const getRouteData = useCallback(
    (routeKey: string) => {
      const key = isViewer ? `viewer_${routeKey}` : routeKey;
      const tabGigs = gigsByTab[key] ?? [];

      if (routeKey === "my") return tabGigs;

      const viewerMode = tabGigs.filter((g) => g.offerOnGig);

      if (routeKey === "soonest") {
        const now = new Date();
        return [...viewerMode]
          .filter((gig) => gig.date && new Date(gig.date) >= now)
          .sort(
            (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
          );
      }

      if (routeKey === "recent") {
        return [...viewerMode].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      }

      if (currentMode === "viewer") {
        return viewerMode;
      }
      return tabGigs;
    },
    [gigsByTab, currentMode, isViewer],
  );

  const getEmptyMessage = useCallback(
    (routeKey: string) => {
      if (routeKey === "my") {
        return userRole === "DJ"
          ? "You have no gigs yet. Upload your first gig now!"
          : "No gigs here yet. Submit a beat to get started!";
      }
      if (routeKey === "soonest") return "No upcoming gigs!";
      if (routeKey === "recent") return "No recent gigs!";
      return "No gigs here yet. Check back later!";
    },
    [userRole],
  );

  return {
    routes,
    getRouteData,
    getEmptyMessage,
    currentMode,
    handleTabChange,
  };
}
