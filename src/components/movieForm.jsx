import React, { useState, useEffect } from "react"
import Joi from "joi-browser"
import { getMovie, saveMovie } from "../services/movieService"
import { getGenres } from "../services/genreService"
import Input from "./common/input"
import Select from "./common/select"
import { toast } from "react-toastify"

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

  // Form

  const validateProperty = (input) => {
    const { name, value } = input
    const obj = { [name]: value }
    const aSchema = { [name]: schema[name] }
    const { error } = Joi.validate(obj, aSchema)
    return error ? error.details[0].message : null
  }

  const validate = () => {
    const options = {
      abortEarly: false,
    }

    const { error } = Joi.validate(data, schema, options)
    if (!error) return null
    const CopyErrors = {}
    for (let item of error.details) CopyErrors[item.path[0]] = item.message
    return CopyErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validateErrors = validate()

    setErrors(validateErrors || {})
    if (validateErrors) return

    await doSubmit()
  }

  const handleChange = ({ currentTarget: input }) => {
    const CopyErrors = { ...errors }

    const erroMessage = validateProperty(input)

    if (erroMessage) CopyErrors[input.name] = erroMessage
    else delete CopyErrors[input.name]

    const CopyData = { ...data }
    CopyData[input.name] = input.value
    setErrors(CopyErrors)
    setData(CopyData)
  }

  const renderButton = (label) => {
    return (
      <button disabled={validate()} className="btn btn-primary">
        {label}
      </button>
    )
  }

  const renderInput = (name, label, type) => {
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={handleChange}
        error={errors[name]}
      />
    )
  }

  const renderSelect = (name, label, options) => {
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={handleChange}
        error={errors[name]}
      />
    )
  }

  //End Form

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderInput("title", "Title")}
        {renderSelect("genreId", "Genre", genres)}
        {renderInput("numberInStock", "Number In Stock")}
        {renderInput("dailyRentalRate", "Rate")}

        {renderButton("Save")}
      </form>
    </div>
  )
}

export default MovieForm
