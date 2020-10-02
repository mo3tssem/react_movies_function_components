import React, { Component } from "react"
import Joi from "joi-browser"
import Input from "./input"
import Select from "./select"

class Form extends Component {
  state = {
    data: {},
    errors: {},
  }

  validateProperty = (input) => {
    const { name, value } = input
    const obj = { [name]: value }
    const schema = { [name]: this.schema[name] }
    const { error } = Joi.validate(obj, schema)
    return error ? error.details[0].message : null
  }

  validate = () => {
    const options = {
      abortEarly: false,
    }
    const { error } = Joi.validate(this.state.data, this.schema, options)

    if (!error) return null
    const errors = {}
    for (let item of error.details) errors[item.path[0]] = item.message
    return errors
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const errors = this.validate()
    this.setState({ errors: errors || {} }) // never be null
    if (errors) return

    this.doSubmit()
  }

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors }
    const erroMessage = this.validateProperty(input)

    if (erroMessage) errors[input.name] = erroMessage
    else delete errors[input.name]

    const data = { ...this.state.data }
    data[input.name] = input.value
    this.setState({ data, errors })
  }

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    )
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    )
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    )
  }
}
export default Form
