/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
  },
}

export default config
