import React, { useState } from "react"
import Joi from "joi-browser"
import * as userService from "../services/userService"
import { toast } from "react-toastify"
import auth from "../services/authService"
import { Form } from "./common/____form"

const form = Form()

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

  form.init({ data, errors }, schema, setData, setErrors, doSubmit)

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={form.handleSubmit}>
        {form.renderInput("username", "Username", "email")}
        {form.renderInput("password", "Password", "password")}
        {form.renderInput("name", "Name", "text")}
        {form.renderButton("Register")}
      </form>
    </div>
  )
}

export default Register
