
//tehtävä 3.19-3.21


require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');

//otetaan tietokantayhteys (Mongo) käyttöön
const mongoose = require('mongoose');

//morgan on yleinen middleware-kirjasto Node.js-ympäristössä, 
//joka mahdollistaa HTTP-pyyntöjen lokitietojen tallentamisen.
const morgan = require('morgan');

//mahdollistaa että frontti voi käyttää backendin dataa
//"npm install cors" backend repositoryssa
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());

// post menetelmää varten tarvitaan json-parser:
app.use(express.json());


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

morgan.token('info', function(req, res) {
  return JSON.stringify(req.body);
});

// post menetelmää varten tarvitaan json-parser:
app.use(express.json());




//haetaan data tietokannasta:
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const number = persons.length
      const dateTime = new Date()
      console.log("listalla henkilöitä: ", number)

      response.send(
        `<div> 
          <p> Phonebook has info for ${number} people </p>
          ${dateTime}
        </div>`
      )
    })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end() //404 not found
      }
    })
    .catch(error => next(error)) // passataan error eteenpäin Expressille
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person.findById(request.params.id).then(person => {
    person.deleteOne().then(() => {
      response.status(204).end()
    })
  }) 

})
  

app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

//lisätää poikkeuskäsittely Express error handler
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError' ) {
    return response.status(400).json({error: error.message})
  }
  
  next(error)
}
 

app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})