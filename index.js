const express = require('express')
const app = express() // käytetään http:tä parempaa kirjastoa, eli expressiä
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person  = require('./models/person')
const { mongo } = require('mongoose')

// Luodaan morganille uusi tokeni, jolla saadaan http requestin sisältö logattua
morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
// logataan http-requestien tiedot, mukana nyt myös itse lisätty tokeni "content"
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())

/*
// kovakoodattu data sivulle
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
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]*/

// Haetaan listaus kaikista henkilöistä
app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    .catch(error => next(error))
})

// Haetaan listaus yksittäisistä henkilöistä id:n perusteella
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
    })
})

// Uuden henkilön lisäys post-metodila
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    //const p = persons.find(person => person.name === body.name) // taulukko henkilö(istä), jolla on sama nimi lisätyn kanssa
    if (!body.name || !body.number) { // jos name tai number -kenttä ovat tyhjiä, annetaan virheilmoitus
        return res.status(400).json({
            error: 'Missing name or number'
        })
    } /*else if (p) { // jos p ei ole tyhjä, eli löytyi samanniminen henkilö, annetaan virheilmoitus
        return res.status(400).json({ 
            error: 'Name must be unique'
        })
    }*/
    
    const person = new Person({ // Asetetaan uuden henkilön tiedot
        name: body.name,
        number: body.number,
})

    person.save().then(savedPerson => {
        res.json(savedPerson) // lähetetään json-vastaus
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id).then(result => {
        res.status(204).end()
    })
})

// Numeron päivittäminen
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    console.log(error.name)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'Malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT // portti saadaan ympäristömuuttujasta, joka on env-tiedostossa
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})