import React from "react"
import classes from "./PageError.module.scss";
import PropTypes from "prop-types"

const PageError = (props) => (
    <div className={classes.message}>
        <p>{props.message}</p>
    </div>
)

PageError.propTypes = {
    message: PropTypes.string
}

export default PageError;