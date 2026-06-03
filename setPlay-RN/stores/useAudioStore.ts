import { deleteSong, fetchSongs, uploadSong } from "@/api/song/song.api";
import { ApiSong, ApiSongPost } from "@/api/song/song.types";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

type AudioState = {
  songs: ApiSong[];
  loading: boolean;
  error: string | null;
  pendingFile: ApiSong | null;
  audioUri: string | null;
  audioName: string | null;
  isPlaying: boolean;
  selectedSongId: string | null;
  selectedSong: ApiSong | null;
  player?: any;
  songDraft?: ApiSongPost | null;

  setIsPlaying: (playing: boolean) => void;
  setAudioUri: (uri: string, name: string) => void;
  setSelectedSong: (song: ApiSong | null) => void;
  pickFile: () => Promise<void>;
  addSong: (song: ApiSongPost, userId: string) => void;
  updateSongDraft: (songData: Partial<ApiSongPost>) => void;
  commitSongDraft: () => void;
  togglePlayPause: (song: ApiSong, player: any) => void;
  removeSong: (id: string, player: any) => void;
  deleteSong: (songId: string, player: any) => void;
  resetSong: (player: any) => void;
  stopPlayback: () => void;

  loadSongs: (userId: string) => Promise<void>;
  setSongs: (songs: ApiSong[]) => void;
};

export const useAudioStore = create<AudioState>((set, get) => ({
  songs: [],
  loading: false,
  error: null,
  pendingFile: null,
  audioUri: null,
  audioName: null,
  isPlaying: false,
  selectedSongId: null,
  selectedSong: null,
  songDraft: null,

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setSongs: (songs) => set({ songs }),

  loadSongs: async (userId) => {
    set({ loading: true, error: null });

    try {
      const fetchedSongs = await fetchSongs(userId);
      set({ songs: fetchedSongs, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load songs",
        loading: false,
      });
    }
  },

  setAudioUri: (uri, name) =>
    set({ audioUri: uri, audioName: name, isPlaying: true }),

  setSelectedSong: (song) =>
    set({
      selectedSong: song,
      selectedSongId: song ? song.id : null,
    }),

  pickFile: async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/mpeg",
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const pickedSong: ApiSong = {
          id: uuid.v4() as string,
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          genre: "",
          songLength: 0,
        };
        set({
          pendingFile: pickedSong,
          audioUri: pickedSong.uri,
          audioName: pickedSong.name,
        });
      }
    } catch {
      set({ error: "Cannot pick audio file" });
    }
  },

  addSong: async (songData, userId) => {
    try {
      await uploadSong(userId, songData);
      await get().loadSongs(userId);
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to add new song",
      });
    }
  },

  updateSongDraft: (songData) => {
    set((state) => ({
      songDraft: { ...(state.songDraft ?? {}), ...songData } as ApiSongPost,
    }));
  },

  commitSongDraft: () => {
    set({ songDraft: null });
  },

  togglePlayPause: (song) => {
    const { audioUri, isPlaying } = get();

    if (audioUri !== song.uri) {
      set({
        audioUri: song.uri,
        selectedSongId: song.id,
        audioName: song.name,
        isPlaying: true,
        selectedSong: song,
      });
    } else {
      set({ isPlaying: !isPlaying, selectedSongId: song.id });
    }
  },

  stopPlayback: () => {
    set({ isPlaying: false, audioUri: null });
  },

  removeSong: (id, player) => {
    const state = get();
    const songToRemove = state.songs.find((s) => s.id === id);
    set({ songs: state.songs.filter((s) => s.id !== id) });

    if (songToRemove && songToRemove.uri === state.audioUri) {
      player.pause();
      set({
        isPlaying: false,
        audioUri: null,
        audioName: null,
        selectedSong: null,
      });
    }
  },

  resetSong: (player) => {
    player.pause();
    set({
      isPlaying: false,
      audioUri: null,
      audioName: null,
      selectedSong: null,
      selectedSongId: null,
    });
  },

  deleteSong: async (songId, player) => {
    const userId = useUserStore.getState().user?.id;
    if (!userId) return;

    try {
      player.pause();
      await deleteSong(songId, userId);
      await get().loadSongs(userId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete song",
      });
    }
  },
}));
