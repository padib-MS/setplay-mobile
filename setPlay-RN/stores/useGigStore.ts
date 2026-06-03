import {
  fetchAllGigs,
  fetchAvailableGenres,
  fetchGigsForDj,
  fetchGigsForProducer,
  fetchVideoForGig,
  postLiveFootage,
} from "@/api/gig/gig.api";
import {
  ApiGigs,
  PaginatedGigsResponse,
  SearchGigsParams,
} from "@/api/gig/gig.types";
import { ApiSong } from "@/api/song/song.types";
import { create } from "zustand";
import { useModeStore } from "./useModeStore";
import { useUserStore } from "./useUserStore";

export interface GigDraft {
  location?: string;
  date?: string;
  dateISO?: string;
  time?: string;
  venue?: string;
  bid?: number;
  song?: ApiSong;
  bpmRange?: [number, number];
  songLengthRange?: [number, number];
  genre?: string;
}

type GigState = {
  gigs: ApiGigs[];
  allGigs: ApiGigs[];
  genres: string[];
  gigsByTab: Record<string, ApiGigs[]>;
  paginationByTab: Record<
    string,
    { pageNumber: number; totalPages: number; showCompleted?: boolean }
  >;
  selectedGigId: string | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  gigDraft: Partial<GigDraft> | null;
  hasVideo: boolean;
  selectedGigForShare: ApiGigs | null;
  selectedOfferId: string | null;

  setSelectedGig: (gigId: string | null) => void;
  setSelectedGigForShare: (gig: ApiGigs | null) => void;
  setSelectedOfferId: (offerId: string | null) => void;
  setVideoToGig: () => Promise<string | null>;
  setAvailableGenres: () => Promise<void>;

  loadMyGigs: (pageNumber?: number) => Promise<void>;
  loadAllGigs: (
    filters?: Omit<SearchGigsParams, "pageNumber" | "pageSize">,
    pageNumber?: number,
  ) => Promise<void>;
  loadMoreGigs: (routeKey: string) => void;

  updateGigDraft: (data: Partial<GigDraft>) => void;
  commitGigDraft: () => void;
  setGigSong: (songData: ApiSong) => void;
  addGig: (gig: ApiGigs) => void;
  addVideoToGig: (videoUrl: string) => Promise<boolean>;

  toggleOfferSongArchive: (gigId: string, offerId: string) => void;
};

