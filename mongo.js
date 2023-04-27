// tehtävä 3.12

const mongoose = require('mongoose')

if (process.argv.length <3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://tiia:${password}@fullstackopen.ghmzkst.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


// tulostetaa lisätyn henkilön tiedot konsolille TAI
// listan kaikista henkilöistä, jos ei uutta lisätä:

const argsLength = process.argv.length
if (argsLength > 3) {
    const args = process.argv.slice(2)
    const name = args[1]
    const number = args[2]
    const person = new Person ({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })

} else {
    console.log("args length: ", argsLength)
    console.log('Phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}




