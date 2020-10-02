import React from "react"
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Like = (props) => {
  let clasess = props.liked ? fasHeart : farHeart
  return (
    <div>
      <FontAwesomeIcon
        style={{ cursor: "pointer" }}
        onClick={props.onClick}
        icon={clasess}
      />
    </div>
  )
}

export default Like
