import React from "react";
import classes from "./TextArea.module.scss";
import PropTypes from "prop-types";

const TextArea = props => (
    <div className={classes.container}>
        <textarea
            onChange={props.onChange}
            name={props.name}
            className={classes.textArea}
            style={{ ...props.style }}
            placeholder={props.placeholder}
        />
        <p className={classes.dummyPlaceholder}>{props.placeholder}</p>
    </div>
);

TextArea.propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    style: PropTypes.object,
}

export default TextArea;
