// apps/frontend/lib/auth/server.ts
import { cookies } from "next/headers";
import { User } from "@/types";
import { randomUUID } from 'crypto'; 

export async function getServerSession(): Promise<{ user: User } | null> {
  const requestId = randomUUID().slice(0,8); // short ID for traceability
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  console.log(`[${requestId}] [server.ts] Cookie present:`, !!sessionToken);
  // In production, you might want to mask the token; for debugging, partial is fine
  console.log(`[${requestId}] [server.ts] Cookie value (first 10 chars):`, sessionToken?.substring(0, 10));
  console.log(`[${requestId}] [server.ts] Cookie header being sent (first 8 chars):`, sessionToken ? `session_token=${sessionToken.substring(0,8)}...` : '(none)');

  if (!sessionToken) {
    console.log(`[${requestId}] [server.ts] No session token → returning null`);
    return null;
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const url = `${API_URL}/api/auth/me`;
  console.log(`[${requestId}] [server.ts] Fetching from:`, url);

  const start = Date.now();
  try {
    const response = await fetch(url, {
      headers: {
        Cookie: `session_token=${sessionToken}`,
      },
      cache: "no-store",
    });
    const duration = Date.now() - start;

    console.log(`[${requestId}] [server.ts] Response status:`, response.status, `(took ${duration}ms)`);
    console.log(`[${requestId}] [server.ts] Response headers:`, Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log(`[${requestId}] [server.ts] Response body:`, responseText);

    if (!response.ok) {
      console.log(`[${requestId}] [server.ts] Not OK – returning null`);
      return null;
    }

    const data = JSON.parse(responseText) as { user: User };
    const user = data.user;
    console.log(`[${requestId}] [server.ts] User fetched:`, user?.id, user?.email, "Role:", user?.role);
    return { user };
  } catch (error) {
    console.error(`[${requestId}] [server.ts] Fetch error:`, error);
    return null;
  }
}