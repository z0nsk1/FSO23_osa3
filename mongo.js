const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] // Koodi saa salasanan komentoriviltä ja pääsee process.argv kautta käsiksi siihen
// Tämä koodi ajetaan komennolla 'node monjo.js <salasana>', joten salasana on 3. argumentti, minkä takia on valittu 2. indeksi process.argv:hen. (indeksisointi alkaa 0:sta)

// MongoDB Atlaksen antama url tietokannalle.
const url =
  `mongodb+srv://fullstack:${password}@fso-osa3db.yjcvgzv.mongodb.net/phonebook?retryWrites=true&w=majority&appName=AtlasApp`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Luodaan uusi henkiloskeema, kertoo mongoosella, miten henkilo-olio tulee tallettaa tietokantaan
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Mallinnetaan henkilo
const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
    // Luodaan henkilo-olio komentorivin argumenteilla
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    // Tallennetaan henkilo tietokantaan
    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close() // Suljetaan tietokantayhteys
    })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}