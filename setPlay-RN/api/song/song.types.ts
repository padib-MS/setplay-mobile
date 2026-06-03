export type ApiSong = {
  id?: string;
  name: string | null;
  songLength: number;
  bpm?: number;
  uri: string | null;
  genre?: string | null;
  isArchived?: boolean;
  isExample?: boolean;
  createdAt?: string;
};

export type ApiSongPost = {
  name: string;
  songLength: number;
  bpm: number;
  genre: string;
  uri: string;
};
