import { HOST_AUTH } from "@/commons/constants";
import axios from "axios";

const BASE_URL = HOST_AUTH;
const ENDPOINTS = {
  LOGIN: "/users/login",
  REGISTER: "/users/register",
};

interface ErrorResponse {
  status: number;
  error: string;
}

interface AxiosError extends Error {
  response?: {
    data: ErrorResponse;
    status: number;
  };
}

export const login = async (formData: { email: string; password: string }) => {
  const url = BASE_URL + ENDPOINTS.LOGIN;
  try {
    const res = await axios.post(url, formData);
    return { status: "success", data: res.data.data };
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      return { status: "error", data: axiosError.response.data.error };
    } else {
      return { status: "error", data: "Something unkown happened" };
    }
  }
};

export const register = async (formData: {
  email: string;
  password: string;
}) => {
  const url = BASE_URL + ENDPOINTS.REGISTER;
  try {
    const res = await axios.post(url, formData);
    return { status: "success", data: res.data.data };
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      return { status: "error", data: axiosError.response.data.error };
    } else {
      return { status: "error", data: "Something unkown happened" };
    }
  }
};
