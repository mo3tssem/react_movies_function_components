import React from "react"
import { faSortUp } from "@fortawesome/free-solid-svg-icons"
import { faSortDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function TableHeader(props) {
  const renderSortIcon = (column) => {
    const { sortColumn } = props
    if (column.path !== sortColumn.path) return null
    if (sortColumn.order === "asc") return <FontAwesomeIcon icon={faSortUp} />

    return <FontAwesomeIcon icon={faSortDown} />
  }

  const raiseSort = (path) => {
    const sortColumn = { ...props.sortColumn }
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc"
    else {
      sortColumn.path = path
      sortColumn.order = "asc"
    }
    props.onSort(sortColumn)
  }

  return (
    <thead>
      <tr>
        {props.columns.map((column) => (
          <th
            style={{ cursor: "pointer" }}
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
