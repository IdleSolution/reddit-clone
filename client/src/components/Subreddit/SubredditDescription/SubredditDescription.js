import React, { Component } from "react";
import classes from "./SubredditDescription.module.scss";
import Button from "../../UI/Buttons/Button";
import { connect } from "react-redux";
import Aux from "../../../hoc/_Aux";
import PropTypes from "prop-types";

class SubredditDescription extends Component {
    render() {
        let buttons;
        if (this.props.authenticated) {
            if (this.props.subName === "r/all") {
                buttons = (
                    <Aux>
                        <Button
                            path="/create/subreddit"
                            btnClass="btn__primary btn__primary_blue btn__responsive"
                            link
                            style={{ width: "100%", marginBottom: ".5rem" }}
                        >
                            CREATE COMMUNITY
                        </Button>
                        <Button
                            path="/subreddits"
                            btnClass="btn__primary btn__primary_white btn__responsive"
                            link
                            style={{ width: "100%" }}
                        >
                            BROWSE COMMUNITIES
                        </Button>
                    </Aux>
                );
            } else {
                buttons = (
                    <Aux>
                        <Button
                            path={`/r/${this.props.subName}/create-post`}
                            link
                            btnClass="btn__primary btn__primary_blue btn__responsive"
                            style={{
                                width: "100%",
                                marginBottom: ".5rem",
                                marginTop: "2rem"
                            }}
                        >
                            CREATE POST
                        </Button>
                    </Aux>
                );
            }
        } else {
            buttons = (
                <Button
                    path="/subreddits"
                    btnClass="btn__primary btn__primary_blue btn__responsive"
                    link
                    style={{ width: "100%" }}
                >
                    BROWSE COMMUNITIES
                </Button>
            );
        }
        return (
            <div className={!this.props.onPost ? classes.info : [classes.hidden, classes.info].join(" ")}>
                <h2 className={classes.heading}>{this.props.subName}</h2>
                <p className={classes.description}>{this.props.subDesc}</p>
                {buttons}
            </div>
        );
    }
}

SubredditDescription.propTypes = {
    authenticated: PropTypes.bool,
    onPost: PropTypes.bool,
    subName: PropTypes.string,
    subDesc: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        authenticated: state.auth.authenticated
    };
};

export default connect(mapStateToProps)(SubredditDescription);
