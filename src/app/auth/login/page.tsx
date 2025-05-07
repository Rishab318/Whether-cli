"use client";
import PlanDetails from "@/app/(MainBody)/onlinesales/register/PlanDetails";
import MainHeader from "@/CommonComponent/MainHeader";
import Footer from "@/Layout/Footer/Footer";
import { SessionData } from "@/Types/Session.type";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";

export default function UserLogin() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (session) {
      router.push("/onlinesales/register");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch("/api/session");
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        }
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  if (session) return null;

  return (
    <Container fluid className="p-0">
      <Row className="m-0 p-0">
        <Col xs={12} className="p-0">
          <PrimeReactProvider>
            <FluentProvider theme={webLightTheme}>
              <header>
                <MainHeader />
              </header>
              <main className="main">
                {/* <PDetails sessionData={sessionData} /> */}
                <PlanDetails />
              </main>
              <footer className="footer">
                <Footer />
              </footer>
            </FluentProvider>
          </PrimeReactProvider>
        </Col>
      </Row>
    </Container>
  );
}
