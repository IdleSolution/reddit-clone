import React, { Component } from "react";
import "./App.scss";

// Components
import Layout from "./components/Layout/Layout";
import { Route, withRouter, Redirect } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import CreateSubreddit from "./components/Subreddit/CreateSubreddit/CreateSubreddit";
import BrowseSubreddits from "./components/Subreddit/BrowseSubreddits/BrowseSubreddits";
import CreatePost from "./components/Post/CreatePost/CreatePost";
import Post from "./components/Post/Post";
import Profile from "./components/Profile/Profile";

import Aux from "./hoc/_Aux";
import Subreddit from "./components/Subreddit/Subreddit";
import * as actions from "./store/actions/index";
import setAuthToken from "./utilities/setAuthToken";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import PropTypes from "prop-types";

class App extends Component {
    componentWillMount() {
        if (localStorage.jwt) {
            const token = localStorage.jwt;
            setAuthToken(token);
            const decodedToken = jwt_decode(token);

            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                this.props.setCurrentUser(decodedToken);
            }
        }
    }

    onLoggedUserRoutes = Component => {
        if (this.props.loggedUser.authenticated) {
            return <Redirect to="/" />;
        } else {
            return Component;
        }
    };

    onPrivateRoutes = Component => {
        if (this.props.loggedUser.authenticated) {
            return Component;
        } else {
            return <Redirect to="/" />;
        }
    };

    render() {
        let routes = (
            <Aux>
                <Route exact path="/subreddits" component={BrowseSubreddits} />
                <Route
                    exact
                    path="/create/subreddit"
                    render={() => this.onPrivateRoutes(<CreateSubreddit />)}
                />
                <Route
                    exact
                    path="/sign_up"
                    render={() => this.onLoggedUserRoutes(<Signup />)}
                />
                <Route
                    exact
                    path="/login"
                    render={() => this.onLoggedUserRoutes(<Login />)}
                />
                <Route
                    exact
                    path="/r/:name"
                    render={props => (
                        <Subreddit key={props.match.params.name} {...props} />
                    )}
                />
                <Route
                    exact
                    path="/r/:name/create-post"
                    render={() => this.onPrivateRoutes(<CreatePost />)}
                />
                <Route exact path="/r/:name/post/:id" component={Post} />
                <Route exact
                    path="/profile/:name" 
                    render={props => (
                        <Profile key={props.match.params.name} {...props} />
                    )} />
                <Route exact path="/" component={Subreddit} />
            </Aux>
        );
        return (
            <div>
                <Layout>{routes}</Layout>
            </div>
        );
    }
}

App.propTypes = {
    loggedUser: PropTypes.shape({
        authenticated: PropTypes.bool,
        user: PropTypes.shape({
            username: PropTypes.string,
            id: PropTypes.number,
        })
    }),
    setCurrentUser: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        loggedUser: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser: user => dispatch(actions.setCurrentUser(user))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
