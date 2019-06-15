process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("./../server");
const knex = require("./../database/knex");

describe("Subreddits", () => {
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

        it("Should add new subreddit to the database", () => {
            chai.request(server)
                .post("/r/new")
                .send({
                    subredditName: "testtest1",
                    subredditDescription: "zzzzzzzzz",
                    user_id: 26
                })
                .set("Authorization", token)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body.data.command).to.equal("INSERT");

                    knex("subreddits")
                        .del()
                        .where({ name: "testtest1" })
                        .then(data => data);
                });
        });

        it("Should throw error when subreddit's name is less than 3 characters", () => {
            chai.request(server)
                .post("/r/new")
                .send({
                    subredditName: "tes",
                    subredditDescription: "jaskndsada",
                    user_id: 26
                })
                .set("Authorization", token)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body.name).to.equal(
                        "Subreddit's name must be between 3 and 20 characters"
                    );
                });
        });

        it("Should throw error when subreddit's name is longer than 20 characters", () => {
            chai.request(server)
                .post("/r/new")
                .send({
                    subredditName:
                        "uasijndbasjufdnasjukfnsaujkfnsuajsadkafnksalasd",
                    subredditDescription: "jaskndsada",
                    user_id: 26
                })
                .set("Authorization", token)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body.name).to.equal(
                        "Subreddit's name must be between 3 and 20 characters"
                    );
                });
        });

        it("Should throw error when subreddit's name is already taken", () => {
            chai.request(server)
                .post("/r/new")
                .send({
                    subredditName: "test",
                    subredditDescription: "jaskndsada",
                    user_id: 26
                })
                .set("Authorization", token)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body.name).to.equal(
                        "Subreddit with that name already exists"
                    );
                });
        });
    });

    describe("Routes that don't require logging in", () => {
        it("Should return all subreddits that exist in the database", () => {
            chai.request(server)
                .post("/r/all-subreddits")
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body.data).to.be.an("array");
                    expect(res.body.data[0]).to.be.an("object");
                    expect(res.body.data[0]).to.have.all.keys(
                        "id",
                        "name",
                        "description",
                        "moderator"
                    );
                });
        });

        it("Should return all subreddits that matched certain pattern", () => {
            chai.request(server)
                .post("/r/search")
                .send({
                    match: "te"
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.an("object");
                    expect(res.body).to.be.an("array");

                    const data = res.body[0];

                    expect(data).to.be.an("object");
                    expect(data).have.all.keys(
                        "id",
                        "name",
                        "description",
                        "moderator"
                    );
                    expect(data.name).to.equal("test");
                });
        });

        it("Should return info and posts of subbreddit", () => {
            chai.request(server)
                .post("/r/test")
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body).to.be.an("object");
                    expect(res.body).to.have.all.keys(
                        "subredditDescription",
                        "subredditName",
                        "subredditID",
                        "posts"
                    );
                    expect(res.body.posts).to.be.an("array");

                    const post = res.body.posts[0];

                    expect(post).to.be.an("object");
                    expect(post).to.have.all.keys(
                        "id",
                        "title",
                        "date",
                        "comments_count",
                        "username",
                        "karma",
                        "upvotes",
                        "downvotes",
                        "subredditName"
                    );
                });
        });

        it("Should throw error when subreddit doesn't exist", () => {
            chai.request(server)
                .post("/r/randomthing")
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal("application/json");
                    expect(res).to.be.an("object");
                    expect(res.body.error).to.equal("Subreddit doesn't exist");
                });
        });
    });
});
