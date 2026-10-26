const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('node:http')
const { once } = require('node:events')
const { checkHealth } = require('./check-health.cjs')

test('health check detects failures and rejects an older healthy deployment', async t => {
  let status = 200
  let body = 'ok'
  let version = 'new-commit'
  const server = createServer((req, res) => {
    res.writeHead(req.url === '/health' ? status : 200)
    res.end(req.url === '/health' ? body : version)
  }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  const url = `http://127.0.0.1:${server.address().port}`
  await checkHealth(url, 'new-commit')
  status = 503
  await assert.rejects(checkHealth(url), /Health\/version check failed/)
  status = 200
  body = 'broken'
  await assert.rejects(checkHealth(url), /Health\/version check failed/)
  body = 'ok'
  version = 'old-commit'
  await assert.rejects(checkHealth(url, 'new-commit'), /Health\/version check failed/)
  version = 'new-commit'
  await checkHealth(url, 'new-commit')
})
