const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const { v1: uuid } = require('uuid')
require('dotenv').config()

const Author = require('./models/Author')
const Book = require('./models/Book')

console.log('connecting to ', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('conected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      console.log(args, 'arggggs matey')
      // if(args.genre && args.author) {
      //   return books.filter(book => book.author === args.author && book.genres.includes(args.genre))
      // } else if(args.author) {
      //   return books.filter(book => book.author === args.author)
      // } else if(args.genre){
      //   return books.filter(book => book.genres.includes(args.genre))
      // } else {
      //   return books
      // }
      const author = await Author.findOne({ name: args.author })

      if(args.genre && args.author) {
        // return await Book.find({})
        return await Book.find({ author: author._id, genres: { $in: args.genre} })    
      } else if(args.author) {
        return await Book.find({ author: author._id }).populate('author')
      } else if(args.genre) {
        return await Book.find({ genres: { $in: args.genre } })
      } else {
        return await Book.find({})
      }
    },
    allAuthors: async () => await Author.find({}),
  },
  Author: {
    // bookCount: (root) => {
    //   return books.filter(book => book.author === root.name).length
    // }
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      let authorId

      if(!author) {
        const newAuthor = new Author({ name: args.author })
        newAuthor.save()
        authorId = newAuthor._id
      } else {
        authorId = author._id
      }

      const book = new Book({ ...args, author: authorId })
      return book.save()
    },
    // editAuthor: (root, args) => {
    //   const author = authors.find(author => author.name === args.name)
    //   if(!author) {
    //     return null
    //   }
    //   const updatedAuthor = { ...author, born: args.setBornTo }
    //   authors = authors.map(author => author.name === args.name ? updatedAuthor: author)
    //   return updatedAuthor
    // }
    editAuthor: async (root, args) => {
      // const author = await Author.findOne({ name: args.name })
      // ik weet het niet
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})