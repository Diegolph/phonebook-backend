const { setTimeout: delay } = require('node:timers/promises')

async function checkHealth(baseUrl, expectedVersion, attempts = 1, interval = 10000) {
  if (!baseUrl) throw new Error('APP_URL is required')
  const base = new URL(baseUrl)
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('APP_URL must be HTTP(S)')
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const health = await fetch(new URL('/health', base), { signal: AbortSignal.timeout(10000) })
      if (!health.ok || (await health.text()).trim() !== 'ok') throw new Error('Unhealthy response')
      if (expectedVersion) {
        const version = await fetch(new URL('/version', base), { signal: AbortSignal.timeout(10000) })
        if (!version.ok || (await version.text()).trim() !== expectedVersion) {
          throw new Error('The tested commit is not live yet')
        }
      }
      return
    } catch {
      if (attempt === attempts) throw new Error('Health/version check failed')
      await delay(interval)
    }
  }
}

module.exports = { checkHealth }

if (require.main === module) {
  checkHealth(process.env.APP_URL, process.env.EXPECTED_VERSION, 3)
    .then(() => console.log('Health check passed'))
    .catch(error => { console.error(error.message); process.exitCode = 1 })
}
