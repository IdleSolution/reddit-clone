import React from "react";
import classes from "./Button.module.scss";
import { Link } from "react-router-dom";
import Aux from "../../../hoc/_Aux";
import PropTypes from "prop-types";

const Button = props => {
    const classesArr = props.btnClass.split(" ");
    let styles = "";
    let btn;
    classesArr.forEach(name => {
        styles += classes[name] + " ";
    });
    if (props.link) {
        styles += classes.link + " ";
        btn = (
            <Link to={props.path} className={styles} style={{ ...props.style }}>
                {props.children}
            </Link>
        );
    } else {
        btn = (
            <button
                onClick={props.click}
                to={props.path}
                className={styles}
                style={{ ...props.style }}
            >
                {props.children}
            </button>
        );
    }
    return <Aux>{btn}</Aux>;
};

Button.propTypes = {
    children: PropTypes.any.isRequired,
    path: PropTypes.string,
    click: PropTypes.func,
    style: PropTypes.object,
}

export default Button;
