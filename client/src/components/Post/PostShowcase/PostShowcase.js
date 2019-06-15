import React from "react";
import classes from "./PostShowcase.module.scss";
import Votes from "../../Votes/Votes";
import checkDate from "../../../utilities/check-date";
import { Link } from "react-router-dom";

const PostShowcase = props => (
    <div className={classes.container}>
        <Votes
            karma={props.karma}
            upvotes={props.upvotes}
            downvotes={props.downvotes}
            postID={props.postID}
            votingOn="post"
            onMount
        />
        <div style={{width: '100%', position: 'relative', zIndex: 10}}>
            <Link
                className={classes.link}
                to={`/r/${props.subName}/post/${props.postID}`}
            />
            <div className={classes.post}>
                <h3 className={classes.heading}>{props.title}</h3>
                <div className={classes.info}>
                    <p className={classes.subreddit}>
                        <Link to={`/r/${props.subName}`}>
                            r/{props.subName}
                        </Link>
                    </p>
                    <p className={classes.user}>
                        posted by{" "}
                        <Link
                            className={classes.userOnHover}
                            to={`/profile/${props.username}`}
                        >
                            u/{props.username}
                        </Link>{" "}
                        {checkDate(props.date)}
                    </p>
                </div>
                <div className={classes.comments_container}>
                    <i className="fas fa-comment" />
                    <p className={classes.comments}>
                        {props.commentsCount}{" "}
                        {props.commentsCount === 1 ? "Comment" : "Comments"}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default PostShowcase;
