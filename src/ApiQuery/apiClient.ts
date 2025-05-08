import axios from "axios";
export default function handler(req: any, res: any) {
  const baseUrl = process.env.NEXT_BASE_URL;
  // Use baseUrl for server-side operations
  res.status(200).json({ message: `API running on ${baseUrl}` });
}
let accessToken: string | null = null;

// const BASE_URL = "https://jsonplaceholder.typicode.com/"; // Change this to your base URL
const BASE_URL = "/api";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
};

const handleResponseError = (error: any) => {
  if (!error || !error.response) {
    const serverError = {
      data: {
        message: "Server error. Please try again later.",
      },
    };
    return Promise.reject(serverError);
  }
  return Promise.reject(error);
};

const ApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: defaultHeaders,
});

// Add token to requests
ApiClient.interceptors.request.use(
  (reqConfig) => {
    if (accessToken == null) {
      accessToken = "Token 1234567890";
    }
    reqConfig.headers.Authorization = `Bearer ${accessToken}`;
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

const ApiGuestClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: defaultHeaders,
});

// Add IP to requests at runtime
const addIpToRequest = async () => {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    const ip = data.ip as string;

    // Add IP to both clients' interceptors
    ApiClient.interceptors.request.use((config) => {
      config.headers.IP = ip;
      return config;
    });

    ApiGuestClient.interceptors.request.use((config) => {
      config.headers.IP = ip;
      return config;
    });

    return ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return "";
  }
};

// Add response error handling
ApiGuestClient.interceptors.response.use(
  (response) => response,
  handleResponseError
);

// Initialize IP for the clients
addIpToRequest();

export { ApiClient, ApiGuestClient, addIpToRequest };
