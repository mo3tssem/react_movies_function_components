import React, { useEffect, useState } from "react"
import { getMovies, deleteMovie } from "../services/movieService"
import { getGenres } from "../services/genreService"
import Pagination from "./common/pagination"
import { paginate } from "../utils/paginate"
import ListTypes from "./listTypes"

import MoviesTable from "./moviesTable"
import _ from "lodash"
import { Link } from "react-router-dom"
import SearchBox from "../components/common/searchBox"
import { toast } from "react-toastify"

function Movies(props) {
  const [movies, setMovies] = useState([])
  const [pageSize, setPageSize] = useState(4)
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [SearchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" })

  useEffect(() => {
    async function getMoviesAsync() {
      const { data } = await getGenres()
      const genres = [{ name: "All", _id: "" }, ...data]

      const { data: movies } = await getMovies()
      setMovies(movies)
      setGenres(genres)
    }

    getMoviesAsync()
  }, [])

  const handleDelete = async (movie) => {
    const orginalMovies = movies
    const resultMovies = orginalMovies.filter((m) => m._id !== movie._id)

    setMovies(resultMovies)

    try {
      await deleteMovie(movie._id)
      toast.success("Deleted ")
    } catch (ex) {
      toast.error("Error in deleting ")
      setMovies(orginalMovies)
    }
  }
  const handleLike = (movie) => {
    const copyMovies = [...movies]
    const index = movies.indexOf(movie)
    copyMovies[index] = { ...movies[index] }
    copyMovies[index].liked = !movies[index].liked
    setMovies(copyMovies)
  }
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemSelect = (genre) => {
    setSelectedGenre(genre)
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setSelectedGenre(null)
    setCurrentPage(1)
  }

  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn)
  }

  const getPagedData = () => {
    let filtered = movies
    if (SearchQuery)
      filtered = movies.filter((m) =>
        m.title.toLowerCase().startsWith(SearchQuery.toLowerCase())
      )
    else if (selectedGenre && selectedGenre._id)
      filtered = movies.filter((m) => m.genre._id === selectedGenre._id)

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const paginateMovies = paginate(sorted, currentPage, pageSize)

    return { totalCount: filtered.length, data: paginateMovies }
  }

  const { length: count } = movies

  const { user } = props

  //if (count === 0) return <p>There are no movies in the database</p>

  const { totalCount, data } = getPagedData()

  return (
    <div className="row">
      <div className="col-3">
        <ListTypes
          items={genres}
          onItemSelect={handleItemSelect}
          selctedItem={selectedGenre}
        />
      </div>
      <div className="col">
        {user && (
          <Link
            to="/movies/new"
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            New Movie
          </Link>
        )}

        {!count && <p>There are no movies in the database</p>}

        {count && (
          <React.Fragment>
            <p> showing {totalCount} movies in the database</p>

            <SearchBox value={SearchQuery} onChange={handleSearch} />
            <MoviesTable
              sortColumn={sortColumn}
              paginateMovies={data}
              onDelete={handleDelete}
              onLike={handleLike}
              onSort={handleSort}
            />

            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default Movies
