import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, GET_CURRENT_USER } from '../queries'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [genre, setGenre] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState('')

  const result = useQuery(ALL_BOOKS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      genre: genre
    },
  })

  const currentUser = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 500,
  })

  const filterByGenre = (selectedGenre, rec) => {
    setBooks(books.filter(book => book.genres.some(genre => genre === selectedGenre)))
    if(!rec) {
      setGenre(selectedGenre)
    }
  }

  const clearGenreFilter = () => {
    setBooks(result.data.allBooks)
    setGenre(null)
  }

  useEffect(() => {
    if(props.showRecommendations && favoriteGenre) {
      filterByGenre(favoriteGenre, true)
    } else if(result.data){
      setBooks(result.data.allBooks)
    }
   
  }, [props.showRecommendations, result])

  useEffect(() => {
    setGenres([...new Set(books.map(book => book.genres))].flat())
  }, [books])

  useEffect(() => {
    if(currentUser.data && currentUser.data.me) {
      setFavoriteGenre(currentUser.data.me.favoriteGenre)
    }
  }, [currentUser.data])

  if (!props.show) {
    return null
  }

  return (
    <div>
      {props.showRecommendations
        ? 
          <>
            <h2>recommendations</h2>
            <span>books in your favorite genre <strong>{favoriteGenre}</strong></span>
          </>
        : <h2>books</h2>
      }

      {genre &&
        <>
          <span>in genre <strong>{genre}</strong></span>
          <button onClick={() => clearGenreFilter() }>clear</button>
        </>
      }

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
          {(!genre && !props.showRecommendations) && genres.map(genre => 
            <button onClick={() => filterByGenre(genre)}>{genre}</button>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books