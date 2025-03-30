/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // Enables static export
  basePath: "/smart-fund-management",  // Change this to your repo name
  trailingSlash: true,
};

module.exports = nextConfig;  // ✅ Use CommonJS syntax
