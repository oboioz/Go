const Checkbox = (props) => {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id={props.name}
                name={props.name}
                checked={props.checked}
                onChange={props.onChange}
                value={props.value}
            />
            <label htmlFor={props.name} className="form-check-label">
                {props.title}
            </label>
        </div>
    )
}

export default Checkbox;