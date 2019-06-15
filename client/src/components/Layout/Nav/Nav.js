import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";

import Aux from "../../../hoc/_Aux";
import Button from "../../UI/Buttons/Button";
import SearchedSubreddits from "./SearchedSubreddits/SearchedSubreddits";

import searchSvg from "./search-solid.svg";
import icon from "../../../images/icon.png";
import classes from "./Nav.module.scss";

import * as authActions from "../../../store/actions/index";

class Nav extends Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.userOptions = React.createRef();
        this.state = {
            userOptionsOpen: false,
            searchedSubreddits: []
        };
    }

    onChangeUserOptions = () => {
        this.setState({ userOptionsOpen: !this.state.userOptionsOpen });
    };

    handleClick = e => {
        if (this.node.current.contains(e.target)) {
            this.setState({ userOptionsOpen: !this.state.userOptionsOpen });
        } else if (this.userOptions.current.contains(e.target)) {
            return setTimeout(() => {
                this.setState({ userOptionsOpen: false, searchedSubreddits: []})
            }, 300)
        } else {
            if (this.state.userOptionsOpen) {
                this.setState({ userOptionsOpen: false });
            }
        }
    };

    onLogout = () => {
        this.props.logoutUser();
        this.setState({ userOptionsOpen: false });
    };

    onChange = e => {
        if(e.target.value.length === 0) {
            return this.setState({searchedSubreddits: []})
        }
        axios
            .post("/r/search", {
                match: e.target.value
            })
            .then(data => {
                this.setState({ searchedSubreddits: data.data });
            });
    };

    render() {
        let links;
        if (!this.props.username) {
            document.removeEventListener("mousedown", this.handleClick, false);
            links = (
                <div className={classes.btns_container}>
                    <Button
                        link
                        path="/login"
                        btnClass="btn__primary btn__primary_white"
                        style={{ width: "8rem", padding: ".5rem 0" }}
                    >
                        LOGIN
                    </Button>
                    <Button
                        link
                        path="/sign_up"
                        btnClass="btn__primary btn__primary_blue"
                        style={{ width: "8rem", padding: ".5rem 0" }}
                    >
                        SIGN UP
                    </Button>
                </div>
            );
        } else {
            document.addEventListener("mousedown", this.handleClick, false);
            links = (
                <div className={classes.userBox_container}>
                    <div ref={this.node} className={classes.userBox}>
                        <p className={classes.username}>
                            {this.props.username}
                        </p>
                        <i
                            className="fas fa-chevron-down"
                            style={{ fontSize: ".8rem" }}
                        />
                    </div>
                    <div
                        ref={this.userOptions}
                        className={[
                            classes.userOptions,
                            this.state.userOptionsOpen
                                ? null
                                : classes.userOptions_hidden
                        ].join(" ")}
                    >
                        <Link to={`/profile/${this.props.username}`}>
                            <div className={classes.userOption}>
                                <i className="fas fa-user" />
                                <p style={{ marginLeft: "1rem" }}>My Profile</p>
                            </div>
                        </Link>
                        <div
                            onClick={this.onLogout}
                            id="logout"
                            className={classes.userOption}
                        >
                            <i className="fas fa-sign-out-alt" />
                            <p style={{ marginLeft: "1rem" }}>Logout</p>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <nav className={classes.nav}>
                    <Link to="/" className={classes.icon_container}>
                        <img className={classes.icon} src={icon} alt="icon" />
                        <h1 className={classes.heading}>reddit</h1>
                    </Link>
                    <div className={classes.search_container}>
                        <img
                            className={classes.search_icon}
                            src={searchSvg}
                            alt=""
                        />
                        <input
                            className={classes.search}
                            type="text"
                            placeholder="Search Reddit"
                            onChange={this.onChange}
                            onFocus={this.onChange}
                        />
                    </div>
                    <Aux>{links}</Aux>
                </nav>
                <SearchedSubreddits
                    subreddits={this.state.searchedSubreddits}
                />
            </div>
        );
    }
}

Nav.propTypes = {
    username: PropTypes.string,
    userID: PropTypes.number,
    logoutUser: PropTypes.func,
    
}

const mapStateToProps = state => {
    return {
        username: state.auth.user.username,
        userID: state.auth.user.id
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(authActions.logoutUser)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav);
