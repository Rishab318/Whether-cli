import { sendAPIRequest } from "@/ApiQuery/proxyClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { data, status, error } = await sendAPIRequest(request);
    if (error) {
      return NextResponse.json({ error: error }, { status });
    }

    return NextResponse.json(data, { status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
