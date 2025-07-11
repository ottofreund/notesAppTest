import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
    return axios.get(baseUrl)
}

//returns the created object
const create = (newObject) => {
    return axios.post(baseUrl, newObject)
}

//returns updated object
const update = (id, newObject) => {
    return axios.put(baseUrl + `/${id}`, newObject)
}

export default {
    getAll: getAll,
    create: create,
    update: update
}