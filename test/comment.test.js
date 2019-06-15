process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("./../server");
const knex = require("./../database/knex");

describe("Comments", () => {
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

    it("Should add new comment to the database", () => {
        chai.request(server)
            .post("/comment/new")
            .set("Authorization", token)
            .send({
                text: "testtest",
                post_id: 44,
                user_id: 510
            })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res).to.be.an("object");
                expect(res.type).to.equal("application/json");
                expect(res.body.command).to.equal("INSERT");
                expect(res.request._data).to.have.all.keys(
                    "text",
                    "post_id",
                    "user_id"
                );

                // Cleaning database
                knex("comment_votes")
                    .del()
                    .whereNot({ id: 29 })
                    .then(data => {
                        knex("comments")
                            .where({ text: "testtest" })
                            .del()
                            .then(data => data);
                    });
            });
    });

    it("Should throw error when comment is empty", () => {
        chai.request(server)
            .post("/comment/new")
            .set("Authorization", token)
            .send({
                text: "",
                post_id: 44,
                user_id: 510
            })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res).to.be.an("object");
                expect(res.type).to.equal("application/json");
                expect(res.text).to.include("Your comment can't be empty");
            });
    });

    describe("Voting", () => {
        it("Should upvote comment and update user's karma", (done) => {
            chai.request(server)
                .post("/comment/upvote")
                .set("Authorization", token)
                .send({
                    postID: 29,
                    userID: 510,
                    karma: 1
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(200);

                    knex("comment_votes")
                        .where({ id: 29 })
                        .select("karma", "upvotes")
                        .then(data => {
                            const { karma, upvotes } = data[0];

                            expect(karma).to.equal(1);
                            expect(upvotes).to.be.an("array");
                            expect(upvotes).to.include(510);
                            expect(upvotes.length).to.equal(1);

                            //Cleaning database
                            knex("comment_votes")
                                .where({ id: 29 })
                                .update({
                                    upvotes: knex.raw(
                                        "array_remove(upvotes, ?)",
                                        [510]
                                    ),
                                    karma: 0
                                })
                                .then(data => {
                                    knex("users")
                                        .where({ id: 510 })
                                        .update({ karma: 0 })
                                        .then(data => done());
                                });
                        });
                });
        });

        it("Should downvote comment and update user's karma", (done) => {
            chai.request(server)
                .post("/comment/upvote")
                .set("Authorization", token)
                .send({
                    postID: 29,
                    userID: 510,
                    karma: -1
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(200);

                    knex("comment_votes")
                        .where({ id: 29 })
                        .select("karma", "upvotes")
                        .then(data => {
                            const { karma, upvotes } = data[0];

                            expect(karma).to.equal(-1);
                            expect(upvotes).to.be.an("array");
                            expect(upvotes).to.include(510);
                            expect(upvotes.length).to.equal(1);

                            //Cleaning database
                            knex("comment_votes")
                                .where({ id: 29 })
                                .update({
                                    upvotes: knex.raw(
                                        "array_remove(downvotes, ?)",
                                        [510]
                                    ),
                                    karma: 0
                                })
                                .then(data => {
                                    knex("users")
                                        .where({ id: 510 })
                                        .update({ karma: 0 })
                                        .then(data => done());
                                });
                        });
                });
        });
    });
});
