import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.baseUrl;

export type FetchResponse<T> = {
  data: T;
  errors: { errorCode: string; errorMessage: string }[] | null;
};

export interface ApiErrorResponse {
  errors: {
    errorCode: string;
    errorMessage: string;
  }[];
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
