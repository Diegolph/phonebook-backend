const { checkHealth } = require('./check-health.cjs')

async function deploy() {
  const { RENDER_DEPLOY_HOOK_URL, APP_URL, GITHUB_SHA } = process.env
  if (!RENDER_DEPLOY_HOOK_URL || !APP_URL || !GITHUB_SHA) {
    throw new Error('Configure RENDER_DEPLOY_HOOK_URL, APP_URL and GITHUB_SHA')
  }
  const hook = new URL(RENDER_DEPLOY_HOOK_URL)
  if (hook.protocol !== 'https:' || hook.hostname !== 'api.render.com' || !hook.pathname.startsWith('/deploy/')) {
    throw new Error('Invalid Render deploy hook')
  }
  hook.searchParams.set('ref', GITHUB_SHA)
  const response = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`Render rejected the deployment (${response.status})`)
  console.log('Deployment requested; waiting for the tested commit to become healthy.')
  // An old, healthy deployment must not be mistaken for a successful new release.
  await checkHealth(APP_URL, GITHUB_SHA, 90)
  console.log('The tested commit is live and healthy.')
}

deploy().catch(() => {
  // Fetch errors may include the secret URL, so never print the original error.
  console.error('Render deployment failed. Check configuration and Render deployment logs.')
  process.exitCode = 1
})
