const SERVER_URLS = {
  localhost: "http://localhost:8000/",
  common: "http://127.0.0.1:8000/",
  backShop: "http://192.168.1.207:8000/",
};

export const SERVER =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000/";
