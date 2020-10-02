import React, { useState } from "react"
import Joi from "joi-browser"

import auth from "../services/authService"
import { Redirect } from "react-router-dom"
import { toast } from "react-toastify"
import { Form } from "./common/____form"

const form = Form()

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

  form.init({ data, errors }, schema, setData, setErrors, doSubmit)
  if (auth.getCurrentUser()) return <Redirect to="/" />

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={form.handleSubmit}>
        {form.renderInput("username", "Username")}
        {form.renderInput("password", "Password", "password")}

        {form.renderButton("Login")}
      </form>
    </div>
  )
}

export default LoginForm
