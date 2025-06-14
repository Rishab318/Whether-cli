// HTTP status code
export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_RESOURCE_CONFLICT = 409;
export const HTTP_STATUS_EXPIRED = 410;
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_INTERNAL_SERVER_ERROR = 500;

const defaultOptions = {
  method: "GET",
  customHeaders: null,
  queryParams: null,
  useApiGuestClient: false,
};

const apiConfig = {
  posts: {
    ...defaultOptions,
    url: "posts",
    useApiGuestClient: true,
  },
};

export { apiConfig };
