/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' because this app requires server-side API routes
  // for database operations, authentication, and registration
  basePath: "",
  images: {
    unoptimized: true,
  },
  // Explicitly expose environment variables for server-side rendering
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
  },
};

export default nextConfig;
