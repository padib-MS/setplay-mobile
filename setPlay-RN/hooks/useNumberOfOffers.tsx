import { ApiGigs } from "@/api/gig/gig.types";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import { useMemo } from "react";

export const useNumberOfOffers = (showArchived: boolean) => {
  const gigsByTab = useGigStore((state) => state.gigsByTab);
  const userRole = useUserStore((state) => state.user?.role);

  const allGigs = useMemo(() => {
    const result: ApiGigs[] = [];
    for (const gigs of Object.values(gigsByTab)) {
      result.push(...gigs);
    }
    return result;
  }, [gigsByTab]);

  const filteredList = useMemo(() => {
    if (userRole !== "DJ") return allGigs;

    return allGigs.map((gig) => {
      const offers = gig.offers?.djOffers ?? [];

      const filteredOffers = showArchived
        ? offers
        : offers.filter((offer) => !offer.song.isArchived);

      const sortedOffers = [...filteredOffers].sort((a, b) => {
        const archiveDiff =
          Number(a.song.isArchived) - Number(b.song.isArchived);
        if (archiveDiff !== 0) return archiveDiff;
        return (
          new Date(b.song.createdAt).getTime() -
          new Date(a.song.createdAt).getTime()
        );
      });

      return {
        ...gig,
        offers: { djOffers: sortedOffers },
      };
    });
  }, [allGigs, showArchived, userRole]);

  const getNumberOfOffers = (gigId: string): number => {
    const gig = filteredList.find((g) => g.id === gigId);
    if (!gig) return 0;
    return gig.offers?.djOffers?.length ?? 0;
  };

  return { filteredList, getNumberOfOffers };
};
