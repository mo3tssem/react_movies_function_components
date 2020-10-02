import Input from "./input"
import Select from "./select"
import Form from "../../components/common/form"
import React from "react"

export function renderButton(label) {
  return (
    <button disabled={Form.validate} className="btn btn-primary">
      {label}
    </button>
  )
}

export function renderInput(name, label, type = "text") {
  console.log("errors", Form)
  return (
    <Input
      type={type}
      name={name}
      // value={Form.data[name]}
      label={label}
      onChange={Form.handleChange}
      //   error={Form.errors[name]}
    />
  )
}

export function renderSelect(name, label, options) {
  return (
    <Select
      name={name}
      value={Form.data[name]}
      label={label}
      options={options}
      onChange={Form.handleChange}
      error={Form.errors[name]}
    />
  )
}

export function test() {
  return " dsdsdsds"
}

export default {
  renderButton,
  renderInput,
  renderSelect,
}
