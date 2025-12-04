/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    domains: ['localhost', 'example.com'], // دامنه‌هایی که تصویر از آن‌ها لود می‌شود
  },
};

module.exports = nextConfig;