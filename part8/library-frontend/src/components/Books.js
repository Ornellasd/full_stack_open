import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_CURRENT_USER } from '../queries'

const Books = (props) => {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState('')

  const { data: bookData, error: booksError, loading: booksLoading, refetch: booksRefetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre }
  })

  const currentUser = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 500,
  })

  console.log(bookData?.allBooks)

  useEffect(() => {
    setBooks(bookData?.allBooks)
    if(props.showRecommendations) {
      setSelectedGenre(currentUser.data?.me.favoriteGenre)
      booksRefetch({ genre: selectedGenre })
    } else {
      setSelectedGenre('')
    }
  }, [bookData, props.showRecommendations])

  // useEffect(() => {
  //   if(props.showRecommendations) {

  //   }
  // }, [currentUser.data.me])


  // const filterByGenre = (selectedGenreDERP, rec) => {
  //   setBooks(books.filter(book => book.genres.some(genre => genre === selectedGenre)))
  //   if(!rec) {
  //     setSelectedGenre(selectedGenreDERP)
  //   }
  // }

  // const filterByGenre2 = (genre) => {
  //   setSelectedGenre(genre)
  //   booksRefetch({ genre })
  //   console.log(bookData, 'after refetch')
  // }

  // const clearGenreFilter = () => {
  //   setBooks(bookData?.allBooks)
  //   setSelectedGenre('')
  // }

  // useEffect(() => {
  //   if(props.showRecommendations && favoriteGenre) {
  //     // make this use graphql 
  //     // filterByGenre(favoriteGenre, true)
  //     filterByGenre2(favoriteGenre)
  //   } else if(bookData?.allBooks) {
  //     setBooks(bookData?.allBooks)
  //   }
  // }, [props.showRecommendations, bookData])

  // useEffect(() => {
  //   setGenres([...new Set(books.map(book => book.genres))].flat())
  // }, [books])

  // useEffect(() => {
  //   if(currentUser.data && currentUser.data.me) {
  //     setFavoriteGenre(currentUser.data.me.favoriteGenre)
  //   }
  // }, [currentUser.data])

  if (!props.show) {
    return null
  }

  // return <h1>DERP</h1>

  return (
    <div>
      <h1>DEV</h1>
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
          {books?.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
          {(!selectedGenre && !props.showRecommendations) && genres.map(genre =>
            // <button onClick={() => filterByGenre2(genre)}>{genre}</button>
            <button onClick={() => console.log('filterbygenre')}>{genre}</button>
          )}
        </tbody>
      </table>
    </div>
  )

  // return (
  //   <div>
  //     {props.showRecommendations
  //       ? 
  //         <>
  //           <h2>recommendations</h2>
  //           <span>books in your favorite genre <strong>{favoriteGenre}</strong></span>
  //         </>
  //       : <h2>books</h2>
  //     }

  //     {selectedGenre &&
  //       <>
  //         <span>in genre <strong>{selectedGenre}</strong></span>
  //         <button onClick={() => clearGenreFilter() }>clear</button>
  //       </>
  //     }


  //   </div>
  // )
}

export default Books