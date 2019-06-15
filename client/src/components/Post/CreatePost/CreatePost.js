import React, { Component } from "react";
import Input from "../../UI/Input/Input";
import TextArea from "../../UI/TextArea/TextArea";
import Button from "../../UI/Buttons/Button";
import classes from "./CreatePost.module.scss";
import { connect } from "react-redux";
import { createPost } from "../../../store/actions/index";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

class CreatePost extends Component {
    state = {
        postTitle: "",
        postContent: ""
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        const data = {};
        data.postedBy = this.props.user.id;
        data.title = this.state.postTitle;
        data.content = this.state.postContent;
        data.subreddit = this.props.location.pathname.split("/")[2];
        this.props.createPost(data, this.props.history);
    };

    render() {
        return (
            <form onSubmit={this.onSubmit} className={classes.container}>
                <div className={classes.card}>
                    <h1 className={classes.heading}>
                        Creating Post in r/
                        {this.props.location.pathname.split("/")[2]}
                    </h1>
                    <div>
                        <Input
                            name="postTitle"
                            placeholder="Post title"
                            type="text"
                            onChange={this.onChange}
                        />
                        <TextArea
                            name="postContent"
                            placeholder="Text"
                            style={{ padding: "1rem", height: "100%" }}
                            onChange={this.onChange}
                        />
                    </div>

                    <Button
                        btnClass="btn__primary btn__primary_blue btn__responsive"
                        style={{ padding: "1rem 1.9rem", marginTop: "2rem" }}
                    >
                        Submit
                    </Button>
                    <p className={classes.error}>
                        {this.props.error ? this.props.error.err : ""}
                    </p>
                </div>
            </form>
        );
    }
}

CreatePost.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        id: PropTypes.number
    }),
    error: PropTypes.object,
    createPost: PropTypes.func
};

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        error: state.error.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createPost: (data, history) => dispatch(createPost(data, history))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CreatePost)
);
