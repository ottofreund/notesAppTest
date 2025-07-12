import { useState, useEffect } from 'react'
import Note from './components/Note.jsx'
import axios from 'axios'
import noteService from './services/notes.js'

function postToServerAndLocal(noteObj, notes, setNotes) {
  noteService
    .create(noteObj)
    .then( (response) => {
      console.log(response)
      //post to local component state
      setNotes(notes.concat(response.data))
    })
  
}

const Input = ({newNote, setNewNote, notes, setNotes}) => {
  return (
    <div>
      Add new note: 
      <form>
        <input value = {newNote} onChange = { (e) => {
          setNewNote(e.target.value)
        }} />
        <button onClick = {(e) => {
          e.preventDefault()
          const noteObjNoID = {
              content: newNote,
              important: Math.random() > 0.5
            }
          //update server-side and locally
          const response = postToServerAndLocal(noteObjNoID, notes, setNotes)
          
        }}>submit</button>
      </form>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  useEffect( () => {
    console.log('effect')
    noteService
      .getAll()
      .then(response => {
        console.log('data fetched')
        setNotes(response.data)
      })
  }, [] )

  const toggleImportanceOf = (id) => {
    console.log("importance of", id, "needs to be toggled")
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find( note => note.id === id )
    const updatedNote = {...note, important: !note.important}
    //update server-side
    noteService
      .update(id, updatedNote)
      .then( response => {
        //update locally
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
      .catch( (error) => {
        console.log("Note was already deleted from server")
        //delete from local aswell
        setNotes(notes.filter( note => note.id !== id ))
      })
  }

  return (
    <div>
      <Input newNote={newNote} setNewNote={setNewNote} notes={notes} setNotes={setNotes} />
      <h1>Notes</h1>
      <ul>
        {notes.map( note => 
        <Note key={note.id} content={note.content} important={note.important} toggleImportance={() => { toggleImportanceOf(note.id) }}/>
        )}
      </ul>
    </div>
  )
}

export default App