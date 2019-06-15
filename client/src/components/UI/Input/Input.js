import React, { Component } from "react";
import classes from "./Input.module.scss";
import PropTypes from "prop-types";

class Input extends Component {
    state = {
        errorClasses: [classes.error]
    };

    componentWillReceiveProps() {
        let styles;
        if (this.props.animate) {
            styles = this.state.errorClasses;
            styles.push(classes.error_animated);
            this.setState({ errorClasses: styles });
        } else {
            styles = [classes.error];
            this.setState({ errorClasses: styles });
        }
    }

    render() {
        return (
            <div className={classes.inputContainer}>
                <p className={this.state.errorClasses.join(" ")}>
                    {this.props.error ? this.props.error : null}
                </p>
                <input
                    value={this.props.value}
                    onChange={this.props.onChange}
                    name={this.props.name}
                    style={this.props.style}
                    type={this.props.type}
                    className={classes.input}
                    placeholder={this.props.placeholder}
                />

                <p className={classes.dummyPlaceholder}>
                    {this.props.placeholder}
                </p>
            </div>
        );
    }
}

Input.propTypes = {
    animate: PropTypes.bool,
    error: PropTypes.object,
    style: PropTypes.object,
    value: PropTypes.number,
    onChange: PropTypes.func,
    name: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string
}

export default Input;
