import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "clearance";
const COOKIE_NAME = "site-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.password === PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, PASSWORD, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
