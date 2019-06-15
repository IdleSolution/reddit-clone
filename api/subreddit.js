const express = require("express");
const router = express.Router();
const knex = require("./../database/knex.js");
const passport = require("passport");

router.post(
    "/new",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};
        if (
            !req.body.subredditName ||
            req.body.subredditName.length > 21 ||
            req.body.subredditName.length < 4
        ) {
            errors.name =
                "Subreddit's name must be between 3 and 20 characters";
            return res.status(400).json(errors);
        }
        knex("subreddits")
            .select("*")
            .where({ name: req.body.subredditName.toLowerCase() })
            .then(data => {
                if (data.length !== 0) {
                    errors.name = "Subreddit with that name already exists";
                    return res.status(400).json(errors);
                }

                knex("subreddits")
                    .insert({
                        name: req.body.subredditName,
                        description: req.body.subredditDescription,
                        moderator: req.body.user_id
                    })
                    .then(data => {
                        return res.json({ data });
                    })
                    .catch(e => {
                        return res.json(e);
                    });
            });
    }
);

router.post("/all-subreddits", (req, res) => {
    knex("subreddits")
        .select("*")
        .then(data => {
            return res.json({ data });
        });
});

router.post("/search", (req, res) => {
    knex("subreddits")
        .where("name", "like", `%${req.body.match}%`)
        .limit(5)
        .then(data => {
            res.json(data);
        });
});

router.post("/:name", (req, res) => {
    subredditName = req.params.name;
    knex("subreddits")
        .select("*")
        .where({ name: subredditName })
        .then(subreddit => {
            if (subreddit.length === 0) {
                error = "Subreddit doesn't exist";
                return res.status(400).json({ error: error });
            }
            subredditID = subreddit[0].id;
            subredditDesc = subreddit[0].description;
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
                .where({ subreddit_id: subredditID })
                .orderBy("posts.date", "desc")
                .innerJoin("users", "posts.user_id", "users.id")
                .innerJoin("post_votes", "posts.id", "post_id")
                .innerJoin("subreddits", "posts.subreddit_id", "subreddits.id")
                .then(data => {
                    res.json({
                        subredditDescription: subredditDesc,
                        subredditName: subredditName,
                        subredditID: subredditID,
                        posts: data
                    });
                })
                .catch(e => res.status(400).json(e));
        });
});

module.exports = router;
