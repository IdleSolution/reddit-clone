import React, { Component } from "react";
import classes from "./CreateSubreddit.module.scss";
import Input from "../../UI/Input/Input";
import TextArea from "../../UI/TextArea/TextArea";
import Button from "../../UI/Buttons/Button";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

class CreateSubreddit extends Component {
    state = {
        subredditName: "",
        subredditDescription: "",
        liveErrors: {}
    };

    componentWillUnmount() {
        this.props.clearErrors();
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        const user_id = this.props.user.id;
        e.preventDefault();
        const { subredditName, subredditDescription } = this.state;
        const subreddit = { subredditName, subredditDescription, user_id };
        this.props.createSubreddit(subreddit, this.props.history);
    };

    onCheckErrors = () => {
        const error = this.props.errors;
        let liveErrors = this.state.liveErrors;
        if (error) {
            if (error.name) {
                liveErrors.name = true;
            }
            this.setState({ liveErrors: liveErrors });

            setTimeout(() => {
                liveErrors = {};
                this.setState({ liveErrors });
            }, 1000);
        }
    };

    render() {
        const error = this.props.errors;
        return (
            <form onSubmit={this.onSubmit} className={classes.container}>
                <div className={classes.box}>
                    <h2 className={classes.heading}>Creating New Subreddit</h2>
                    <div>
                        <Input
                            error={error ? error.name : null}
                            animate={this.state.liveErrors.name}
                            name="subredditName"
                            onChange={this.onChange}
                            placeholder="Subreddit name"
                            type="text"
                        />
                        <TextArea
                            name="subredditDescription"
                            onChange={this.onChange}
                            placeholder="Subreddit description"
                            style={{ padding: "1rem", height: "80%" }}
                        />
                    </div>
                    <Button
                        click={this.onCheckErrors}
                        btnClass="btn__primary btn__primary_blue btn__responsive"
                        style={{
                            width: "25%",
                            marginTop: "2.5rem",
                            padding: "1rem .5rem"
                        }}
                    >
                        SUBMIT
                    </Button>
                </div>
            </form>
        );
    }
}

CreateSubreddit.propTypes = {
    errors: PropTypes.object,
    user: PropTypes.shape({
        username: PropTypes.string,
        id: PropTypes.number,
        createSubreddit: PropTypes.func,
        clearErrors: PropTypes.func,
        
    })
}

const mapStateToProps = state => {
    return {
        errors: state.error.error,
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createSubreddit: (data, history) =>
            dispatch(actions.createSubreddit(data, history)),
        clearErrors: () => dispatch(actions.clearErrors())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CreateSubreddit));
