import type { SearchGigsParams, SearchTab } from "@/api/gig/gig.types";
import { useGigStore } from "@/stores/useGigStore";
import { useProducerStore } from "@/stores/useProducerStore";

export function useSearch(tab: SearchTab, filters?: SearchGigsParams) {
  const gigsByTab = useGigStore((state) => state.gigsByTab);
  const gigLoading = useGigStore((state) => state.loading);

  const userResults = useProducerStore((state) => state.producers);
  const userLoading = useProducerStore((state) => state.loading);

  const isLoading = tab === "gigs" ? gigLoading : userLoading;

  const tabKey = filters?.genres?.length
    ? filters.genres[0].toLowerCase().replace(/\s+/g, "")
    : "all";

  const gigResults = gigsByTab[tabKey] ?? [];

  return { gigResults, userResults, isLoading };
}
