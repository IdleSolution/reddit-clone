import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import checkDate from "../../utilities/check-date";
import { startLoading, stopLoading } from "../../store/actions/index";

import SubredditDescription from "../Subreddit/SubredditDescription/SubredditDescription";
import Votes from "../Votes/Votes";
import NewComment from "../Comments/NewComment/NewComment";
import SingleComment from "../Comments/SingleComment/SingleComment";
import Aux from "../../hoc/_Aux";

import classes from "./Post.module.scss";

class Post extends Component {
    state = {
        post: {},
        comments: [],
        subredditName: "",
        postID: ""
    };
    componentWillMount() {
        this.props.startLoading();
        const subredditName = this.props.match.params.name;
        const postID = this.props.match.params.id;
        axios
            .post("/post/get", {
                postID: postID
            })
            .then(data => {
                this.props.stopLoading();
                this.setState({
                    post: data.data.post[0],
                    comments: data.data.comments,
                    subredditName,
                    postID
                });
            })
            .catch(e => {
                console.log(e.response);
            });
    }

    render() {
        let post;
        if (this.state.post && this.state.comments) {
            post = (
                <Aux>
                    <Link to={`/r/${this.state.subredditName}`}>
                        <div className={classes.subredditTheme}>
                            <p className={classes.themeName}>
                                r/{this.state.subredditName}
                            </p>
                        </div>
                    </Link>
                    <div className={classes.container}>
                        <div className={classes.postContainer}>
                            <div className={classes.votesContainer}>
                                <Votes
                                    postID={this.state.postID}
                                    upvotes={this.state.post.upvotes}
                                    downvotes={this.state.post.downvotes}
                                    karma={this.state.post.karma}
                                    votingOn="post"
                                />
                            </div>

                            <div className={classes.postInfoContainer}>
                                <p className={classes.postAuthor}>
                                    Posted by{" "}
                                    <Link
                                        to={`/profile/${
                                            this.state.post.username
                                        }`}
                                    >
                                        {this.state.post.username}
                                    </Link>{" "}
                                    {checkDate(this.state.post.date)}
                                </p>
                                <h1 className={classes.postHeading}>
                                    {this.state.post.title}
                                </h1>
                                <p className={classes.postText}>
                                    {this.state.post.text}
                                </p>

                                <div className={classes.commentCountContainer}>
                                    <i className="fas fa-comment" />
                                    <p className={classes.commentsCount}>{`${
                                        this.state.comments.length
                                    } ${this.state.comments.length === 1 ? "Comment" : "Comments"}`}</p>
                                </div>

                                {this.props.authenticated && (
                                    <NewComment postID={this.state.postID} />
                                )}
                                {!this.props.authenticated && (
                                    <p className={classes.loginWarning}>
                                        <Link to="/login">
                                            You need to login to be able to
                                            comment
                                        </Link>
                                    </p>
                                )}

                                <div
                                    style={{
                                        marginTop: this.props.authenticated
                                            ? "9rem"
                                            : "4rem"
                                    }}
                                >
                                    <div
                                        className={
                                            this.state.comments.length === 0
                                                ? null
                                                : classes.Line
                                        }
                                    />
                                    {this.state.comments.map(comment => (
                                        <SingleComment
                                            key={comment.id}
                                            text={comment.text}
                                            karma={comment.karma}
                                            date={comment.date}
                                            username={comment.username}
                                            upvotes={comment.upvotes}
                                            downvotes={comment.downvotes}
                                            id={comment.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <SubredditDescription
                            subName={this.state.subredditName}
                            subDesc={`You are browsing a post from r/${
                                this.state.subredditName
                            }`}
                            onPost
                        />
                    </div>
                </Aux>
            );
        } else {
            post = <div />;
        }
        return <div>{post}</div>;
    }
}

Post.propTypes = {
    authenticated: PropTypes.bool,
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
    
}

const mapStateToProps = state => {
    return {
        authenticated: state.auth.authenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        startLoading: () => dispatch(startLoading()),
        stopLoading: () => dispatch(stopLoading())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Post);
