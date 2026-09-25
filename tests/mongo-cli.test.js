const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const { test } = require('node:test')

const run = args => spawnSync(process.execPath, [path.join(__dirname, '../mongo.js'), ...args], {
  encoding: 'utf8',
  timeout: 15000,
  env: { ...process.env, MONGODB_USER: 'YOUR_DATABASE_USER', MONGODB_HOST: 'cluster0.example.mongodb.net' }
})

test('mongo CLI rejects incomplete arguments without revealing the password', () => {
  for (const args of [[], ['test-secret', 'Anna']]) {
    const result = run(args)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Usage:/)
    assert.ok(!result.stderr.includes('test-secret'))
  }
})

test('mongo CLI rejects blank contact fields before connecting', () => {
  const result = run(['test-secret', ' ', '123'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /must not be empty/)
})

test('mongo CLI reports missing Atlas configuration without trying placeholder credentials', () => {
  for (const args of [['test-secret'], ['test-secret', 'Anna', '123']]) {
    const result = run(args)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Configure MONGODB_USER/)
    assert.ok(!result.stderr.includes('test-secret'))
  }
})
