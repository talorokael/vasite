// apps/frontend/lib/auth/server.ts
import { cookies } from "next/headers";
import { User } from "@/types";

export async function getServerSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  console.log("🔍 [server.ts] Cookie present:", !!sessionToken);
  console.log(
    "🔍 [server.ts] Cookie value (first 10 chars):",
    sessionToken?.substring(0, 10),
  );

  if (!sessionToken) {
    console.log("🔍 [server.ts] No session token → returning null");
    return null;
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const url = `${API_URL}/api/auth/me`;
    console.log("🔍 [server.ts] Fetching from:", url);

    const response = await fetch(url, {
      headers: {
        Cookie: `session_token=${sessionToken}`,
      },
      cache: "no-store",
    });

    console.log("🔍 [server.ts] Response status:", response.status);

    if (!response.ok) {
      console.log(
        "🔍 [server.ts] Not OK – response text:",
        await response.text(),
      );
      return null;
    }

    const data = (await response.json()) as { user: User };
    const user = data.user;
    console.log(
      "🔍 [server.ts] User fetched:",
      user?.id,
      user?.email,
      "Role:",
      user?.role,
    );
    return { user };
  } catch (error) {
    console.error("🔍 [server.ts] Fetch error:", error);
    return null;
  }
}
