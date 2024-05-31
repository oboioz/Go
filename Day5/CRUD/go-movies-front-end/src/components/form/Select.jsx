const Select = (props) => {
    return (
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            <select
                id={props.name}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                className="form-select"
            >
                <option value="" disabled>{props.placeholder}</option>
                {props.options.map((option) => {
                    return (
                        <option
                            key={option.id}
                            value={option.id}
                            >
                                {option.value}
                        </option>
                    );
                })}
            </select>
            <div className={props.errorDiv}>
                {props.errorMsg}
            </div>
        </div>
    )
}

export default Select;