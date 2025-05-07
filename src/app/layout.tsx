import NoSsr from "@/utils/NoSsr";
import MainProvider from "./MainProvider";
import "../../src/index.scss";
import { Lexend, Roboto, Montserrat } from "next/font/google";
import { detectLanguage } from "./i18n/server";
import { I18nProvider } from "./i18n/i18n-context";
import SessionWrapper from "@/CommonComponent/SessionWrapper";
import { getServerSession } from "next-auth";
import { authoption } from "./api/auth/[...nextauth]/authOption";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "@/CommonComponent/ErrorBoundry";

const lexend = Lexend({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lng = await detectLanguage();
  const session = await getServerSession(authoption);

  return (
    <I18nProvider language={lng}>
      <html>
        <head>
          <link
            rel="icon"
            href="/assets/images/favicon.png"
            type="image/x-icon"
          />
          <link
            rel="shortcut icon"
            href="/assets/images/favicon.png"
            type="image/x-icon"
          />
          <title>Lobster Mobile • The all-in-English mobile service</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
        </head>
        <body
          suppressHydrationWarning={true}
          className={
            lexend.className || roboto.className || montserrat.className
          }
        >
          <ErrorBoundary>
            <NoSsr>
              <SessionWrapper session={session}>
                <MainProvider>{children}</MainProvider>
                <ToastContainer />
              </SessionWrapper>
            </NoSsr>
          </ErrorBoundary>
        </body>
      </html>
    </I18nProvider>
  );
}
