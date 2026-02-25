export const setClientToken = (token: string) => {
  const maxAge = 7 * 24 * 60 * 60; 
  document.cookie = `client_token=${token}; path=/; max-age=${maxAge}; Secure; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};