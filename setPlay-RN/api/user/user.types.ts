import { PaginatedGigsResponse } from "../gig/gig.types";

export interface SocialLink {
  key: string;
  platform: string;
  url: string;
}

export type UserRole = "DJ" | "Producer" | "User" | "Guest";

export interface User {
  id: string;
  avatar: string;
  name: string;
  role: UserRole;
  socialLinks?: SocialLink[];
}

export interface ProfileCard {
  id: string;
  avatar: string;
  name: string;
  links?: SocialLink[];
  djRating?: number;
  producerRating?: number;
  djCompletedGigs?: PaginatedGigsResponse;
  producerCompletedGigs?: PaginatedGigsResponse;
}
