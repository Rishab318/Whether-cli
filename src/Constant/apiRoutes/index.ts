import { APIRoute } from "@/Types/ApiRoutes.type";

import { API_ROUTES } from "./routes";

export { API_ROUTES };

// API Routes map
export const API_ROUTES_MAP: Record<API_ROUTES, APIRoute> = {
  [API_ROUTES.GET_PRODUCT_INFO]: new APIRoute(
    "POST",
    "customer/api/getProductInfo/"
  ),
  [API_ROUTES.GET_BUILDINGS]: new APIRoute(
    "GET",
    "wrapper/coverage/buildings/:id"
  ),
  [API_ROUTES.GET_UNITS]: new APIRoute("POST", "wrapper/coverage/units/"),
  [API_ROUTES.GET_POSTAL_CODE]: new APIRoute(
    "GET",
    "customer/api/getPostalCodeDetails"
  ),
  [API_ROUTES.GET_NATIONALITY]: new APIRoute(
    "GET",
    "customer/api/getNationalities/"
  ),
  [API_ROUTES.POST_CHECK_EMAIL]: new APIRoute(
    "POST",
    "customer/api/checkEmail/"
  ),
  [API_ROUTES.POST_ORDER_CARD]: new APIRoute(
    "POST",
    "customer/api/getProductInfo/"
  ),
  [API_ROUTES.POST_OPERATOR_NAME]: new APIRoute(
    "POST",
    "wrapper/operatorDetails"
  ),
  [API_ROUTES.SEARCH_STREET]: new APIRoute("GET", "wrapper/coverage/buildings"),
  [API_ROUTES.POST_USER_REGISTRATION]: new APIRoute(
    "POST",
    "/customer/api/addCustomer/"
  ),
  [API_ROUTES.POST_COMPLETE_SALE]: new APIRoute(
    "POST",
    "/customer/api/completeSale/"
  ),
  [API_ROUTES.POST_COMPLETE_LOGIN_SALE]: new APIRoute(
    "POST",
    "/customer/api/completeLoginSale/"
  ),
  [API_ROUTES.POST_BIGIN]: new APIRoute("POST", "wrapper/bigin/createContact/"),
  [API_ROUTES.LOGIN_USER]: new APIRoute("POST", "/customer/api/loginUser"),
  [API_ROUTES.POST_UPLOAD_DOCUMENT]: new APIRoute(
    "POST",
    "customer/api/uploadDocuments"
  ),
};
