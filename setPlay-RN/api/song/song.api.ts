import { api, FetchResponse } from "../client";
import { ApiSong, ApiSongPost } from "./song.types";

export const fetchSongs = async (userId: string): Promise<ApiSong[]> => {
  const { data } = await api.get<FetchResponse<ApiSong[]>>(
    `/api/song/examples/${userId}`,
  );
  return data.data ?? [];
};

export const uploadSong = async (
  userId: string,
  songData: ApiSongPost,
): Promise<ApiSongPost> => {
  const formData = new FormData();

  formData.append("file", {
    uri: songData.uri,
    name: songData.uri.split("/").pop() || "audio.mp3",
    type: "audio/mpeg",
  } as any);

  formData.append("name", songData.name);
  formData.append("genre", songData.genre);
  formData.append("bpm", songData.bpm.toString());
  formData.append("songLength", songData.songLength.toString());

  const { data } = await api.post<FetchResponse<ApiSongPost>>(
    `/api/song/upload/${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
};

export const deleteSong = async (
  songId: string,
  userId: string,
): Promise<void> => {
  const { data } = await api.delete(`/api/song/delete/${userId}/${songId}`);

  return data.data;
};
