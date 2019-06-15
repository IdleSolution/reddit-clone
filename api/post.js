const express = require("express");
const router = express.Router();
const knex = require("./../database/knex.js");
const passport = require("passport");

router.post(
    "/new",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        if (req.body.title.length < 5) {
            return res
                .status(400)
                .json({ err: "Title needs to be atleast 5 characters long" });
        }
        knex("subreddits")
            .select("id")
            .where({ name: req.body.subreddit })
            .then(data => {
                const subredditID = data[0].id;
                const text = req.body.content;
                const title = req.body.title;
                const userID = req.body.postedBy;
                const date = new Date();
                knex("posts")
                    .returning("id")
                    .insert({
                        title: title,
                        text: text,
                        user_id: userID,
                        subreddit_id: subredditID,
                        date: date
                    })
                    .then(id => {
                        knex("post_votes")
                            .insert({
                                post_id: id[0],
                                upvotes: [],
                                downvotes: []
                            })
                            .then(post => res.json(post))
                            .catch(e => res.status(400).json(e));
                    })
                    .catch(e => res.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
    }
);

router.post("/get", (req, res) => {
    const postID = req.body.postID;
    knex("posts")
        .select(
            "posts.id",
            "posts.text",
            "posts.title",
            "posts.date",
            "users.username",
            "post_votes.karma as karma",
            "post_votes.upvotes",
            "post_votes.downvotes"
        )
        .where("posts.id", postID)
        .innerJoin("users", "posts.user_id", "users.id")
        .innerJoin("post_votes", "posts.id", "post_votes.post_id")
        .then(post => {
            if (post[0].length === 0) {
                return res.status(400).json({ error: "Post doesn't exist" });
            }
            knex("comments")
                .select(
                    "comments.id",
                    "comments.text",
                    "comments.date",
                    "users.username",
                    "comment_votes.karma",
                    "comment_votes.upvotes",
                    "comment_votes.downvotes"
                )
                .innerJoin(
                    "comment_votes",
                    "comment_votes.comment_id",
                    "comments.id"
                )
                .where({ post_id: postID })
                .innerJoin("users", "comments.user_id", "users.id")
                .orderBy("comment_votes.karma", "desc")
                .then(comments => {
                    res.json({
                        post,
                        comments
                    });
                })
                .catch(e => res.status(400).json(e));
        })
        .catch(e => res.status(400).json(e));
});

router.post("/get-more", (req, res) => {
    const { page, subredditID } = req.body;
    knex("posts")
        .select(
            "posts.id",
            "posts.title",
            "posts.date",
            "posts.comments_count",
            "post_votes.karma",
            "post_votes.upvotes",
            "post_votes.downvotes",
            "subreddits.name as subredditName"
        )
        .limit(15)
        .offset(15 * page)
        .modify(queryBuilder => {
            if (subredditID) {
                queryBuilder.where({ subreddit_id: subredditID });
            }
        })
        .orderBy("posts.date", "desc")
        .innerJoin("post_votes", "posts.id", "post_id")
        .innerJoin("subreddits", "posts.subreddit_id", "subreddits.id")
        .then(data => {
            if (data.length === 0) {
                return res.json({ posts: "No more posts to load" });
            }
            return res.json({
                posts: data
            });
        })
        .catch(e => res.status(400).json(e));
});

router.post("/load-all", (req, res) => {
    const { userID } = req.body;
    knex("posts")
        .select(
            "posts.id",
            "posts.title",
            "posts.date",
            "posts.comments_count",
            "users.username",
            "post_votes.karma",
            "post_votes.upvotes",
            "post_votes.downvotes",
            "subreddits.name as subredditName"
        )
        .limit(15)
        .orderBy("posts.date", "desc")
        .modify(queryBuilder => {
            if (userID) {
                queryBuilder.where({ user_id: userID });
            }
        })
        .innerJoin("users", "posts.user_id", "users.id")
        .innerJoin("post_votes", "posts.id", "post_id")
        .innerJoin("subreddits", "posts.subreddit_id", "subreddits.id")
        .then(data => {
            res.json({
                posts: data
            });
        });
});

router.post(
    "/upvote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { postID, userID, karma, doubleKarma } = req.body;
        knex("post_votes")
            .where({ post_id: postID })
            .update({
                upvotes: knex.raw("array_append(upvotes, ?)", [userID]),
                downvotes: knex.raw("array_remove(downvotes, ?)", [userID]),
                karma: karma
            })
            .then(data => {
                knex("users")
                    .where({
                        id: userID
                    })
                    .modify(queryBuilder => {
                        if (doubleKarma) {
                            queryBuilder.increment({ karma: 2 });
                        } else {
                            queryBuilder.increment({ karma: 1 });
                        }
                    })
                    .then(data => {
                        res.json(data);
                    })
                    .catch(e => res.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
    }
);

router.post(
    "/downvote",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { postID, userID, karma, doubleKarma } = req.body;
        knex("post_votes")
            .where({ post_id: postID })
            .update({
                downvotes: knex.raw("array_append(downvotes, ?)", [userID]),
                upvotes: knex.raw("array_remove(upvotes, ?)", [userID]),
                karma: karma
            })
            .then(data => {
                knex("users")
                    .where({
                        id: userID
                    })
                    .modify(queryBuilder => {
                        if (doubleKarma) {
                            queryBuilder.decrement({ karma: 2 });
                        } else {
                            queryBuilder.decrement({ karma: 1 });
                        }
                    })
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
        const { postID, userID, karma, removing } = req.body;
        knex("post_votes")
            .where({ post_id: postID })
            .update({
                upvotes: knex.raw("array_remove(upvotes, ?)", [userID]),
                downvotes: knex.raw("array_remove(downvotes, ?)", [userID]),
                karma
            })
            .then(data => {
                knex("users")
                    .where({ id: userID })
                    .modify(queryBuilder => {
                        if (removing === "upvote") {
                            queryBuilder.decrement({ karma: 1 });
                        } else {
                            queryBuilder.increment({ karma: 1 });
                        }
                    })
                    .then(data => {
                        res.json(data);
                    })
                    .catch(e => e.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
    }
);

module.exports = router;
