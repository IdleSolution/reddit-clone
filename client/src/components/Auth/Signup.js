import React, { Component } from "react";
import classes from "./Auth.module.scss";
import Input from "../UI/Input/Input";
import Button from "../UI/Buttons/Button";
import * as authActions from "../../store/actions/index";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

class Signup extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordRpt: "",
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

    onRegister = e => {
        e.preventDefault();
        const { username, email, password, passwordRpt } = this.state;
        const user = { username, email, password, passwordRpt };
        this.props.registerUser(user, this.props.history);
    };

    // Animating errors when user submits while error was already shown but the reason of it wasnt fixed
    onCheckErrors = () => {
        const error = this.props.error;
        let liveErrors = this.state.liveErrors;
        if (error) {
            if (error.username) {
                liveErrors.username = true;
            }
            if (error.email) {
                liveErrors.email = true;
            }
            if (error.password) {
                liveErrors.password = true;
            }
            if (error.passwordRpt) {
                liveErrors.passwordRpt = true;
            }
            this.setState({ liveErrors: liveErrors });

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
                <form
                    noValidate
                    className={classes.box}
                    onSubmit={this.onRegister}
                >
                    <h2 className={classes.heading}>Signup</h2>
                    <div
                        style={{ marginBottom: "1.5rem" }}
                        className={classes.info}
                    >
                        <Input
                            error={error ? error.username : null}
                            value={this.state.username}
                            onChange={this.onChange}
                            name="username"
                            type="text"
                            placeholder="Username"
                            animate={this.state.liveErrors.username}
                        />

                        <Input
                            error={error ? error.email : null}
                            value={this.state.email}
                            onChange={this.onChange}
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            animate={this.state.liveErrors.email}
                        />

                        <Input
                            error={error ? error.password : null}
                            value={this.state.password}
                            onChange={this.onChange}
                            name="password"
                            type="password"
                            placeholder="Password"
                            animate={this.state.liveErrors.password}
                        />

                        <Input
                            error={error ? error.passwordRpt : null}
                            value={this.state.passwordRpt}
                            onChange={this.onChange}
                            name="passwordRpt"
                            type="password"
                            placeholder="Repeat Password"
                            animate={this.state.liveErrors.passwordRpt}
                        />
                    </div>
                    <Button
                        click={this.onCheckErrors}
                        btnClass="btn__primary btn__primary_blue btn__responsive"
                        style={{ width: "10rem", padding: "1rem .5rem" }}
                    >
                        Register
                    </Button>
                </form>
            </div>
        );
    }
}

Signup.propTypes = {
    error: PropTypes.object,
    registerUser: PropTypes.func,
    clearErrors: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        error: state.error.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        registerUser: (data, history) =>
            dispatch(authActions.registerUser(data, history)),
        clearErrors: () => dispatch(authActions.clearErrors())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Signup));
