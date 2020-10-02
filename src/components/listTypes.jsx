import React from "react"

const ListTypes = (props) => {
  const { items, textProprty, valueProperty, onItemSelect, selctedItem } = props

  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          onClick={() => onItemSelect(item)}
          style={{ cursor: "pointer" }}
          key={item[valueProperty]}
          className={
            item === selctedItem ? "list-group-item active" : "list-group-item"
          }
        >
          {item[textProprty]}
        </li>
      ))}
    </ul>
  )
}

ListTypes.defaultProps = {
  textProprty: "name",
  valueProperty: "_id",
}
export default ListTypes
