import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Nav from "./Nav/Nav";
import Aux from "../../hoc/_Aux";
import Popup from "../UI/Popup/Popup";
import Spinner from "../Spinner/Spinner";
class Layout extends Component {
    render() {
        let spinner;
        spinner = this.props.loading ? <Spinner /> : null;

        return (
            <Aux>
                <Nav />
                {spinner}
                <div style={{ width: "100%", height: "94vh" }}>
                    {this.props.children}
                </div>
                <Popup />
            </Aux>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.any.isRequired,
    loading: PropTypes.bool,
}

const mapStateToProps = state => {
    return {
        loading: state.loading.loading
    };
};

export default connect(mapStateToProps)(Layout);
