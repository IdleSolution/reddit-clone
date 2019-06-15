const express = require("express");
const router = express.Router();
const knex = require("./../database/knex.js");

router.post("/load-info", (req, res) => {
    const { username, page } = req.body;
    knex("users")
        .select("id as userID", "karma", "created_at as createdAt")
        .where({ username })
        .then(user => {
            if(user.length === 0) {
                return res.status(400).json({error: "User doesn't exist!"})
            }

            const userID = user[0].userID;
            knex("posts")
                .select(
                    "posts.id",
                    "posts.title",
                    "posts.date",
                    "posts.comments_count",
                    "post_votes.upvotes",
                    "post_votes.downvotes",
                    "post_votes.karma",
                    "subreddits.name as subredditName"
                )
                .where({ user_id: userID })
                .innerJoin("post_votes", "post_votes.post_id", "posts.id")
                .innerJoin("subreddits", "posts.subreddit_id", "subreddits.id")
                .limit(15)
                .modify(queryBuilder => {
                    if (page) {
                        queryBuilder.offset(page * 15);
                    }
                })
                .orderBy("posts.date", "desc")
                .then(posts => {
                    knex("comments")
                        .select(
                            "comments.text",
                            "comments.date",
                            "comments.id",
                            "comment_votes.upvotes",
                            "comment_votes.downvotes",
                            "comment_votes.karma",
                            "posts.title as commentedOn",
                            "posts.id as commentedOnID",
                            "subreddits.name as subredditName"
                        )
                        .innerJoin(
                            "comment_votes",
                            "comment_votes.comment_id",
                            "comments.id"
                        )
                        .innerJoin("posts", "comments.post_id", "posts.id")
                        .innerJoin(
                            "subreddits",
                            "posts.subreddit_id",
                            "subreddits.id"
                        )
                        .where("comments.user_id", userID)
                        .orderBy("comments.date", "desc")
                        .limit(15)
                        .modify(queryBuilder => {
                            if (page) {
                                queryBuilder.offset(page * 15);
                            }
                        })
                        .then(comments => {
                            const userContent = comments.concat(posts);
                            if(userContent.length === 0 && page) {
                                return res.json({userContent: "No more posts to load"})
                            }
                            userContent.sort(function(a, b) {
                                return new Date(b.date) - new Date(a.date);
                            });
                            if (page) {
                                res.json({
                                    userContent
                                });
                            } else {
                                res.json({
                                    userContent,
                                    user
                                });
                            }
                        });
                });
        })
        .catch(e => res.status(400).json(e));
});


module.exports = router;
