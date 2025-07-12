const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const noteObj = notes.find( note => note.id === id )
    if (noteObj) {
        response.json(noteObj)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter( note => note.id !== id )
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.content) {
        return response.status(400).json(
            {
                error: 'content missing'
            }
        )
    } 

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)

    response.json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  //find index of wanted note
  const idx = notes.map(note => note.id).indexOf(id)
  if (idx == -1) { //no note with that index, return bad request
    return res.status(400).send({error: "No note with such index."})
  }
  //get new object from request
  const newNoteObj = req.body
  //insert into array of notes
  notes.splice(idx, 1, newNoteObj)
  return res.send(newNoteObj)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`) 