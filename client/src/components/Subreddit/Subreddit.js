import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { startLoading, stopLoading } from "../../store/actions/index";
import classes from "./Subreddit.module.scss";

import SubredditDescription from "./SubredditDescription/SubredditDescription";
import PostsContainer from "../Post/PostsContainer/PostsContainer";
import Spinner from "../Spinner/Spinner";
import PageError from "../Errors/PageError";
import Aux from "../../hoc/_Aux";


class Subreddit extends Component {
    constructor(props) {
        super(props);
        this.postsRef = React.createRef();
        this.state = {
            subredditName: "",
            subredditDesc: "",
            subredditID: 0,
            subredditDoesntExist: false,
            posts: [],
            page: 1,
            loadPostRequestSent: false
        };
    }

    componentWillMount() {
        this.props.startLoading();
        const { name } = this.props.match.params;
        if (!name) {
            axios.post("/post/load-all").then(data => {
                this.props.stopLoading();
                this.setState({
                    subredditName: "r/all",
                    subredditDesc:
                        "Welcome to the center of the internet! You can see posts from all of our subreddits!",
                    posts: data.data.posts
                });
            });
        } else {
            axios
                .post(`/r/${name}`)
                .then(data => {
                    this.props.stopLoading();
                    this.setState({
                        subredditName: data.data.subredditName,
                        subredditDesc: data.data.subredditDescription,
                        subredditID: data.data.subredditID,
                        posts: data.data.posts
                    });
                })
                .catch(e => {
                    if (e.response.data.error === "Subreddit doesn't exist") {
                        this.setState({
                            subredditDoesntExist: true
                        });
                    } else {
                        console.log(e);
                    }
                });
        }
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    // Loading more posts on scroll
    loadPosts = () => {
        const { subredditID, posts } = this.state;
        let { page } = this.state;

        axios
            .post("/post/get-more", {
                subredditID,
                page
            })
            .then(data => {
                if (data.data.posts === "No more posts to load") {
                    this.setState({
                        loadPostRequestSent: false
                    });
                    return window.removeEventListener(
                        "scroll",
                        this.handleScroll
                    );
                }
                const loadedPosts = data.data.posts;
                loadedPosts.forEach(post => {
                    posts.push(post);
                });
                page++;
                this.setState({
                    page,
                    posts,
                    loadPostRequestSent: false
                });
            })
            .catch(e => {
                console.log(e);
            });
    };

    handleScroll = () => {
        if (!this.state.subredditDoesntExist) {
            const postsHeight =
                this.postsRef.current.getBoundingClientRect().bottom +
                window.pageYOffset;
            const userHeight = window.pageYOffset + window.innerHeight;
            if (Math.abs(postsHeight - userHeight) <= 50) {
                if (!this.state.loadPostRequestSent) {
                    this.setState({ loadPostRequestSent: true });
                    setTimeout(() => {
                        this.loadPosts();
                    }, 500);
                }
            }
        }
    };

    render() {
        let loadingPosts;
        let subreddit;
        let subredditContent;
        let subredditTheme;

        loadingPosts = this.state.loadPostRequestSent ? <Spinner /> : null;

        if (this.state.posts.length === 0 && !this.props.loading) {
            subredditContent = (
                <div className={classes.subredditNoPosts}>
                    <p className={classes.subredditNoPostsWarning}>
                        No posts added yet. Be the first one to say something!
                    </p>
                </div>

            );
        } else {
            subredditContent = <PostsContainer posts={this.state.posts} />;
        }

        if (!this.props.loading) {
            subredditTheme = (
                <div
                    className={
                        this.state.subredditName === "r/all"
                            ? classes.hidden
                            : classes.subredditTheme
                    }
                >
                    <p className={classes.themeName}>
                        r/{this.state.subredditName}
                    </p>
                </div>
            );
        }

        if (this.state.subredditDoesntExist) {
            subreddit = <PageError message="Subreddit doesn't exist!" />;
        } else {
            subreddit = (
                <div>
                    {subredditTheme}
                    <div
                        ref={this.postsRef}
                        className={classes.subredditContainer}
                    >
                        {subredditContent}
                        <SubredditDescription
                            subName={this.state.subredditName}
                            subDesc={this.state.subredditDesc}
                        />
                    </div>
                    <div>{loadingPosts}</div>
                </div>
            );
        }
        return <Aux>{subreddit}</Aux>;
    }
}

Subreddit.propTypes = {
    loading: PropTypes.bool,
    startLoading: PropTypes.func,
    stopLoading: PropTypes.func,

}

const mapStateToProps = state => {
    return {
        loading: state.loading.loading
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
)(Subreddit);
