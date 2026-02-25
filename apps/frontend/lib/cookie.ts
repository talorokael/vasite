export const setClientToken = (token: string) => {
  // 7 days expiry (same as backend session duration)
  const maxAge = 7 * 24 * 60 * 60; // seconds
  document.cookie = `client_token=${token}; path=/; domain=.vercel.app; max-age=${maxAge}; Secure; SameSite=Lax`;
};