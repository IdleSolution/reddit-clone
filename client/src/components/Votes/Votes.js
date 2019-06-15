import React, { Component } from "react";
import classes from "./Votes.module.scss";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";

class Votes extends Component {
    state = {
        karma: 0,
        upvoted: false,
        downvoted: false,
        votingOn: ""
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.onMount) {
            this.setState({
                karma: nextProps.karma,
                upvoted: nextProps.upvotes.includes(nextProps.user.id),
                downvoted: nextProps.downvotes.includes(nextProps.user.id),
                votingOn: nextProps.votingOn
            });
        }
    }

    componentDidMount() {
        if (this.props.onMount) {
            this.setState({
                karma: this.props.karma,
                upvoted: this.props.upvotes.includes(this.props.user.id),
                downvoted: this.props.downvotes.includes(this.props.user.id),
                votingOn: this.props.votingOn
            });
        }
    }

    // vote variable needs to be upvote, downvote or remove-vote
    sendVoteRequest = (vote, removing, doubleKarma) => {
        const link = `/${this.state.votingOn}/${vote}`;
        setTimeout(() => {
            axios
                .post(link, {
                    userID: this.props.user.id,

                    // postID is both post and comment ID depending on context
                    postID: this.props.postID,
                    karma: this.state.karma,

                    // User can remove either upvote or downvote
                    removing: removing,

                    // Either true or false, determines whetever user should get 1 or 2 karma
                    doubleKarma: doubleKarma
                })
                .catch(e => {
                    console.log(e.response);
                });
        }, 300);
    };

    onUpvote = () => {
        let { karma } = this.state;
        if (this.state.upvoted) {
            karma--;
            this.setState({ karma, upvoted: false });
            this.sendVoteRequest("remove-vote", "upvote");
        } else if (this.state.downvoted) {
            karma = karma + 2;
            this.setState({ karma, upvoted: true, downvoted: false });
            this.sendVoteRequest("upvote", null, true);
        } else {
            karma++;
            this.setState({ karma, upvoted: true });
            this.sendVoteRequest("upvote");
        }

        if (this.state.votingOn === "comment") {
            this.props.onKarmaChange(karma);
        }
    };

    onDownvote = () => {
        let { karma } = this.state;
        if (this.state.downvoted) {
            karma++;
            this.setState({ karma, downvoted: false });
            this.sendVoteRequest("remove-vote", "downvote");
        } else if (this.state.upvoted) {
            karma = karma - 2;
            this.setState({ karma, downvoted: true, upvoted: false });
            this.sendVoteRequest("downvote", null, true);
        } else {
            karma--;
            this.setState({ karma, downvoted: true });
            this.sendVoteRequest("downvote");
        }

        if (this.state.votingOn === "comment") {
            this.props.onKarmaChange(karma);
        }
    };

    render() {
        const scoreClass =
            this.props.karma || this.props.karma === 0
                ? classes.voteScore
                : classes.voteHidden;
        const upvoteClass = this.state.upvoted
            ? ["fas", "fa-chevron-up", classes.vote, classes.redVote].join(" ")
            : ["fas", "fa-chevron-up", classes.vote].join(" ");
        const downvoteClass = this.state.downvoted
            ? ["fas", "fa-chevron-down", classes.vote, classes.redVote].join(
                  " "
              )
            : ["fas", "fa-chevron-down", classes.vote].join(" ");
        return (
            <div className={classes.votes}>
                <i onClick={this.onUpvote} className={upvoteClass} />
                <p className={scoreClass}>
                    {(this.state.karma || this.state.karma === 0) &&
                    this.state.votingOn === "post"
                        ? this.state.karma
                        : null}
                </p>
                <i onClick={this.onDownvote} className={downvoteClass} />
            </div>
        );
    }
}

Votes.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        id: PropTypes.number,
    }),
    karma: PropTypes.number,
    userID: PropTypes.number,
    upvotes: PropTypes.arrayOf(PropTypes.number),
    downvotes: PropTypes.arrayOf(PropTypes.number),
    votingOn: PropTypes.string,
    onKarmaChange: PropTypes.func,

}

const mapDispatchToProps = state => {
    return {
        user: state.auth.user
    };
};

export default connect(mapDispatchToProps)(Votes);
