/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'example.com'], // دامنه‌هایی که تصویر از آن‌ها لود می‌شود
  },
};

module.exports = nextConfig;