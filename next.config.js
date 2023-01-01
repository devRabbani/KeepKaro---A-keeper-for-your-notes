/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/chunks\/images\/.*$/],
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
