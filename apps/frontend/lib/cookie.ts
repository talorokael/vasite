export const setClientToken = (token: string) => {
  const maxAge = 7 * 24 * 60 * 60; 
  document.cookie = `client_token=${token}; path=/; max-age=${maxAge}; Secure; SameSite=Lax`;
};