process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("./../server");
const knex = require("./../database/knex");


describe("Posts", () => {
    describe("Routes that require logging in", () => {
        let token;
        before(done => {
            chai.request(server)
                .post("/auth/login")
                .send({
                    username: "test",
                    password: "test"
                })
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        describe("Adding post", () => {
            it("Should add new post to the database", () => {
                chai.request(server)
                    .post("/post/new")
                    .set("Authorization", token)
                    .send({
                        title: "testtest",
                        content: "asomfaspkifmasa",
                        postedBy: 26,
                        subreddit: "test"
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.an("object");
                        expect(res.text).to.include("INSERT");
                        expect(res.body.command).to.equal("INSERT");
                        expect(res.type).to.equal("application/json");

                        // Cleaning database
                        knex("post_votes")
                            .del()
                            .whereNot({ id: 41 })
                            .then(data => {
                                knex("posts")
                                    .del()
                                    .where({ title: "testtest" })
                                    .then(data => data);
                            });
                    });
            });

            it("Should throw error when title of the new post isn't atleast 5 characters long", () => {
                chai.request(server)
                    .post("/post/new")
                    .set("Authorization", token)
                    .send({
                        title: "test",
                        content: "asomfaspkifmasa",
                        postedBy: 26,
                        subreddit: "test"
                    })
                    .end((err, res) => {
                        expect(res).to.be.an("object");
                        expect(res.status).to.equal(400);
                        expect(res.text).to.include(
                            "Title needs to be atleast 5 characters long"
                        );
                    });
            });

            it("Should throw error when given user doesn't exist in the database", () => {
                chai.request(server)
                    .post("/post/new")
                    .set("Authorization", token)
                    .send({
                        title: "testtest",
                        content: "asomfaspkifmasa",
                        postedBy: 21,
                        subreddit: "test"
                    })
                    .end((err, res) => {
                        expect(res).to.be.an("object");
                        expect(res.status).to.equal(400);
                    });
            });

            it("Should throw error when given subreddit doesn't exist in the database", () => {
                chai.request(server)
                    .post("/post/new")
                    .set("Authorization", token)
                    .send({
                        title: "testtest",
                        content: "asomfaspkifmasa",
                        postedBy: 26,
                        subreddit: "test123"
                    })
                    .end((err, res) => {
                        expect(res).to.be.an("object");
                        expect(res.status).to.equal(400);
                    });
            });
        });

        describe("Voting", () => {
            it("Should upvote post and update user's karma", done => {
                chai.request(server)
                    .post("/post/upvote")
                    .set("Authorization", token)
                    .send({
                        postID: 44,
                        userID: 26,
                        karma: 1
                    })
                    .end((err, res) => {
                        expect(res).to.be.an("object");
                        expect(res.status).to.equal(200);

                        knex("post_votes")
                            .where({ id: 41 })
                            .select("karma", "upvotes")
                            .then(data => {
                                const { karma, upvotes } = data[0];

                                expect(karma).to.equal(1);
                                expect(upvotes).to.be.an("array");
                                expect(upvotes).to.include(26);
                                expect(upvotes.length).to.equal(1);

                                knex("users")
                                    .where({ id: 26 })
                                    .select("karma")
                                    .then(data => {
                                        expect(data[0].karma).to.equal(1);

                                        // Cleaning database
                                        knex("post_votes")
                                            .where({ id: 41 })
                                            .update({
                                                upvotes: knex.raw(
                                                    "array_remove(upvotes, ?)",
                                                    [26]
                                                ),
                                                karma: 0
                                            })
                                            .then(data => {
                                                knex("users")
                                                    .where({ id: 26 })
                                                    .update({ karma: 0 })
                                                    .then(data => done());
                                            });
                                    });
                            });
                    });
            });

            it("Should downvote post and update user's karma", (done) => {
                chai.request(server)
                    .post("/post/downvote")
                    .set("Authorization", token)
                    .send({
                        postID: 44,
                        userID: 26,
                        karma: -1
                    })
                    .end((err, res) => {
                        expect(res).to.be.an("object");
                        expect(res.status).to.equal(200);

                        knex("post_votes")
                            .where({ id: 41 })
                            .select("karma", "downvotes")
                            .then(data => {
                                const { karma, downvotes } = data[0];

                                expect(karma).to.equal(-1);
                                expect(downvotes).to.be.an("array");
                                expect(downvotes).to.include(26);
                                expect(downvotes.length).to.equal(1);

                                knex("users")
                                    .where({ id: 26 })
                                    .select("karma")
                                    .then(data => {
                                        expect(data[0].karma).to.equal(-1);

                                        // Cleaning database
                                        knex("post_votes")
                                            .where({ id: 41 })
                                            .update({
                                                downvotes: knex.raw(
                                                    "array_remove(downvotes, ?)",
                                                    [26]
                                                ),
                                                karma: 0
                                            })
                                            .then(data => {
                                                knex("users")
                                                    .where({ id: 26 })
                                                    .update({ karma: 0 })
                                                    .then(data => done());
                                            });
                                    });
                            });
                    });
            });
        });
    });
    describe("Routes that don't require logging in", () => {
        describe("Returning data", () => {
            it("Should return content of a single post", () => {
                chai.request(server)
                    .post("/post/get")
                    .send({ postID: 44 })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.an("object");
                        expect(res.type).to.equal("application/json");
                        expect(res.body.post[0]).to.have.all.keys(
                            "id",
                            "text",
                            "title",
                            "date",
                            "username",
                            "karma",
                            "upvotes",
                            "downvotes"
                        );
                    });
            });

            it("Should throw error when post doesn't exist", () => {
                chai.request(server)
                    .post("/post/get")
                    .send({ postID: 20 })
                    .end((err, res) => {
                        expect(res).to.be.an("object");
                        expect(res.status).to.equal(400);
                        expect(res.error).to.exist;
                    });
            });
        });
    });
});
