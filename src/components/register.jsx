import React, { useState } from "react"
import Joi from "joi-browser"
import * as userService from "../services/userService"
import { toast } from "react-toastify"
import auth from "../services/authService"
import Input from "./common/input"
import Select from "./common/select"

function Register() {
  const [data, setData] = useState({ username: "", password: "", name: "" })
  const [errors, setErrors] = useState({})

  const schema = {
    username: Joi.string().required().email().label("Username"),
    password: Joi.string().required().min(5).label("Passowrd"),
    name: Joi.string().required().label("Name"),
  }

  const doSubmit = async () => {
    //call the sever
    try {
      const response = await userService.register(data)

      auth.loginWithJwt(response.headers["x-auth-token"])

      window.location = "/"
    } catch (ex) {
      toast.error("Error in register ")
      const CopyErrors = { ...errors }
      CopyErrors.username = ex.response.data
      setErrors({ errors: CopyErrors })
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
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        {renderInput("username", "Username", "email")}
        {renderInput("password", "Password", "password")}
        {renderInput("name", "Name", "text")}

        {renderButton("Register")}
      </form>
    </div>
  )
}

export default Register
