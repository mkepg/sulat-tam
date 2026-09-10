/**
 * API base URL.
 *
 * Set VITE_API_URL at build time to point at a deployed backend. The fallback
 * targets the Docker Compose stack, so a fresh clone works with no config.
 */
const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export default BASE_URL