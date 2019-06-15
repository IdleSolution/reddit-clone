const express = require("express");
const router = express.Router();
const knex = require("./../database/knex");
const passport = require("passport");

router.post(
    "/new",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { text, post_id, user_id } = req.body;
        if (text.length === 0) {
            return res.status(400).json({ error: "Your comment can't be empty" });
        }
        knex("comments")
            .returning("id")
            .insert({ text, post_id, user_id, date: new Date() })
            .then(id => {
                knex("comment_votes")
                    .insert({
                        comment_id: id[0],
                        upvotes: [],
                        downvotes: []
                    })
                    .then(data => {
                        knex("posts")
                            .where({ id: post_id })
                            .increment({ comments_count: 1 })
                            .then(x => {
                                res.json(data);
                            });
                    })

                    .catch(e => res.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
    }
);

router.post(
    "/upvote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { postID, userID, karma } = req.body;
        knex("comment_votes")
            .where({ comment_id: postID })
            .update({
                upvotes: knex.raw("array_append(upvotes, ?)", [userID]),
                downvotes: knex.raw("array_remove(downvotes, ?)", [userID]),
                karma
            })
            .then(data => {
                knex("users")
                    .where({
                        id: userID
                    })
                    .increment({ karma: 1 })
                    .then(data => {
                        res.json(data);
                    })
                    .catch(e => res.status(400).json(e));
            })
            .catch(e => console.log(e));
    }
);

router.post(
    "/downvote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { postID, userID, karma } = req.body;
        knex("comment_votes")
            .where({ comment_id: postID })
            .update({
                downvotes: knex.raw("array_append(downvotes, ?)", [userID]),
                upvotes: knex.raw("array_remove(upvotes, ?)", [userID]),
                karma
            })
            .then(data => {
                knex("users")
                    .where({
                        id: userID
                    })
                    .decrement({ karma: 1 })
                    .then(data => {
                        res.json(data);
                    })
                    .catch(e => res.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
    }
);

router.post(
    "/remove-vote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { postID, userID, karma } = req.body;
        knex("comment_votes")
            .where({ comment_id: postID })
            .update({
                upvotes: knex.raw("array_remove(upvotes, ?)", [userID]),
                downvotes: knex.raw("array_remove(downvotes, ?)", [userID]),
                karma
            })
            .then(data => {
                knex("users")
                    .where({
                        id: userID
                    })
                    .decrement({ karma: 1 })
                    .then(data => {
                        res.json(data);
                    })
                    .catch(e => res.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
    }
);

module.exports = router;
