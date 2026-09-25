const assert = require('node:assert/strict')
const { once } = require('node:events')
const { test } = require('node:test')
const createApp = require('../app')

test('CORS allows the development frontend and DELETE preflight', async t => {
  const server = createApp({ write() {} }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const response = await fetch(`${baseUrl}/api/persons`, {
    headers: { Origin: 'http://localhost:5173' }
  })
  assert.equal(response.headers.get('access-control-allow-origin'), '*')
  const preflight = await fetch(`${baseUrl}/api/persons/1`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'DELETE'
    }
  })
  assert.equal(preflight.status, 204)
  assert.match(preflight.headers.get('access-control-allow-methods'), /DELETE/)
})

test('Express serves the compiled React page and its assets alongside the API', async t => {
  const server = createApp({ write() {} }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const response = await fetch(baseUrl)
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /text\/html/)
  const html = await response.text()
  assert.match(html, /id="root"/)
  const scriptUrl = html.match(/src="([^"]+\.js)"/)[1]
  const script = await fetch(`${baseUrl}${scriptUrl}`)
  assert.equal(script.status, 200)
  const bundle = await script.text()
  assert.ok(bundle.includes('/api/persons'))
  assert.ok(!bundle.includes('http://localhost:3001/persons'))
  assert.equal((await fetch(`${baseUrl}/api/persons`)).status, 200)
  assert.equal((await fetch(`${baseUrl}/api/missing`)).status, 404)
})
