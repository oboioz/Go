const TextArea = (props) => {
    return(
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <textarea
                className="form-control"
                id={props.name}
                name={props.name}
                rows={props.rows}
                value={props.value}
                onChange={props.handleChange}
            />
            <div className={prop.errorDiv}>
                {props.errorMsg}
            </div>
        </div>
    )
};

export default TextArea;