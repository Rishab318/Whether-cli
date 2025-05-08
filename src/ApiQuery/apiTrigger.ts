import { signOut } from "next-auth/react";

import { API_ROUTES } from "@/Constant";
import { getRouteDetails } from "@/utils/apiRoutes";

import { ApiClient, ApiGuestClient } from "./apiClient";

export interface IConfig {
  useApiGuestClient: boolean;
  route: API_ROUTES;
  requestBody?: unknown;
  isMockEnabled?: boolean;
  mockResponse?: unknown;
  mockLoading?: boolean;
  mockError?: boolean;
  mockErrorResponse?: unknown;
  customHeaders?: object | null;
  queryParams?: object;
  pathParams?: object;
  isPublicRoute?: boolean;
  isMultipart?: boolean;
  responseType?: "json" | "blob";
}

/**
 * Triggers an API call with optional mocking capabilities.
 * @param config - Configuration for the API request and mocking behavior.
 * @returns A Promise that resolves with the API response or mock data.
 */
export const apiTrigger = async <T>(config: IConfig): Promise<T> => {
  try {
    const {
      useApiGuestClient,
      route,
      requestBody,
      isMockEnabled,
      mockResponse,
      mockLoading,
      mockError,
      mockErrorResponse,
      queryParams,
      customHeaders,
      pathParams,
      isPublicRoute,
      isMultipart,
      responseType = "json",
    } = config;

    // ApiGuestClient can be used for API that don't need auth
    const axiosClient = useApiGuestClient ? ApiGuestClient : ApiClient;

    if (isMockEnabled) {
      // Simulate loading for mock data
      if (mockLoading) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse as T), 5000);
        });
      }

      // Simulate error for mock data
      if (mockError) {
        if (mockErrorResponse) {
          const error = new Error("Mock error occurred") as Error & {
            response: typeof mockErrorResponse;
          };
          error.response = mockErrorResponse;
          return Promise.reject(error);
        }
        return Promise.reject(new Error("Mock error occurred"));
      }

      // Return a promise that resolves with mock data immediately
      return Promise.resolve(mockResponse as T);
    }

    // Get route details
    const routeDetails = getRouteDetails(route);

    let data;
    if (isMultipart && requestBody instanceof FormData) {
      // For multipart requests, append all data to FormData
      const formData = requestBody as FormData;
      formData.append("url", routeDetails.url);
      formData.append("method", routeDetails.method);
      formData.append("queryParams", JSON.stringify(queryParams || {}));
      formData.append("pathParams", JSON.stringify(pathParams || {}));
      formData.append("isPublicRoute", String(isPublicRoute || false));
      formData.append("headers", JSON.stringify(customHeaders || {}));
      formData.append("responseType", responseType);
      data = formData;
    } else {
      // For regular JSON requests
      data = {
        ...routeDetails,
        requestBody,
        queryParams,
        pathParams,
        headers: { ...(customHeaders || {}) },
        isPublicRoute,
        isMultipart,
        responseType
      };
    }

    // Return the actual query function using axios
    const res = await axiosClient.request<T>({
      url: isPublicRoute ? "/public-proxy" : "/proxy",
      method: "POST",
      headers: {
        ...(isMultipart ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" }),
        ...(customHeaders || {})
      },
      data,
      ...(responseType === "blob" && { responseType: "blob" }),
    });
    return res.data;
  } catch (e: any) {
    console.log("error", e);

    if (e.status === 401) {
      await signOut();
    }
    return Promise.reject(e.response.data.message || e.response.data.error);
  }
};

/**
 * const fetchUserData = async () => {
 *   try {
 *     const data = await apiTrigger<{ name: string; age: number }>({
 *       useApiGuestClient: false,
 *       route: API_ROUTES.GET_PLANS,
 *       isMockEnabled: false,
 *       customHeaders: { Authorization: "Bearer token" },
 *     });
 *     console.log("User Data:", data);
 *   } catch (error) {
 *     console.error("Error fetching user data:", error);
 *   }
 * };
 */
