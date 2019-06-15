import React, { Component } from "react";
import Votes from "../../Votes/Votes";
import classes from "./SingleComment.module.scss";
import checkDate from "../../../utilities/check-date";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class SingleComment extends Component {
    state = {
        karma: this.props.karma
    };

    onKarmaChange = karma => {
        this.setState({
            karma
        });
    };

    render() {
        let votes;
        let detailedInfo;
        if (!this.props.onProfile) {
            votes = (
                <Votes
                    upvotes={this.props.upvotes}
                    downvotes={this.props.downvotes}
                    karma={this.props.karma}
                    votingOn="comment"
                    postID={this.props.id}
                    onKarmaChange={karma => this.onKarmaChange(karma)}
                    onMount
                />
            );
        } else {
            detailedInfo = (
                <div className={classes.commentInfo}>
                    <i
                        className={["fas", "fa-comment", classes.icon].join(
                            " "
                        )}
                    />
                    <p className={classes.commentDetails}>
                        {" "}
                        {this.props.username} commented on
                    </p>
                    <p className={classes.postName}>
                        <Link
                            to={`/r/${this.props.subredditName}/post/${
                                this.props.commentedOnID
                            }`}
                        >
                            {this.props.commentedOn}
                        </Link>
                    </p>
                    <p className={classes.subredditName}>
                        <Link to={`/r/${this.props.subredditName}`}>
                            r/{this.props.subredditName}
                        </Link>
                    </p>
                </div>
            );
        }

        let post = (
            <div
                className={
                    this.props.onProfile
                        ? classes.profileContainer
                        : classes.container
                }
            >
                {detailedInfo}
                <div style={{ display: "flex", width: "100%" }}>
                    {votes}
                    <div
                        style={{
                            marginLeft: this.props.onProfile ? "5%" : "1rem",
                            width: "90%"
                        }}
                    >
                        <div className={classes.mainInfo}>
                            <h3 className={classes.username}>
                                <Link to={`/profile/${this.props.username}`}>
                                    {this.props.username}
                                </Link>
                            </h3>
                            <p className={classes.karma}>
                                {this.state.karma} points
                            </p>
                            <p className={classes.date}>
                                {checkDate(this.props.date)}
                            </p>
                        </div>
                        <p className={classes.text}>{this.props.text}</p>
                    </div>
                </div>
            </div>
        );

        if (this.props.onProfile) {
            post = (
                <div style={{ position: "relative" }}>
                    <Link
                        className={classes.link}
                        to={`/r/${this.props.subredditName}/post/${
                            this.props.commentedOnID
                        }`}
                    />
                    {post}
                </div>
            );
        }

        return <div className={classes.main}>{post}</div>;
    }
}

SingleComment.propTypes = {
    karma: PropTypes.number,
    commentedOnID: PropTypes.number,
    id: PropTypes.number,
    onProfile: PropTypes.bool,
    upvotes: PropTypes.array,
    downvotes: PropTypes.array,
    subredditName: PropTypes.string,
    username: PropTypes.string,
    commentedOn: PropTypes.string,
    text: PropTypes.string,
    date: PropTypes.string
};

export default SingleComment;
