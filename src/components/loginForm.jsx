import React, { useState } from "react"
import Joi from "joi-browser"
import Input from "./common/input"
import Select from "./common/select"
import auth from "../services/authService"
import { Redirect } from "react-router-dom"
import { toast } from "react-toastify"

function LoginForm(props) {
  const [data, setData] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({})

  const schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().required().label("Passowrd"),
  }

  const doSubmit = async () => {
    try {
      await auth.login(data.username, data.password)

      const { state } = props.location
      window.location = state ? state.from.pathname : "/"
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const Copyerrors = { ...errors }
        Copyerrors.username = ex.response.data
        toast.error("Error in loging " + ex.response.data)
        setErrors({ errors: Copyerrors })
      }
    }
  }

  // Form To DO you need to make some abstraction for these methods
  // apply DRY principle later in the refactorting

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

  const renderInput = (name, label, type = "text") => {
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

  if (auth.getCurrentUser()) return <Redirect to="/" />

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {renderInput("username", "Username")}
        {renderInput("password", "Password", "password")}

        {renderButton("Login")}
      </form>
    </div>
  )
}

export default LoginForm
