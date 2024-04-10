import Service from "../request";

const { VITE_AUTH_BASE_URL, VITE_CMS_BASE_URL, VITE_TIMEOUT } = import.meta.env;

export const authService = new Service({
  baseURL: VITE_AUTH_BASE_URL,
  timeout: VITE_TIMEOUT
});

export const cmsService = new Service({
  baseURL: VITE_CMS_BASE_URL,
  timeout: VITE_TIMEOUT
});
