process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("./../../server");
const knex = require("./../../database/knex");

describe("User authentication", () => {
    describe("Register", () => {
        it("Should respond with a success request along with a single user that was added", done => {
            chai.request(server)
                .post("/auth/register")
                .send({
                    username: "test1",
                    password: "test1",
                    passwordRpt: "test1",
                    email: "test1@gmail.com"
                })

                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.equal(200);
                    expect(res).to.be.an("object");
                    expect(res.text).to.include("INSERT");
                    expect(res.request._data).to.include.keys(
                        "username",
                        "password",
                        "passwordRpt",
                        "email"
                    );

                    // Cleaning database
                    knex("users")
                        .del()
                        .where({ username: "test1" })
                        .then(data => data);
                });
            done();
        });

        it("Should throw error when username is already in use", () => {
            chai.request(server)
                .post("/auth/register")
                .send({
                    username: "test",
                    password: "test",
                    passwordRpt: "test",
                    email: "test1@gmail.com"
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(400);
                    expect(res.text).to.include(
                        "User with that username or email already exists."
                    );
                });
        });

        it("Should throw error when email is already in use", () => {
            chai.request(server)
                .post("/auth/register")
                .send({
                    username: "test1",
                    password: "test1",
                    passwordRpt: "test1",
                    email: "test@gmail.com"
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(400);
                    expect(res.text).to.include(
                        "User with that username or email already exists."
                    );
                });
        });

        it("Should put hashed passwords in the database", () => {
            chai.request(server)
                .post("/auth/register")
                .send({
                    username: "test2",
                    password: "test2",
                    passwordRpt: "test2",
                    email: "test2@gmail.com"
                })
                .end((err, res) => {
                    knex("users")
                        .where({ username: res.request._data.username })
                        .then(data => {
                            expect(res.request._data.password).to.not.equal(
                                data[0].password
                            );
                        })

                        // Cleaning database
                        .then(() => {
                            knex("users")
                                .del()
                                .where({ username: "test2" })
                                .then(data => data);
                        });
                });
        });
    });

    describe("Login", () => {
        it("Should throw error when username doesn't exist in the database", () => {
            chai.request(server)
                .post("/auth/login")
                .send({
                    username: "test2",
                    password: "test2"
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(400);
                    expect(res.text).to.include("User not found!");
                });
        });

        it("Should throw error when password is not correct", () => {
            chai.request(server)
                .post("/auth/login")
                .send({
                    username: "test",
                    password: "test2"
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(400);
                    expect(res.text).to.include("Password incorrect");
                });
        });

        it("Should respond with a success message along with user's token", () => {
            chai.request(server)
                .post("/auth/login")
                .send({
                    username: "test",
                    password: "test"
                })
                .end((err, res) => {
                    expect(res).to.be.an("object");
                    expect(res.status).to.equal(200);
                    expect(res.body.success).to.be.true;
                    expect(res.body.token).to.exist;
                    expect(res.body.token).to.include("Bearer")
                });
        });
    });
});
