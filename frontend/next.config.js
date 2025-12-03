/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // فعال‌سازی App Router (اختیاری اما پیشنهادی)
  },
  images: {
    domains: ['localhost', 'example.com'], // دامنه‌هایی که تصویر از آن‌ها لود می‌شود
  },
  reactStrictMode: true,
};

module.exports = nextConfig;