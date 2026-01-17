/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' because this app requires server-side API routes
  // for database operations, authentication, and registration
  basePath: "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
