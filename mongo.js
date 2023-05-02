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

//määritellään schema, joka kuvaa tietokannan taulujen ja kenttien rakennetta

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// "Model" viittaa sovelluksen sisäiseen käyttöön tarkoitettuun objektiin, 
//joka vastaa tietokannan "scheman" rakennetta 
//ja johon tallennetaan tietokannasta haetut tiedot.

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




