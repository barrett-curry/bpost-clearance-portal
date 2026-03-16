import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getZonosToken, isPlaceholderToken } from "@/lib/zonos-token";

const ZONOS_API_URL =
  process.env.ZONOS_API_URL || "https://api.zonos.com/graphql";

/** POST - Save a token (validates it with a lightweight GraphQL call) */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string" || token.trim() === "") {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const trimmed = token.trim();

    // Validate with the lightest possible GraphQL call
    const response = await fetch(ZONOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentialToken: trimmed,
      },
      body: JSON.stringify({ query: "{ __typename }" }),
    });

    // 401/403 = bad token
    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 200 = token authenticated (even if query has GraphQL errors, auth worked)
    // 400 = query may not be supported but token format is accepted
    // Either way, save the token
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, trimmed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json({
      connected: true,
      organization: "Zonos",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to validate token: ${message}` },
      { status: 500 }
    );
  }
}

/** GET - Check current token status */
export async function GET() {
  try {
    const token = await getZonosToken();
    const placeholder = isPlaceholderToken(token);

    if (!token || placeholder) {
      return NextResponse.json({
        connected: false,
        source: placeholder ? "placeholder" : "none",
      });
    }

    // Mask token for display: show first 16 chars + last 4
    const masked =
      token.length > 20
        ? token.slice(0, 16) + "..." + token.slice(-4)
        : token.slice(0, 4) + "...";

    // Check which source it came from
    const cookieStore = await cookies();
    const fromCookie = !!cookieStore.get(COOKIE_NAME)?.value;

    return NextResponse.json({
      connected: true,
      source: fromCookie ? "ui" : "env",
      maskedToken: masked,
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      source: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/** DELETE - Disconnect (remove cookie, fall back to env var) */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  return NextResponse.json({ disconnected: true });
}
