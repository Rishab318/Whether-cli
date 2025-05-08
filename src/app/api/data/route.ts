import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const accountType = formData.get("accountType") as string | null;
    const tariffCode = formData.get("tariffCode") as string | null;
    const packageCode = formData.get("packageCode") as string | null;
    const referralCode = (formData?.get("referralCode") as string) || "";
    const languageCode = formData?.get("languageCode") as string;
    // Validate required parameters
    if (!accountType || !tariffCode || !packageCode) {
      return NextResponse.json(
        {
          error: "Missing required parameter: accountType, tariffCode, bundle",
        },
        { status: 400 }
      );
    }
    // Generate a unique session token
    const sessionToken = crypto.randomUUID();
    // Store the data in a server-side session
    const sessionData = {
      accountType,
      tariffCode,
      packageCode,
      referralCode,
      languageCode,
      timestamp: Date.now(),
    };
    // Set session cookie
    cookies().set("redirect_session", JSON.stringify(sessionData), {
      httpOnly: true,
      // Only set secure: true if using HTTPS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3000, // 50 minutes
    });

    // Redirect to login page without sensitive data in URL
    // Use a simple absolute path for redirection - this avoids URL constructor issues
    const redirectUrl = process.env.NEXT_BASE_URL;
    console.log("redirectUrl", redirectUrl);
    return NextResponse.redirect(
      new URL("/onlinesales/register", redirectUrl),
      303
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
