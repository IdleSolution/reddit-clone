import React, { Component } from "react";
import TextArea from "../../UI/TextArea/TextArea";
import Button from "../../UI/Buttons/Button";
import classes from "./NewComment.module.scss";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { createComment } from "../../../store/actions/index";
import PropTypes from "prop-types"

class NewComment extends Component {
    state = {
        newComment: "",
        error: null
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        if (this.state.newComment.length === 0) {
            this.setState({ error: "Your comment can't be empty." });
        } else {
            this.props.createComment({
                text: this.state.newComment,
                post_id: this.props.postID,
                user_id: this.props.user.id
            });
        }
    };

    render() {
        let error;
        if (this.state.error) {
            error = this.state.error;
        } else if (this.props.error) {
            error = this.props.error;
        }
        return (
            <form
                onSubmit={this.onSubmit}
                className={classes.newCommentContainer}
            >
                <p className={classes.commentAs}>Comment as {this.props.user.username}</p>
                <TextArea
                    onChange={this.onChange}
                    name="newComment"
                    placeholder="Your comment..."
                    style={{ height: "7.5rem", padding: "1rem", width: "100%" }}
                />

                <p className={classes.error}>{error}</p>
                <Button
                    style={{
                        position: "absolute",
                        right: "0",
                        marginTop: "1rem",
                        padding: "1rem .5rem",
                        fontWeight: "100"
                    }}
                    btnClass="btn__primary btn__primary_blue btn__responsive"
                >
                    New Comment
                </Button>
            </form>
        );
    }
}

NewComment.propTypes = {
    error: PropTypes.object,
    createComment: PropTypes.func,
    user: PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string
    }),
    post_id: PropTypes.number,
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        error: state.error.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createComment: data => dispatch(createComment(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(NewComment));
