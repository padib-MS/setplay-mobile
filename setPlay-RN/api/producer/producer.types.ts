import { ApiGigs } from "../gig/gig.types";

export interface Producer {
  producerId: string | null;
  rating: number;
  gigCards?: { gigCards: ApiGigs[] } | ApiGigs[];
}

export type SearchProducerParams = {
  name?: string;
  genres?: string[];
  bpmRangeMin?: number;
  bpmRangeMax?: number;
  minRating?: number;
  completedGigsMin?: number;
  completedGigsMax?: number;
  location?: string;
};

export type ProducerCard = {
  id: string;
  avatar: string;
  name: string;
  genres: string[];
  rating: number;
  completedGigs: number;
};

export type SearchProducersResponse = {
  producerCards: ProducerCard[];
};
