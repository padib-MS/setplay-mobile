import { ApiGigs } from "@/api/gig/gig.types";
import {
  fetchUser,
  getProfileCard,
  putNameOrAvatar,
  removeGig,
  savedGigs,
  saveGig,
  setRating,
  updateSocials,
  updateUserRole,
} from "@/api/user/user.api";
import { ProfileCard, SocialLink, User } from "@/api/user/user.types";
import { create } from "zustand";

type UserState = {
  user: User | null;
  profileData: ProfileCard | null;
  savedGigs: ApiGigs[];
  loading: boolean;
  error: string | null;

  fetchUserData: (userId: string) => Promise<void>;
  fetchProfileCard: (userId: string) => Promise<void>;
  fetchSavedGigs: (userId: string) => Promise<void>;
  toggleSaveGig: (
    userId: string,
    gigId: string,
    gig?: ApiGigs,
  ) => Promise<void>;
  isGigSaved: (gigId: string) => boolean;
  setUser: (user: User | null) => void;
  setRole: (role: User["role"]) => void;
  setRating: (
    rating: number,
    role: User["role"],
    userId: string,
    gigId: string,
    note?: string,
  ) => Promise<void>;
  updateSocials: (links: SocialLink) => void;
  setProfileImage: (avatar: string) => void;
  updateProfileInfo: (data: {
    name?: string;
    avatar?: string;
  }) => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profileData: null,
  savedGigs: [],
  loading: false,
  error: null,

  fetchUserData: async (userId) => {
    const user = get().user;
    if (user) return;

    set({ loading: true, error: null });

    try {
      const { data } = await fetchUser(userId);
      set({ user: data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load user data",
        loading: false,
      });
    }
  },

  fetchProfileCard: async (userId) => {
    set({ loading: true, error: null });

    try {
      const { data } = await getProfileCard(userId);
      set({ profileData: data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load user profile",
        loading: false,
      });
    }
  },

  fetchSavedGigs: async (userId) => {
    set({ loading: true, error: null });
    try {
      const gigs = await savedGigs(userId);
      set({ savedGigs: gigs, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load saved gigs",
        loading: false,
      });
    }
  },

  isGigSaved: (gigId) => get().savedGigs.some((g) => g?.id === gigId),

  toggleSaveGig: async (userId, gigId, gig) => {
    if (!gigId || !userId) return;

    const previous = get().savedGigs;
    const isSaved = get().isGigSaved(gigId);

    set({
      savedGigs: isSaved
        ? previous.filter((g) => g?.id !== gigId)
        : gig
          ? [gig, ...previous]
          : previous,
    });

    try {
      if (isSaved) {
        await removeGig(userId, gigId);
      } else {
        await saveGig(userId, gigId);
      }
    } catch (error) {
      set({ savedGigs: previous });
      throw error;
    }
  },

  setUser: (user) => set({ user }),

  setRole: async (role) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, role } });

    try {
      await updateUserRole(role, current.id);
    } catch {
      set({ user: current });
    }
  },

  setRating: async (rating, role, userId, gigId, note) => {
    await setRating(userId, gigId, rating, role, note);
  },

  updateSocials: async (link) => {
    const current = get().user;
    if (!current) return;

    const nextLinks = [...(current.socialLinks ?? [])];
    const idx = nextLinks.findIndex((l) => l.key === link.key);
    if (idx >= 0) nextLinks[idx] = link;
    else nextLinks.push(link);

    const optimistic = { ...current, socialLinks: nextLinks };
    set({ user: optimistic });

    try {
      await updateSocials(current.id, link);
    } catch (error) {
      set({ user: current });
      throw error;
    }
  },

  setProfileImage: async (uri) => {
    await get().updateProfileInfo({ avatar: uri });
  },

  updateProfileInfo: async (data) => {
    const userId = get().user?.id;
    const currentUser = get().user;

    set({ loading: true, error: null });

    try {
      const { data: updatedUser } = await putNameOrAvatar(userId!, data);

      set({
        user: { ...currentUser, ...updatedUser },
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
