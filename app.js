const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('node:path')

morgan.token('body', request => (
  request.method === 'POST' ? JSON.stringify(request.body) : undefined
))

// Each app gets its own in-memory contacts, also keeping tests independent.
const createApp = (logStream = process.stdout) => {
  const app = express()
  let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]

  app.use(cors())
  app.use(express.json())
  // Morgan's tiny format, extended with the POST body for exercise 3.8.
  app.use(morgan(`${morgan.tiny} :body`, { stream: logStream }))
  app.use(express.static(path.join(__dirname, 'dist')))

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`
    )
  })

  app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))
    if (!person) {
      return response.status(404).json({ error: 'person not found' })
    }
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  const generateId = () => {
    let id
    do {
      id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1
    } while (persons.some(person => person.id === id))
    return id
  }

  app.post('/api/persons', (request, response) => {
    const { name, number } = request.body || {}

    if (typeof name !== 'string' || !name.trim()) {
      return response.status(400).json({ error: 'name is required' })
    }
    if (typeof number !== 'string' || !number.trim()) {
      return response.status(400).json({ error: 'number is required' })
    }
    if (persons.some(person => person.name === name.trim())) {
      return response.status(400).json({ error: 'name must be unique' })
    }

    const person = { id: generateId(), name: name.trim(), number: number.trim() }
    persons = persons.concat(person)
    response.status(201).json(person)
  })

  app.use((request, response) => {
    response.status(404).json({ error: 'unknown endpoint' })
  })

  return app
}

module.exports = createApp
