//tehtävä 3.1-3.2

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
        </div>`)
    })

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})