import { NextRequest } from "next/server";

const DOTNET_API_URL = process.env.NEXT_API_URL || "http://localhost:5000";

export async function sendAPIRequest(request: NextRequest) {
  try {
    const token = process.env.API_SECRET_KEY;
    if (!token) {
      return { error: "Unauthorized", status: 401 };
    }

    // Check if the request is multipart
    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    let requestData;
    let fileFormData: FormData | null = null;

    if (isMultipart) {
      const formData = await request.formData();
      // Extract proxy metadata
      requestData = {
        url: formData.get("url") as string,
        method: formData.get("method") as string,
        queryParams: JSON.parse(
          (formData.get("queryParams") as string) || "{}"
        ),
        pathParams: JSON.parse((formData.get("pathParams") as string) || "{}"),
        isPublicRoute: formData.get("isPublicRoute") === "true",
        headers: JSON.parse((formData.get("headers") as string) || "{}"),
        isMultipart: true,
      };

      // Create a new FormData for the actual file upload
      fileFormData = new FormData();
      // Copy all entries except proxy metadata
      const proxyMetadataKeys = [
        "url",
        "method",
        "queryParams",
        "pathParams",
        "isPublicRoute",
        "headers",
        "responseType",
      ];
      Array.from(formData.keys()).forEach((key) => {
        if (!proxyMetadataKeys.includes(key)) {
          const value = formData.get(key);
          if (value) {
            fileFormData?.append(key, value);
          }
        }
      });
    } else {
      requestData = await request.json();
    }

    const {
      url,
      method,
      queryParams,
      pathParams,
      isPublicRoute,
      headers,
      responseType,
    } = requestData;

    if (!url) {
      return { error: "Route is required", status: 400 };
    }

    const finalHeaders: Record<string, string> = {
      ...(!isMultipart && { "Content-Type": "application/json" }),
      // ...(isMultipart && { "Content-Type": "multipart/form-data" }),
      ...(!isPublicRoute &&
        token && {
          Authorization: `Api-Key ${token}`,
        }),
      ...headers,
    };

    let tempUrl = url;

    if (pathParams && Object.keys(pathParams).length > 0) {
      Object.keys(pathParams).forEach((key) => {
        tempUrl = tempUrl.replace(`:${key}`, pathParams[key]);
      });
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const finalUrl = `${DOTNET_API_URL}/${tempUrl}${
      queryString ? `?${queryString}` : ""
    }`;

    let body;
    if (isMultipart && fileFormData) {
      body = fileFormData;
    } else if (requestData.requestBody) {
      body = JSON.stringify(requestData.requestBody);
    }

    const response = await fetch(finalUrl, {
      method: method || "GET",
      headers: finalHeaders,
      ...(body && { body }),
    });

    if (response.status === 401) {
      return { error: "Unauthorized", status: 401 };
    }

    // Handle 204 and 304 status codes as NEXT js doesn't handle it automatically
    if (response.status === 204 || response.status === 304) {
      return { data: "success", status: 200, error: null };
    }

    let data: any = null;
    if (responseType === "blob") {
      const blob = await response.blob();
      return { data: blob, status: response.status, error: null };
    } else {
      // Read response as text first
      const textResponse = await response.text();

      // Check if response is empty
      if (!textResponse) {
        return {
          data: response.ok ? "success" : null, // Only return "success" if status is OK
          status: response.status,
        };
      }

      // Try to parse as JSON, fallback to text if not valid JSON
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        data = textResponse; // If response is not valid JSON, return raw text
      }

      return { data, status: response.status, error: null };
    }
  } catch (error: any) {
    console.log("Proxy Error:", error);
    throw error;
  }
}
