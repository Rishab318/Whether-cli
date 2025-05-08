import { withAuth } from "next-auth/middleware";
import { pagesOptions } from "./app/api/auth/[...nextauth]/pages-options";

export default withAuth({
  pages: {
    ...pagesOptions,
  },
});

export const config = {
  // restricted routes
  matcher: [
    // for demo purpose changed the pages to page
    "/page/:path*",
    // Match all API routes except auth, data, session and public-proxy
    "/(api(?!/auth|/data|/session|/public-proxy|/proxy).*)",
  ],
};
