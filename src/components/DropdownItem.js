import React from 'react'

function DropdownItem(props) {
  return (
    <div class="dropdownItemQ" onClick={() => props.onClick()}>{props.name}</div>
  )
}

export default DropdownItem