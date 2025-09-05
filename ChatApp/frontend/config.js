// config.js - automatically pick the right URL depending on the environment.
export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const WEB_SOCKET_URL = import.meta.env.VITE_WS_URL;