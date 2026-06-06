import { cookies } from 'next/headers';

export async function fetchWithCookie<T>(endpoint: string): Promise<T> {
  const cookieStore = await cookies();
  let cookieHeader = '';
  cookieStore.getAll().forEach(cookie => {
    cookieHeader += `${cookie.name}=${cookie.value}; `;
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: { Cookie: cookieHeader },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}