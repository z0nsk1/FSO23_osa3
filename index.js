const express = require('express')
const morgan = require('morgan')
const app = express() // käytetään http:tä parempaa kirjastoa, eli expressiä

// Luodaan morganille uusi tokeni, jolla saadaan http requestin sisältö logattua
morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(express.json())
// logataan http-requestien tiedot, mukana nyt myös itse lisätty tokeni "content"
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

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

// Uuden henkilön lisäys post-metodila
app.post('/api/persons', (req, res) => {
    const body = req.body
    const p = persons.find(person => person.name === body.name) // taulukko henkilö(istä), jolla on sama nimi lisätyn kanssa
    if (!body.name || !body.number) { // jos name tai number -kenttä ovat tyhjiä, annetaan virheilmoitus
        return res.status(400).json({
            error: 'Missing name or number'
        })
    } else if (p) { // jos p ei ole tyhjä, eli löytyi samanniminen henkilö, annetaan virheilmoitus
        return res.status(400).json({ 
            error: 'Name must be unique'
        })
    }
    
    const person = { // Asetetaan uuden henkilön tiedot
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 100), // id random-metodilla (tehtävänanto)
    }

    persons = persons.concat(person) // liitetään uusi henkilö henkilötaulukkoon
    res.json(person) // lähetetään json-vastaus
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// Avataan serveri porttiin 3001
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})