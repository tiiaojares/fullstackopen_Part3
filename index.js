//tehtävä 3.3-3.6

const express = require('express')
const app = express()


let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-64231222222"
      }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
  const number = persons.length;
  const dateTime = new Date()
  response.send(
    `<div> 
      <p> Phonebook has info for ${number} people </p>
      ${dateTime}
    </div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.send(
      `<div> 
      <p> name: ${person.name} </p>
      <p> number: ${person.number} </p>
    </div>`
    )
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// post menetelmää varten tarvitaan json-parser:
app.use(express.json())

const generatedId = () => {
  const id = Math.floor(Math.random() * 1000000)
  return id;
}

app.post('/api/persons', ((request, response) => {
  const body = request.body

  if ((!body.name) || (!body.number)) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const nameAlreadyExists = name => {
    const names = persons.map(p => p.name)
    const findName = names.find(n => n === name)
    return findName
  }

  if (nameAlreadyExists(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
}))

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})