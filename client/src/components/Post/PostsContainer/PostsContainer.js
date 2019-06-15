// The class works as comment container aswell as post container

import React, { Component } from "react";
import PostShowcase from "../PostShowcase/PostShowcase";
import SingleComment from "../../Comments/SingleComment/SingleComment";
import classes from "./PostsContainer.module.scss";
import PropTypes from "prop-types";

class PostsContainer extends Component {
    render() {
        let content = [];

        // eslint-disable-next-line
        this.props.posts.map(post => {
            if (post.title) {
                content.push(
                    <PostShowcase
                        key={post.id + post.date}
                        karma={post.karma}
                        title={post.title}
                        date={post.date}
                        username={
                            this.props.username
                                ? this.props.username
                                : post.username
                        }
                        subName={post.subredditName}
                        postID={post.id}
                        upvotes={post.upvotes}
                        downvotes={post.downvotes}
                        commentsCount={post.comments_count}
                    />
                );
            } else {
                content.push(
                    <SingleComment
                        key={post.id + post.date}
                        upvotes={post.upvotes}
                        downvotes={post.downvotes}
                        karma={post.karma}
                        postID={post.id}
                        date={post.date}
                        username={this.props.username}
                        text={post.text}
                        commentedOn={post.commentedOn}
                        commentedOnID={post.commentedOnID}
                        subredditName={post.subredditName}
                        onProfile
                    />
                );
            }
        });
        return <div className={classes.container}>{content}</div>;
    }
}

PostsContainer.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        comments_count: PropTypes.number,
        date: PropTypes.string,
        subredditName: PropTypes.string,
        title: PropTypes.string,
        username: PropTypes.string,
        upvotes: PropTypes.arrayOf(PropTypes.number),
        downvotes: PropTypes.arrayOf(PropTypes.number),

    }))
}

export default PostsContainer;
