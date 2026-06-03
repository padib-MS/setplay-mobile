import { api, ApiErrorResponse, FetchResponse } from "../client";
import { ApiPostGigRequest, DJ } from "./dj.types";

export const fetchDj = async (userId: string): Promise<DJ> => {
  const { data } = await api.get<FetchResponse<DJ>>(`/api/dj/${userId}`);
  return data.data;
};

export const postDjGig = async (id: string, gigData: ApiPostGigRequest) => {
  const { data } = await api.post<ApiErrorResponse>(
    `/api/dj/${id}/gig`,
    gigData,
  );

  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].errorMessage);
  }
};

export const deleteDjGig = async (userId: string, gigId: string) => {
  const { data } = await api.delete<ApiErrorResponse>(
    `/api/dj/${userId}/${gigId}`,
  );

  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].errorMessage);
  }
};
