import {useState} from "react";
import DropdownItem from "./DropdownItem";

function Dropdown(props) {

    const [open, setOpen] = useState(false);

    const onSelect = (option) => {
        setOpen(false);
        props.onChange(option);
    }

    return <div className="dropdown-center">
        <div className="small-dropdown">
            <button
                className={props.time ? "btn btn-outline-primary dropdown-toggle rounded-0" : "btn btn-secondary dropdown-toggle rounded-0"}
                type="button"
                style={{width: "100%"}}
                onClick={() => setOpen(!open)}>{props.selected ? props.defaultLabel + ": " + props.selected : props.defaultLabel}</button>
        </div>
        <div className="normal-dropdown">
            <button
                className={props.time ? "btn btn-outline-primary dropdown-toggle rounded-0" : "btn btn-secondary dropdown-toggle rounded-0"}
                type="button"
                onClick={() => setOpen(!open)}>{props.selected ? props.selected : props.defaultLabel}</button>
        </div>

        {open &&
        <div className="dropdownItemsQ">
            {props.options.map(option => (
                <DropdownItem key={option.label} name={option.label} onClick={() => onSelect(option)}/>
            ))}
            {props.selected && <div className="dropdownItemQ" onClick={() => onSelect(null, null)}>Clear</div>}
        </div>
        }
    </div>
}

export default Dropdown;
