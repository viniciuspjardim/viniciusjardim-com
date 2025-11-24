import './src/env.js'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    qualities: [80, 90],
    remotePatterns: [
      new URL('https://oyd5i68yhz.ufs.sh/f/**'),
      new URL('https://images.clerk.dev/**'),
      new URL('https://img.clerk.com/**'),
    ],
  },
}

export default nextConfig
