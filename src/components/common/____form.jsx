import React, { Component } from "react"
import Joi, { schema } from "joi-browser"
import Input from "./input"
import Select from "./select"

export const Form = () => {
  const state = {
    data: "",
    error: {},
  }

  const doSubmit = {}
  const setData = {}
  const setErrors = {}
  const schema = {}
  const setGenres = {}

  const init = (
    state,
    schema,
    setData,
    setErrors,
    doSubmit,
    setGenres = ""
  ) => {
    this.state = state
    this.schema = schema
    this.setData = setData
    this.setErrors = setErrors
    this.doSubmit = doSubmit
    this.setGenres = setGenres
  }

  const validateProperty = (input) => {
    const { name, value } = input
    const obj = { [name]: value }
    const schema = { [name]: this.schema[name] }
    const { error } = Joi.validate(obj, schema)
    return error ? error.details[0].message : null
  }
  const validate = () => {
    const options = {
      abortEarly: false,
    }
    const { error } = Joi.validate(this.state.data, this.schema, options)

    if (!error) return null
    const errors = {}
    for (let item of error.details) errors[item.path[0]] = item.message
    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validate()

    this.state.error = errors || {}
    this.setErrors(this.state.error)
    if (errors) return

    this.doSubmit()
  }

  const handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors }
    const erroMessage = validateProperty(input)

    if (erroMessage) errors[input.name] = erroMessage
    else delete errors[input.name]

    const data = { ...this.state.data }
    data[input.name] = input.value
    this.state.errors = errors
    this.state.data = data
    this.setData(this.state.data)
    this.setErrors(this.state.errors)
  }

  const renderButton = (label) => {
    return (
      <button disabled={validate()} className="btn btn-primary">
        {label}
      </button>
    )
  }

  const renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state

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
    const { data, errors } = this.state

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

  return {
    init: init,
    renderSelect: renderSelect,
    renderInput: renderInput,
    renderButton: renderButton,
    handleChange: handleChange,
    handleSubmit: handleSubmit,
    validate: validate,
    validateProperty: validateProperty,
  }
}
