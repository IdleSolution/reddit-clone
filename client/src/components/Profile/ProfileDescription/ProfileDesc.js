import React from "react";
import classes from "./ProfileDesc.module.scss";
import PropTypes from "prop-types";

const ProfileDesc = props => {
    return (
        <div className={classes.container}>
            <h2 className={classes.username}>u/{props.username}</h2>
            <div className={classes.infoContainer}>
                <div>
                    <p className={classes.statDesc}>Karma</p>
                    <p>{props.karma}</p>
                </div>
                <div>
                    <p className={classes.statDesc}>Account Created</p>
                    <p>{String(props.createdAt).slice(0, 10)}</p>
                </div>
            </div>
        </div>
    );
};

ProfileDesc.propTypes = {
    karma: PropTypes.number,
    createdAt: PropTypes.string,
    username: PropTypes.string,
}

export default ProfileDesc;
