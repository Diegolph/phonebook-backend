const assert = require('node:assert/strict')
const { once } = require('node:events')
const { test } = require('node:test')
const createApp = require('../app')

test('exercises 3.1–3.8: routes, validation and request logging', async t => {
  const logs = []
  const app = createApp({ write: line => logs.push(line) })
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  const baseUrl = `http://127.0.0.1:${server.address().port}`
  const post = body => fetch(`${baseUrl}/api/persons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  await t.test('3.1: returns the four initial contacts as JSON', async () => {
    const response = await fetch(`${baseUrl}/api/persons`)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /application\/json/)
    const persons = await response.json()
    assert.equal(persons.length, 4)
    assert.equal(persons[0].name, 'Arto Hellas')
  })

  await t.test('3.2: info contains the current count and request time', async () => {
    const before = Date.now()
    const response = await fetch(`${baseUrl}/info`)
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /info for 4 people/)
    const date = html.match(/<p>([^<]+)<\/p>$/)[1]
    assert.ok(Date.parse(date) >= before - 1000)
    assert.ok(Date.parse(date) <= Date.now())
  })

  await t.test('3.3: existing contact returns 200; missing and invalid IDs return 404', async () => {
    const response = await fetch(`${baseUrl}/api/persons/1`)
    assert.equal(response.status, 200)
    assert.equal((await response.json()).name, 'Arto Hellas')
    for (const id of ['999', 'invalid', '1abc']) {
      const missing = await fetch(`${baseUrl}/api/persons/${id}`)
      assert.equal(missing.status, 404)
      assert.equal((await missing.json()).error, 'person not found')
    }
  })

  let created
  await t.test('3.5: POST creates a contact with a server-generated ID', async () => {
    const response = await post({ name: 'Test Contact', number: '123-456', id: 1 })
    assert.equal(response.status, 201)
    created = await response.json()
    assert.ok(Number.isSafeInteger(created.id))
    assert.ok(created.id > 4)
    assert.equal(created.name, 'Test Contact')
    const persons = await (await fetch(`${baseUrl}/api/persons`)).json()
    assert.equal(persons.length, 5)
    assert.deepEqual(persons.find(person => person.id === created.id), created)
    assert.match(await (await fetch(`${baseUrl}/info`)).text(), /info for 5 people/)
  })

  await t.test('3.6: missing, blank and duplicate values return descriptive errors', async () => {
    for (const body of [{}, { number: '123' }, { name: ' ' }, { name: 123 }]) {
      const response = await post(body)
      assert.equal(response.status, 400)
      assert.equal((await response.json()).error, 'name is required')
    }
    for (const number of [undefined, '', ' ', 123]) {
      const response = await post({ name: 'New Contact', number })
      assert.equal(response.status, 400)
      assert.equal((await response.json()).error, 'number is required')
    }
    const duplicate = await post({ name: 'Arto Hellas', number: '999' })
    assert.equal(duplicate.status, 400)
    assert.equal((await duplicate.json()).error, 'name must be unique')
    assert.equal((await (await fetch(`${baseUrl}/api/persons`)).json()).length, 5)
  })

  await t.test('3.4: deletion returns 204, removes only the target and updates the count', async () => {
    const response = await fetch(`${baseUrl}/api/persons/${created.id}`, { method: 'DELETE' })
    assert.equal(response.status, 204)
    assert.equal(await response.text(), '')
    assert.equal((await fetch(`${baseUrl}/api/persons/${created.id}`)).status, 404)
    assert.equal((await (await fetch(`${baseUrl}/api/persons`)).json()).length, 4)
    assert.match(await (await fetch(`${baseUrl}/info`)).text(), /info for 4 people/)
    const repeated = await fetch(`${baseUrl}/api/persons/${created.id}`, { method: 'DELETE' })
    assert.equal(repeated.status, 204)
  })

  await t.test('unknown routes return 404 JSON', async () => {
    const response = await fetch(`${baseUrl}/unknown`)
    assert.equal(response.status, 404)
    assert.deepEqual(await response.json(), { error: 'unknown endpoint' })
  })

  await t.test('3.7–3.8: Morgan logs tiny fields and includes the POST body', () => {
    assert.ok(logs.some(line => /GET \/api\/persons 200 .* - .* ms/.test(line)))
    assert.ok(logs.some(line => line.includes('POST /api/persons 201')
      && line.includes('Test Contact') && line.includes('123-456')))
  })
})
