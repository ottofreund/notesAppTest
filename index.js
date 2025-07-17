require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
const Note = require('./models/note')

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.get('/api/notes', (request, response) => {
  Note.find({}).then(result => {
    return response.json(result)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id)
      .then( note => {
        if (note) {
          return response.json(note)
        } else {
          return response.status(404).send({error: "No note with such ID"})
        }
      } )
      .catch(error => next(error))
})


app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note
      .findByIdAndDelete(id)
      .then(result => {
        return response.status(204).end()
      })
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body
    console.log(body)

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save()
      .then(savedNote => {
        response.json(savedNote)
      })
      .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  //get new object from request
  const body = req.body
  //update note obj in db
  Note
    .findByIdAndUpdate(id, body)
    .then(result => {
      return res.status(204).end()
    })
    .catch(err => {
      console.log(err)
      return res.status(400).send({error: "no note with such id to update"})
    }) 
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'ID of wrong format'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`) 