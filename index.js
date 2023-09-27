const express = require('express')
const app = express() // käytetään http:tä parempaa kirjastoa, eli expressiä

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
]

let info = `Phonebook has info for ${persons.length} people <br> 
            ${new Date()}` 

// Haetaan listaus kaikista henkilöistä
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// Haetaan listaus yksittäisistä henkilöistä id:n perusteella
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id) // req.params.id on merkkijono, muutetaan se luvuksi Number:n avulla, jotta se kelpaa find:lle
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person) // jos hlö löytyy, näytetään
    } else {
        res.status(404).end() // muussa tapauksessa error 404 "not found" ja .end ilmoittaa siitä, että pyyntöön tulee vastata ilman dataa
    }
})

// Haetaan sivuston infosivu, info määritelty ylempänä
app.get('/info', (req, res) => {
    res.send(info)
})

// Avataan serveri porttiin 3001
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})