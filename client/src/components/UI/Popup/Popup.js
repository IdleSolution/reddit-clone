import React, { Component } from "react";
import classes from "./Popup.module.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Popup extends Component {
    state = {
        shouldBeShown: false
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ shouldBeShown: nextProps.showPopup });
    }

    render() {
        return (
            <div
                className={[
                    classes.box,
                    this.state.shouldBeShown ? null : classes.hide
                ].join(" ")}
            >
                <p>{this.props.popupText}</p>
            </div>
        );
    }
}

Popup.propTypes = {
    showPopup: PropTypes.bool,
    popupText: PropTypes.string,
}

const mapStateToProps = state => {
    return {
        showPopup: state.popup.showPopup,
        popupText: state.popup.popupText
    };
};

export default connect(mapStateToProps)(Popup);
