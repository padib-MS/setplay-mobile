import { api, FetchResponse } from "../client";
import {
  Producer,
  SearchProducerParams,
  SearchProducersResponse,
} from "./producer.types";

export const fetchProducer = async (userId: string): Promise<Producer> => {
  const { data } = await api.get<FetchResponse<Producer>>(
    `api/producer/${userId}`,
  );
  return data.data;
};

export const searchProducers = async (
  filters: SearchProducerParams,
  userId: string,
): Promise<SearchProducersResponse> => {
  const { genres, ...rest } = filters;
  const { data } = await api.get<FetchResponse<SearchProducersResponse>>(
    `api/producer/${userId}/cards`,
    {
      params: {
        ...rest,
        ...(genres && { genres: genres.join(",") }),
      },
    },
  );
  return data.data;
};
