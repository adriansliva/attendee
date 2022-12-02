import { useState } from "react";
import DropdownItem from "./DropdownItem";

function Dropdown(props) {

    const [open, setOpen] = useState(false);

    const onSelect = (option) => {
        setOpen(false);
        props.onChange(option);
    }

    return  <div className="dropdown-center">
                <button className="btn btn-secondary dropdown-toggle rounded-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => setOpen(!open)}>{props.selected ? props.selected : props.defaultLabel}</button>
                {open &&
                    <div className="dropdownItemsQ">
                        <div class="dropdownItemQ" onClick={() => onSelect(null, null)}>-</div>
                        {props.options.map(option => (
                            <DropdownItem key = {option.label} name = {option.label} onClick = {() => onSelect(option)}/>
                        ))}
                    </div>
                }
            </div>
}

export default Dropdown;