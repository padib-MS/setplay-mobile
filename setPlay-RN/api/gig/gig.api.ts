import * as FileSystem from "expo-file-system/legacy";
import { api, FetchResponse } from "../client";
import { PaginatedGigsResponse, SearchGigsParams } from "./gig.types";

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
};

export const fetchAvailableGenres = async (): Promise<string[]> => {
  const { data } = await api.get<{ data: { genres: string[] } }>(
    "/api/gigs/genres",
  );
  return data.data.genres;
};

export const fetchGigsForProducer = async (
  id: string,
  filters: { pageNumber: number; pageSize: number },
): Promise<PaginatedGigsResponse> => {
  const { data } = await api.get<FetchResponse<PaginatedGigsResponse>>(
    `/api/producer/${id}/offer/gigs`,
    {
      params: {
        ...filters,
      },
    },
  );
  return data.data;
};

export const fetchGigsForDj = async (
  id: string,
  filters: { pageNumber: number; pageSize: number },
): Promise<PaginatedGigsResponse> => {
  const { data } = await api.get<FetchResponse<PaginatedGigsResponse>>(
    `/api/dj/${id}/gigs`,
    {
      params: {
        ...filters,
      },
    },
  );
  return data.data;
};

export const fetchAllGigs = async (
  userId: string,
  filters: SearchGigsParams,
): Promise<PaginatedGigsResponse> => {
  const { genres, showCompleted, ...rest } = filters;
  const { data } = await api.get<FetchResponse<PaginatedGigsResponse>>(
    `/api/gigs/${userId}`,
    {
      params: {
        ...rest,
        ...(genres && { genres: genres.join(",") }),
        ...(showCompleted && { showCompleted }),
      },
    },
  );
  return data.data;
};

export const postLiveFootage = async (
  gigId: string,
  userId: string,
  videoFile: any,
) => {
  const formData = new FormData();

  formData.append("videoFile", {
    uri: videoFile.uri,
    name: videoFile.uri.split("/").pop() || "video.mp4",
    type: "video/mp4",
  } as any);

  const { data } = await api.post(
    `/api/gigs/upload/${userId}/${gigId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data.data;
};

export const fetchVideoForGig = async (
  gigId: string,
): Promise<string | null> => {
  const response = await api.get<ArrayBuffer>(`/api/gigs/video/${gigId}`, {
    responseType: "arraybuffer",
  });

  const base64 = arrayBufferToBase64(response.data);

  const fileUri = FileSystem.documentDirectory + `${gigId}.mp4`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
};
