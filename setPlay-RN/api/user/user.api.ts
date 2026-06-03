import * as FileSystem from "expo-file-system/legacy";
import { api, ApiErrorResponse, FetchResponse } from "../client";
import { ApiGigs } from "../gig/gig.types";
import { ProfileCard, SocialLink, User } from "./user.types";

export const fetchUser = async (
  userId: string,
): Promise<FetchResponse<User>> => {
  const { data } = await api.get<FetchResponse<User>>(`/api/user/${userId}`);

  return data;
};

export const getProfileCard = async (
  userId: string,
): Promise<FetchResponse<ProfileCard>> => {
  const { data } = await api.get<FetchResponse<ProfileCard>>(
    `/api/user/${userId}/card`,
  );

  return data;
};

export const updateUserRole = async (
  role: User["role"],
  userId: string,
): Promise<FetchResponse<User>> => {
  const { data } = await api.put<FetchResponse<User>>(
    `/api/user/${userId}/role`,
    { role },
  );

  return data;
};

export const saveGig = async (
  userId: string,
  gigId: string,
): Promise<ApiErrorResponse> => {
  const { data } = await api.post(`/api/user/${userId}/save/gig/${gigId}`);

  return data;
};

export const removeGig = async (
  userId: string,
  gigId: string,
): Promise<ApiErrorResponse> => {
  const { data } = await api.delete(`/api/user/${userId}/delete/gig/${gigId}`);

  return data;
};

export const savedGigs = async (userId: string): Promise<ApiGigs[]> => {
  const { data } = await api.get<FetchResponse<{ gigCards: ApiGigs[] }>>(
    `/api/user/${userId}/saved/gigs`,
  );

  return data.data.gigCards;
};

export const setRating = async (
  userId: string,
  gigId: string,
  rating: number,
  role: User["role"],
  note?: string,
): Promise<ApiErrorResponse> => {
  const { data } = await api.post(`/api/user/${userId}/set-rating`, {
    rating,
    role,
    gigId,
    note,
  });

  return data.data;
};

export const updateSocials = async (
  userId: string,
  link: SocialLink,
): Promise<ApiErrorResponse> => {
  const { data } = await api.put(`/api/user/${userId}/socials`, link);

  return data;
};

export const putNameOrAvatar = async (
  userId: string,
  payload: { name?: string; avatar?: string },
): Promise<FetchResponse<User>> => {
  let body = { ...payload };

  const isLocalImage =
    (body.avatar && body.avatar.startsWith("file://")) ||
    body.avatar?.startsWith("content://");

  if (isLocalImage) {
    const base64 = await FileSystem.readAsStringAsync(body.avatar!, {
      encoding: "base64",
    });
    body.avatar = `data:image/jpeg;base64,${base64}`;
  }

  const { data } = await api.patch(
    `/api/user/${userId}/update-profile-info`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return data;
};
