import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

import { startLoading, stopLoading } from "../../store/actions/index";
import classes from "./Profile.module.scss";

import PostsContainer from "../Post/PostsContainer/PostsContainer";
import ProfileDescription from "./ProfileDescription/ProfileDesc";
import Spinner from "../Spinner/Spinner";
import PropTypes from "prop-types";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.contentRef = React.createRef();
        this.state = {
            username: "",
            userContent: [],
            userInfo: [],
            loadContentRequestSent: false,
            page: 1
        };
    }

    componentWillMount() {
        this.props.startLoading();
        const username = this.props.location.pathname.split("/")[2];
        axios
            .post("/profile/load-info", {
                username
            })
            .then(data => {
                this.props.stopLoading();
                this.setState({
                    userContent: data.data.userContent,
                    username,
                    userInfo: data.data.user
                });
            })
            .catch(e => console.log(e));
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    loadContent = () => {
        const { userContent, username } = this.state;
        let { page } = this.state;

        axios
            .post("/profile/load-info", {
                username,
                page
            })
            .then(data => {
                if (data.data.userContent === "No more posts to load") {
                    this.setState({
                        loadContentRequestSent: false
                    });
                    return window.removeEventListener(
                        "scroll",
                        this.handleScroll
                    );
                }
                const loadedPosts = data.data.userContent;
                loadedPosts.forEach(post => {
                    userContent.push(post);
                });
                page++;
                this.setState({
                    page,
                    userContent,
                    loadContentRequestSent: false
                });
            })
            .catch(e => {
                console.log(e);
            });
    };

    handleScroll = () => {
        const contentHeight =
            this.contentRef.current.getBoundingClientRect().bottom +
            window.pageYOffset;
        const userHeight = window.pageYOffset + window.innerHeight;
        if (Math.abs(contentHeight - userHeight) <= 50) {
            if (!this.state.loadContentRequestSent) {
                this.setState({ loadContentRequestSent: true });
                setTimeout(() => {
                    this.loadContent();
                }, 500);
            }
        }
    };

    render() {
        let loadingContent;
        let message;
        loadingContent = this.state.loadContentRequestSent ? <Spinner /> : null;
        if(this.state.userContent.length === 0 && !this.props.loading) {
            message = <p className={classes.message}>User hasn't added anything just yet.</p>
        } else {
            message = null
        }
        return (
            <div>
                <div className={classes.container} ref={this.contentRef}>
                    {message}
                    <PostsContainer
                        username={this.state.username}
                        posts={this.state.userContent}
                    />
                    <ProfileDescription
                        karma={
                            this.state.userInfo[0]
                                ? this.state.userInfo[0].karma
                                : null
                        }
                        createdAt={
                            this.state.userInfo[0]
                                ? this.state.userInfo[0].createdAt
                                : null
                        }
                        username={this.state.username}
                    />
                </div>
                <div>{loadingContent}</div>
            </div>
        );
    }
}

Profile.propTypes = {
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,
    loading: PropTypes.bool,
}

const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
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
)(withRouter(Profile));
