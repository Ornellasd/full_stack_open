import axios from 'axios'
//const baseUrl = '/api/blogs'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll =  async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (blog) => {
  const updatedBlog = {...blog, likes: blog.likes + 1, user: blog.user.id}
  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog)
  return response.data
}

const deleteBlog =  async id => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, setToken, update, deleteBlog }