import { cookies } from "next/headers";

const COOKIE_NAME = "zonos_credential_token";

/**
 * Get the Zonos credential token. Priority:
 * 1. Cookie set via the Connect Zonos UI
 * 2. ZONOS_CREDENTIAL_TOKEN env var (fallback)
 */
export async function getZonosToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(COOKIE_NAME)?.value;
    if (cookieToken) return cookieToken;
  } catch {
    // cookies() throws in non-request contexts; fall through to env
  }
  return process.env.ZONOS_CREDENTIAL_TOKEN;
}

export function isPlaceholderToken(token: string | undefined): boolean {
  return (
    !token ||
    token === "" ||
    token.includes("placeholder") ||
    token.includes("example") ||
    token.startsWith("your_")
  );
}

export { COOKIE_NAME };
