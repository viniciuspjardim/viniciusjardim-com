/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      new URL('https://oyd5i68yhz.ufs.sh/f/**'),
      new URL('https://images.clerk.dev/**'),
      new URL('https://img.clerk.com/**'),
    ],
  },
}

export default config
