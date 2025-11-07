/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    runtime: "nodejs", // 👈 fuerza que Next use el runtime Node.js
  },
}

export default nextConfig
