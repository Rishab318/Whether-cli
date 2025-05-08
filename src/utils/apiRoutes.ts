import { API_ROUTES_MAP } from "@/Constant/apiRoutes";
import { API_ROUTES } from "@/Constant/apiRoutes/routes";

/**
 * The function `getRouteDetails` takes a route as input and returns details about that route from a
 * predefined map.
 * @param {API_ROUTES} route - route is a parameter representing a specific route in an API.
 * @returns The function `getRouteDetails` returns the details of the provided route from the
 * `API_ROUTES_MAP`.
 */
export const getRouteDetails = (route: API_ROUTES) => {
  return API_ROUTES_MAP[route];
};

