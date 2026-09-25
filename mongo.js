const path = require('node:path')

require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true })

const main = async () => {
  const args = process.argv.slice(2)
  if (args.length !== 1 && args.length !== 3) {
    console.error('Usage: node mongo.js <password> ["name" "number"]')
    process.exitCode = 1
    return
  }

  const [password, name, number] = args
  if (!password || (args.length === 3 && (!name.trim() || !number.trim()))) {
    console.error('Password, name and number must not be empty.')
    process.exitCode = 1
    return
  }

  const user = process.env.MONGODB_USER
  const host = process.env.MONGODB_HOST
  if (!user || !host || user === 'YOUR_DATABASE_USER' || host.includes('example')) {
    console.error('Configure MONGODB_USER and MONGODB_HOST in backend/.env. See MONGODB.md.')
    process.exitCode = 1
    return
  }

  const mongoose = require('mongoose')
  const url = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/phonebook?retryWrites=true&w=majority&authSource=admin`
  const personSchema = new mongoose.Schema({ name: String, number: String })
  const Person = mongoose.model('Person', personSchema)

  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 10000 })
    if (args.length === 1) {
      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach(person => console.log(`${person.name} ${person.number}`))
    } else {
      const person = new Person({ name: name.trim(), number: number.trim() })
      await person.save()
      console.log(`added ${person.name} number ${person.number} to phonebook`)
    }
  } catch (error) {
    // Do not print connection strings or credentials from driver errors.
    if (error.code === 18 || error.code === 8000) {
      console.error('MongoDB authentication failed. Check your database user and password.')
    } else {
      console.error('MongoDB operation failed. Check the cluster host, network access and database permissions.')
    }
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

main().catch(() => {
  console.error('The MongoDB program could not finish correctly.')
  process.exitCode = 1
})
