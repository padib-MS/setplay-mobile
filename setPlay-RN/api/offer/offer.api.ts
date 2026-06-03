import { api, ApiErrorResponse } from "../client";

export const putOffer = async (
  userId: string,
  gigId: string,
  songId: string,
) => {
  const { data } = await api.put<ApiErrorResponse>(`/api/offer/${userId}`, {
    gigId,
    songId,
  });
  return data.errors;
};

export const postOffer = async (offerId: string, gigId: string) => {
  const { data } = await api.post<ApiErrorResponse>(
    `/api/offer/accept/${offerId}/${gigId}`,
  );

  return data.errors;
};

export const postAcceptOffer = async (offerId: string, gigId: string) => {
  const { data } = await api.post<ApiErrorResponse>(
    `/api/offer/accept/${offerId}/${gigId}`,
  );

  return data.errors;
};
