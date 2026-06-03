import { deleteDjGig, fetchDj, postDjGig } from "@/api/dj/dj.api";
import { ApiPostGigRequest, DJ } from "@/api/dj/dj.types";
import { postAcceptOffer } from "@/api/offer/offer.api";
import { create } from "zustand";
import { useGigStore } from "./useGigStore";

type DJState = {
  dj: DJ | null;
  djId: string | null;
  loading: boolean;
  error: string | null;
  fetchDjData: (userId: string) => Promise<void>;
  acceptOffer: (offerId: string, gigId: string) => Promise<void>;
  addGig: (gigData: ApiPostGigRequest) => Promise<void>;
  cancelGig: (gigId: string) => Promise<void>;
};

export const useDjStore = create<DJState>((set, get) => ({
  dj: null,
  djId: null,
  loading: false,
  error: null,

  fetchDjData: async (userId) => {
    set({ loading: true, error: null });

    try {
      const data = await fetchDj(userId);
      set({
        dj: data,
        djId: data.djId ?? null,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch DJ data",
        loading: false,
      });
    }
  },
  addGig: async (gigData) => {
    const state = get();
    if (!state.djId) return;

    set({ error: null });

    try {
      await postDjGig(state.djId, gigData);
      await useGigStore.getState().loadMyGigs();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add gig",
      });
    }
  },

  cancelGig: async (gigId) => {
    const state = get();
    if (!state.djId) return;

    set({ error: null });

    try {
      await deleteDjGig(state.djId, gigId);
      await useGigStore.getState().loadMyGigs();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to cancel gig",
      });
    }
  },

  acceptOffer: async (offerId, gigId) => {
    set({ error: null });

    try {
      await postAcceptOffer(offerId, gigId);
      await useGigStore.getState().loadMyGigs();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to accept offer",
      });
    }
  },
}));
