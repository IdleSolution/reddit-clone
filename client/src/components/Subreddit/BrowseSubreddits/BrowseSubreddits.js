import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { startLoading, stopLoading } from "../../../store/actions/index";
import classes from "./BrowseSubreddits.module.scss";

import Aux from "../../../hoc/_Aux";
import { Link } from "react-router-dom";

class BrowseSubreddits extends Component {
    state = {
        subreddits: null
    };
    componentWillMount() {
        this.props.startLoading();
        axios
            .post("/r/all-subreddits")
            .then(res => {
                this.props.stopLoading();
                this.setState({ subreddits: res.data.data });
            })
            .catch(e => {
                console.log(e);
            });
    }
    render() {
        let content;
        if (this.state.subreddits) {
            content = this.state.subreddits.map(subreddit => (
                <div key={subreddit.name} className={classes.singleSubreddit}>
                    <Link
                        style={{
                            width: "100%",
                            minHeight: "inherit",
                            display: "block"
                        }}
                        to={`/r/${subreddit.name}`}
                    >
                        <h2 className={classes.subredditName}>
                            {subreddit.name}
                        </h2>
                        <p className={classes.subredditDescription}>
                            {subreddit.description}
                        </p>
                    </Link>
                </div>
            ));
        }
        return (
            <Aux>
                <h1 className={classes.mainHeading}>Browsing All Subreddits</h1>
                <div className={classes.allSubreddits}>{content}</div>
            </Aux>
        );
    }
}

BrowseSubreddits.propTypes = {
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
    
}

const mapDispatchToProps = dispatch => {
    return {
        startLoading: () => dispatch(startLoading()),
        stopLoading: () => dispatch(stopLoading())
    };
};

export default connect(
    null,
    mapDispatchToProps
)(BrowseSubreddits);
