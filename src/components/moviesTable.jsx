import React from "react"
import Like from "./common/like"
import Table from "./common/table"
import { Link } from "react-router-dom"
import auth from "../services/authService"

function MoviesTable(props) {
  let columns = [
    { key: "number" },
    {
      path: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (m) => <Like onClick={() => props.onLike(m)} liked={m.liked} />,
    },
  ]
  let deleteColumn = {
    key: "delete",
    content: (m) => (
      <button
        onClick={() => props.onDelete(m)}
        key={m._id}
        type="button"
        className="btn btn-danger"
      >
        Delete
      </button>
    ),
  }
  const user = auth.getCurrentUser()
  if (user && user.isAdmin) columns.push(deleteColumn)

  const { paginateMovies, onSort, sortColumn } = props

  return (
    <Table
      columns={columns}
      data={paginateMovies}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  )
}

export default MoviesTable
