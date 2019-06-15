import React, { Component } from "react";
import classes from "./Auth.module.scss";
import Input from "../UI/Input/Input";
import Button from "../UI/Buttons/Button";
import { connect } from "react-redux";
import * as authActions from "../../store/actions/index";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

class Login extends Component {
    state = {
        username: "",
        password: "",
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

    onLogin = e => {
        e.preventDefault();
        const { username, password } = this.state;
        const user = { username, password };
        this.props.loginUser(user, this.props.history);
    };

    // Animating errors when user submits while error was already shown but the reason of it wasnt fixed
    onCheckErrors = () => {
        const error = this.props.error;
        let liveErrors = this.state.liveErrors;
        if (error) {
            if (error.username) {
                liveErrors.username = true;
            }
            if (error.password) {
                liveErrors.password = true;
            }
            this.setState({ liveErrors });
            setTimeout(() => {
                liveErrors = {};
                this.setState({ liveErrors });
            }, 1000);
        }
    };

    render() {
        const error = this.props.error;
        return (
            <div className={classes.container}>
                <form onSubmit={this.onLogin} className={classes.box}>
                    <h2 className={classes.heading}>Login</h2>
                    <div
                        style={{ marginBottom: "1.5rem" }}
                        className={classes.info}
                    >
                        <Input
                            error={error ? error.username : null}
                            onChange={this.onChange}
                            name="username"
                            value={this.state.username}
                            type="text"
                            placeholder="Username"
                            animate={this.state.liveErrors.username}
                        />
                        <Input
                            error={error ? error.password : null}
                            onChange={this.onChange}
                            name="password"
                            value={this.state.password}
                            type="password"
                            placeholder="Password"
                            animate={this.state.liveErrors.password}
                        />
                    </div>
                    <Button
                        click={this.onCheckErrors}
                        btnClass="btn__primary btn__primary_blue"
                        style={{ width: "10rem", padding: "1rem .5rem" }}
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}


Login.propTypes = {
    error: PropTypes.object,
    loginUser: PropTypes.func,
    clearErrors: PropTypes.func,
}


const mapStateToProps = state => {
    return {
        error: state.error.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (data, history) =>
            dispatch(authActions.loginUser(data, history)),
        clearErrors: () => dispatch(authActions.clearErrors())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Login));
