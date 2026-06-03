import { putOffer } from "@/api/offer/offer.api";
import { fetchProducer, searchProducers } from "@/api/producer/producer.api";
import {
  Producer,
  ProducerCard,
  SearchProducerParams,
} from "@/api/producer/producer.types";
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

type ProducerState = {
  producer: Producer | null;
  producers: ProducerCard[];
  producerId: string | null;
  loading: boolean;
  error: string | null;
  fetchProducerData: (userId: string) => Promise<void>;
  putOffer: (userId: string, gigId: string, songId: string) => Promise<void>;
  findProducers: (filters: SearchProducerParams) => Promise<void>;
};

export const useProducerStore = create<ProducerState>((set, get) => ({
  producer: null,
  producers: [],
  producerId: null,
  loading: false,
  error: null,

  fetchProducerData: async (userId) => {
    set({ loading: true, error: null });

    try {
      const data = await fetchProducer(userId);
      set({ producer: data, producerId: data.producerId, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Producer data",
        loading: false,
      });
    }
  },

  putOffer: async (userId, gigId, songId) => {
    try {
      await putOffer(userId, gigId, songId);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to submit a beat",
      });
    }
  },

  findProducers: async (filters) => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) return;

    set({ loading: true, error: null });
    try {
      const response = await searchProducers(filters, userId);
      set({ producers: response.producerCards, loading: false });
    } catch {
      set({ producers: [], loading: false });
    }
  },
}));
