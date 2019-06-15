import React, { Component } from "react";
import classes from "./SearchedSubreddits.module.scss";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class SearchedSubreddits extends Component {
    constructor(props) {
        super(props);
        this.box = React.createRef();
        this.state = {
            closed: true,
            subreddits: []
        };
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ subreddits: nextProps.subreddits });
    }

    closeBox = () => {
        if (!this.state.closed) {
            this.setState({ closed: true });
        }
    };

    openBox = () => {
        if (this.state.closed) {
            this.setState({ closed: false });
        }
    };

    handleClick = e => {
        if(this.box.current.contains(e.target)) {
            return setTimeout(() => {
                this.setState({ closed: true, subreddits: [] });
            }, 300)
            
        }
        if (!this.state.closed) {
            this.setState({ closed: true, subreddits: [] });
        }
    };

    render() {
        let subreddits;
        if (this.state.subreddits.length === 0) {
            this.closeBox();
        } else {
            this.openBox();
            subreddits = this.state.subreddits.map(subreddit => (
                <Link to={`/r/${subreddit.name}`}>
                    <div className={classes.singlePost}>
                        <p className={classes.name}>r/{subreddit.name}</p>
                        <p className={classes.description}>
                            {subreddit.description.length < 40 ? subreddit.description : subreddit.description.slice(0, 40) + "..."}
                        </p>
                    </div>
                </Link>
            ));
        }
        return (
            <div
                className={
                    !this.state.closed ? classes.wrapper : classes.hidden
                }
                ref={this.box}
            >
                <div className={classes.container}>{subreddits}</div>
            </div>
        );
    }
}

SearchedSubreddits.propTypes = {
    subreddits: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.number,
        moderator: PropTypes.number,
        
    })),
}

export default SearchedSubreddits;
