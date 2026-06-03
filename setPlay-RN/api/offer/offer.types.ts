export type ApiOffer = {
  id: string;
  producer: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  song: {
    name: string;
    songLength: number;
    bpm: number;
    uri: string;
    isArchived: boolean;
    createdAt: string;
  };
};
