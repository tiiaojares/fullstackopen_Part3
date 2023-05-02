
//tehtävät 3.13 - 3.14


require('dotenv').config()
const express = require('express');
const app = express();
const Person = require('./models/person')

//otetaan tietokantayhteys (Mongo) käyttöön
const mongoose = require('mongoose')

//morgan on yleinen middleware-kirjasto Node.js-ympäristössä, 
//joka mahdollistaa HTTP-pyyntöjen lokitietojen tallentamisen.
const morgan = require('morgan');

//mahdollistaa että frontti voi käyttää backendin dataa
//"npm install cors" backend repositoryssa
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());

// post menetelmää varten tarvitaan json-parser:
app.use(express.json())

// tehtävä 3.7 
// tulostaa konsolille seuraavat tiedot:
// :method :url :status :res[content-length] - :response-time ms
// huom! installoitava "npm install morgan"

//app.use(morgan('tiny'))


// tehtävät 3.8: luodaan oma token

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

morgan.token('info', function(req, res) {
  return JSON.stringify(req.body);
});

// post menetelmää varten tarvitaan json-parser:
app.use(express.json())


//haetaan data tietokannasta:
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
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
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person.findById(request.params.id).then(person => {
    person.deleteOne().then(() => {
      response.status(204).end()
    })
  }) 

})
  

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((!body.name) || (!body.number)) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

/*
  const nameAlreadyExists = name => {
    const names = persons.map(p => p.name)
    const findName = names.find(n => n === name)
    return findName
  }

  
  if (nameAlreadyExists(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }*/

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})