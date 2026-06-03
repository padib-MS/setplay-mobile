import { ApiOffer } from "../offer/offer.types";
import { ApiSong } from "../song/song.types";

export type ApiGigs = {
  dj: {
    id: string;
    name: string;
    rating: number;
    avatar: string;
  };
  isSaved: boolean;
  hasProducerRated: boolean;
  hasDjRated: boolean;
  createdAt: string;
  role: string;
  id: string;
  location: string;
  date: string;
  time: string;
  venue: string;
  bid: number;
  genre?: string;
  backgroundImage?: string;
  songId: string;
  songLengthRange?: [number, number];
  bpmRange?: [number, number];
  producer?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  } | null;
  song?: ApiSong;
  offerOnGig?: ApiOffer;
  offers?: {
    djOffers: ApiOffer[];
  };
  hasVideo?: boolean;
  videoUrl?: string;
};

export type SearchTab = "gigs" | "users";

export type SearchGigsParams = {
  djName?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  genres?: string[];
  minBid?: number;
  maxBid?: number;
  bpmRangeMin?: number;
  bpmRangeMax?: number;
  venue?: string;
  pageNumber?: number;
  pageSize?: number;
  isSearch?: boolean;
  showCompleted?: boolean;
};

export type PaginatedGigsResponse = {
  gigCards: ApiGigs[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
