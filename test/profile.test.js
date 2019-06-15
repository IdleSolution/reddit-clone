process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const server = require("./../server");

describe("Profile", () => {
    describe("Succesfully returning data", () => {
        let data;
        before(done => {
            chai.request(server)
                .post("/profile/load-info")
                .send({
                    username: "test",
                    page: 0
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body.user).to.be.an("array");
                    expect(res.body.userContent).to.be.an("array");
                    data = res.body;
                    done();
                });
        });

        it("Should return info about user", () => {
            const userInfo = data.user[0];
            expect(userInfo).to.be.an("object");
            expect(userInfo).to.have.all.keys("userID", "karma", "createdAt");
        });

        it("Should return posts made by the user", () => {
            const userContent = data.userContent;
            let post;

            // Separating post from comment
            userContent.forEach((obj, i) => {
                if (obj.comments_count) {
                    post = userContent[i];
                }
            });

            expect(post).to.be.an("object");
            expect(post).to.have.all.keys(
                "id",
                "title",
                "date",
                "comments_count",
                "upvotes",
                "downvotes",
                "karma",
                "subredditName"
            );
        });

        it("Should return 15 or less content made by the user", () => {
            const userContent = data.userContent;
            expect(userContent.length).to.be.lessThan(16);
        });
    });

    describe("Errors", () => {
        it("Should throw error when user doesn't exist in the database", () => {
            chai.request(server)
                .post("/profile/load-info")
                .send({
                    username: "asdfg",
                    page: 0
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res).to.be.an("object");
                    expect(res.body.error).to.exist;
                    expect(res.body.error).to.equal("User doesn't exist!");
                });
        });

        it("Should inform when there is no more content on the next page", () => {
            chai.request(server)
            .post("/profile/load-info")
            .send({
                username: "test",
                page: 1
            })
            .end((err, res) => {
                expect(res).to.be.an("object");
                expect(res.body.userContent).to.equal("No more posts to load");
            });
        })
    });
});
