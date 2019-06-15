const { expect } = require("chai");
const login = require("./../../../api/auth/validation/login");

describe("Checking valid login credentials", () => {
    it("Should return error when username is less than 4 characters", () => {
        const result = login({ username: "tes", password: "test" });
        const errors = result.errors;
        const isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal(
            "Username must be between 4 and 30 characters"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when username is longer than 30 characters", () => {
        const result = login({
            username:
                "isadajmisaokfjmnisoakfjmnasiaokfmjansafoaksamfsioakaafmnsoakisonfsionfass",
            password: "test"
        });
        const errors = result.errors;
        const isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal(
            "Username must be between 4 and 30 characters"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when username field is empty", () => {
        const result = login({ password: "test" });
        const errors = result.errors;
        const isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal("Username field is required");
        expect(isValid).to.equal(false);
    });

    it("Should return error when password field is empty", () => {
        const result = login({ username: "test" });
        const errors = result.errors;
        const isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.password).to.equal("Password field is required");
        expect(isValid).to.equal(false);
    });

    it("Should return error when both password and username fields are empty", () => {
        const result = login({});
        const errors = result.errors;
        const isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal("Username field is required");
        expect(errors.password).to.equal("Password field is required");
        expect(isValid).to.equal(false);
    });

    it("Should pass when every credential is passed correctly", () => {
        const result = login({ username: "test", password: "test" });
        const errors = result.errors;
        const isValid = result.isValid;
        
        expect(errors).to.be.an("object");
        expect(errors).to.be.empty;
        expect(isValid).to.equal(true);
    });
});
