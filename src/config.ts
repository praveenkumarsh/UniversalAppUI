// src/config.ts
export const config = {
  webhookUrl: import.meta.env.VITE_WEBHOOK_BACKEND_URL,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_GOOGLE_REDIRECT_URI}`,
  googleAuthUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`,
};
