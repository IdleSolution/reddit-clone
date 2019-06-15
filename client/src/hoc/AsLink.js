import React, { Component } from "react";
import { Link } from "react-router-dom";


const AsLink = Component => {
    return class withSpinner extends Component {
        render() {
            if (this.props.isLoading) {
                return <div>Loading</div>;
            }

            return <Component {...this.props} />;
        }
    };
};



export default AsLink;
