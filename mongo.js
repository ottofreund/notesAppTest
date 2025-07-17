const mongoose = require('mongoose')

if (process.argv.length < 3) { //password not provided as argument in command
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ottofreund:${password}@testcluster.cdokujo.mongodb.net/noteApp?retryWrites=true&w=majority&appName=TestCluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
}
})

const Note = mongoose.model('Note', noteSchema)

exports.Note = Note