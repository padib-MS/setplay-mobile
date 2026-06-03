import { ApiGigs } from "../gig/gig.types";

export interface DJ {
  djId: string | null;
  rating: number;
  gigCards?: { gigCards: ApiGigs[] } | ApiGigs[];
}

export type ApiPostGigRequest = {
  location: string;
  date: string;
  eventName: string;
  time: string;
  venue: string;
  bid: number;
  backgroundImage: string;
  songId: string;
  songLengthRange: number[];
  bpmRange: number[];
  genre: string;
};
