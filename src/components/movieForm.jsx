import React, { useState, useEffect } from "react"
import Joi from "joi-browser"
import { getMovie, saveMovie } from "../services/movieService"
import { getGenres } from "../services/genreService"
import { toast } from "react-toastify"
import { Form } from "./common/____form"

const form = Form()

function MovieForm(props) {
  const [data, setData] = useState({
    title: "",
    genreId: "",
    numberInStock: "",
    dailyRentalRate: "",
  })
  const [genres, setGenres] = useState([])
  const [errors, setErrors] = useState({})

  const schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .min(0)
      .max(100)
      .integer()
      .required()
      .label("Number In Stock"),
    dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
  }

  const populateGenres = async () => {
    const { data: genres } = await getGenres()
    setGenres(genres)
  }
  const populateMovie = async () => {
    try {
      const movieId = props.match.params.id
      if (movieId === "new") return

      const { data: movie } = await getMovie(movieId)

      setData(mapToViewModel(movie))
    } catch (ex) {
      if (ex.response) props.history.replace("/not-found")
    }
  }

  useEffect(() => {
    ;(async function aPopulateGenres() {
      await populateGenres()
    })()
    ;(async function aPopulateMovie() {
      await populateMovie()
    })()
  }, [])

  const mapToViewModel = (movie) => {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    }
  }

  const doSubmit = async () => {
    //To Do do somtheing in shwoing error in the toast ya kbeer call the sever

    try {
      await saveMovie(data)
      toast.success("The movie Saved ")
      props.history.push("/movies")
    } catch (ex) {
      if (ex.response && ex.response.data)
        toast.error("Error in saving " + ex.response.data)
    }
  }

  form.init({ data, errors }, schema, setData, setErrors, doSubmit, setGenres)

  return (
    <div>
      <form onSubmit={form.handleSubmit}>
        {form.renderInput("title", "Title")}
        {form.renderSelect("genreId", "Genre", genres)}
        {form.renderInput("numberInStock", "Number In Stock")}
        {form.renderInput("dailyRentalRate", "Rate")}

        {form.renderButton("Save")}
      </form>
    </div>
  )
}

export default MovieForm
