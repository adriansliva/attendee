import React from 'react'

function DropdownItem(props) {
    return (
        <div className="dropdownItemQ" onClick={() => props.onClick()}>{props.name}</div>
    )
}

export default DropdownItem