export const useGigStore = create<GigState>((set, get) => ({
  gigs: [],
  allGigs: [],
  genres: [],
  gigsByTab: {},
  paginationByTab: {},
  selectedGigId: null,
  loading: false,
  loadingMore: false,
  error: null,
  gigDraft: null,
  selectedGigForShare: null,
  selectedOfferId: null,
  hasVideo: false,

  setSelectedGig: (gigId) => set({ selectedGigId: gigId }),
  setSelectedGigForShare: (gig) => set({ selectedGigForShare: gig }),
  setSelectedOfferId: (offerId) => set({ selectedOfferId: offerId }),

  addGig: (gig) => {
    set((state) => {
      const currentPagination = state.paginationByTab["my"];
      return {
        gigsByTab: {
          ...state.gigsByTab,
          my: [gig, ...(state.gigsByTab["my"] ?? [])],
        },
        paginationByTab: {
          ...state.paginationByTab,
          my: currentPagination
            ? {
                ...currentPagination,
                totalPages: currentPagination.totalPages + 1,
              }
            : { pageNumber: 1, totalPages: 1 },
        },
      };
    });
  },

  addVideoToGig: async (videoUrl) => {
    const gigId = get().selectedGigId;
    if (!gigId) return false;

    set({ error: null });

    try {
      await postLiveFootage(gigId, useUserStore.getState().user?.id!, {
        uri: videoUrl,
      });

      set((state) => ({
        gigsByTab: {
          ...state.gigsByTab,
          my:
            state.gigsByTab["my"]?.map((gig) =>
              gig.id === gigId ? { ...gig, hasVideo: true, videoUrl } : gig,
            ) ?? [],
        },
      }));

      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to upload video",
      });
      return false;
    }
  },

  setVideoToGig: async () => {
    const gigId = get().selectedGigId;
    if (!gigId) return null;

    try {
      const localVideoUri = await fetchVideoForGig(gigId);
      if (!localVideoUri) throw new Error("Video download failed");

      set((state) => ({
        gigsByTab: Object.fromEntries(
          Object.entries(state.gigsByTab).map(([tab, gigs]) => [
            tab,
            gigs.map((gig) =>
              gig.id === gigId
                ? { ...gig, hasVideo: true, videoUrl: localVideoUri }
                : gig,
            ),
          ]),
        ),
      }));

      return localVideoUri;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load video",
      });
      return null;
    }
  },

  setAvailableGenres: async () => {
    set({ error: null });
    try {
      const existedGenres = await fetchAvailableGenres();
      set({ genres: existedGenres });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load genres",
      });
    }
  },

  loadAllGigs: async (filters = {}, pageNumber = 1) => {
    const userId = useUserStore.getState().user?.id;
    const currentMode = useModeStore.getState().currentMode;
    if (!userId) return;
    set({ loading: true, error: null });

    const isViewer = currentMode === "viewer";
    const modePrefix = isViewer ? "viewer_" : "";
    const showCompleted = filters.showCompleted ?? isViewer;

    try {
      const result = await fetchAllGigs(userId, {
        ...filters,
        pageNumber,
        pageSize: 3,
        showCompleted,
      });

      const tabKey = filters.genres?.length
        ? modePrefix + filters.genres[0].toLowerCase().replace(/\s+/g, "")
        : modePrefix + "all";

      const isAllGigs = !filters.genres?.length;

      set((state) => ({
        gigsByTab: {
          ...state.gigsByTab,
          [tabKey]:
            pageNumber === 1
              ? result.gigCards
              : [...(state.gigsByTab[tabKey] ?? []), ...result.gigCards],
          ...(isAllGigs && {
            [modePrefix + "soonest"]:
              pageNumber === 1
                ? result.gigCards
                : [
                    ...(state.gigsByTab[modePrefix + "soonest"] ?? []),
                    ...result.gigCards,
                  ],
            [modePrefix + "recent"]:
              pageNumber === 1
                ? result.gigCards
                : [
                    ...(state.gigsByTab[modePrefix + "recent"] ?? []),
                    ...result.gigCards,
                  ],
          }),
        },
        paginationByTab: {
          ...state.paginationByTab,
          [tabKey]: {
            pageNumber: result.pageNumber,
            totalPages: result.totalPages,
            showCompleted,
          },
          ...(isAllGigs && {
            [modePrefix + "soonest"]: {
              pageNumber: result.pageNumber,
              totalPages: result.totalPages,
              showCompleted,
            },
            [modePrefix + "recent"]: {
              pageNumber: result.pageNumber,
              totalPages: result.totalPages,
              showCompleted,
            },
          }),
        },
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load gigs",
      });
    }
  },

  loadMyGigs: async () => {
    const userId = useUserStore.getState().user?.id;
    const role = useUserStore.getState().user?.role;

    if (!userId) {
      set({ loading: false, error: "No user logged in" });
      return;
    }

    set({ loading: true, loadingMore: false, error: null });

    try {
      let result: PaginatedGigsResponse;

      if (role === "DJ") {
        result = await fetchGigsForDj(userId, { pageNumber: 1, pageSize: 3 });
      } else if (role === "Producer") {
        result = await fetchGigsForProducer(userId, {
          pageNumber: 1,
          pageSize: 3,
        });
      } else {
        set({ loading: false });
        return;
      }

      set((state) => ({
        gigsByTab: { ...state.gigsByTab, my: result.gigCards },
        paginationByTab: {
          ...state.paginationByTab,
          my: { pageNumber: result.pageNumber, totalPages: result.totalPages },
        },
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load gigs",
      });
    }
  },

  loadMoreGigs: async (routeKey) => {
    const { paginationByTab, loading, loadingMore } = get();
    const userId = useUserStore.getState().user?.id;
    const role = useUserStore.getState().user?.role;

    if (loading || loadingMore || !userId) return;

    const pagination = paginationByTab[routeKey];
    const nextPage = pagination ? pagination.pageNumber + 1 : 1;

    set({ loadingMore: true, error: null });

    try {
      let result: PaginatedGigsResponse;

      if (routeKey === "my") {
        if (role === "DJ") {
          result = await fetchGigsForDj(userId, {
            pageNumber: nextPage,
            pageSize: 3,
          });
        } else if (role === "Producer") {
          result = await fetchGigsForProducer(userId, {
            pageNumber: nextPage,
            pageSize: 3,
          });
        } else return;
      } else {
        const genre =
          routeKey === "soonest" || routeKey === "recent"
            ? undefined
            : routeKey;
        result = await fetchAllGigs(userId, {
          ...(genre && { genres: [genre] }),
          pageNumber: nextPage,
          pageSize: 3,
          showCompleted: pagination?.showCompleted,
        });
      }

      if (result.gigCards.length === 0) {
        set({ loadingMore: false });
        return;
      }

      set((state) => ({
        gigsByTab: {
          ...state.gigsByTab,
          [routeKey]: [
            ...(state.gigsByTab[routeKey] ?? []),
            ...result.gigCards,
          ],
          ...(routeKey === "soonest" && {
            recent: [...(state.gigsByTab["recent"] ?? []), ...result.gigCards],
          }),
          ...(routeKey === "recent" && {
            soonest: [
              ...(state.gigsByTab["soonest"] ?? []),
              ...result.gigCards,
            ],
          }),
        },
        paginationByTab: {
          ...state.paginationByTab,
          [routeKey]: {
            pageNumber: result.pageNumber,
            totalPages: result.totalPages,
          },
          ...(routeKey === "soonest" && {
            recent: {
              pageNumber: result.pageNumber,
              totalPages: result.totalPages,
            },
          }),
          ...(routeKey === "recent" && {
            soonest: {
              pageNumber: result.pageNumber,
              totalPages: result.totalPages,
            },
          }),
        },
        loadingMore: false,
      }));
    } catch (error) {
      set({
        loadingMore: false,
        error: error instanceof Error ? error.message : "Failed to load gigs",
      });
    }
  },

  updateGigDraft: (data) =>
    set((state) => ({ gigDraft: { ...(state.gigDraft ?? {}), ...data } })),

  commitGigDraft: () => set({ gigDraft: null }),

  setGigSong: (songData) => {
    const gigId = get().selectedGigId;
    if (!gigId) return;

    set((state) => ({
      gigsByTab: {
        ...state.gigsByTab,
        my:
          state.gigsByTab["my"]?.map((gig) =>
            gig.id === gigId ? { ...gig, song: songData } : gig,
          ) ?? [],
      },
    }));
  },

  toggleOfferSongArchive: (gigId, offerId) =>
    set((state) => ({
      gigsByTab: {
        ...state.gigsByTab,
        my:
          state.gigsByTab["my"]?.map((gig) => {
            if (gig.id !== gigId) return gig;
            return {
              ...gig,
              offers: {
                ...gig.offers,
                djOffers:
                  gig.offers?.djOffers.map((offer) =>
                    offer.id === offerId
                      ? {
                          ...offer,
                          song: {
                            ...offer.song,
                            isArchived: !offer.song.isArchived,
                          },
                        }
                      : offer,
                  ) ?? [],
              },
            };
          }) ?? [],
      },
    })),
}));
