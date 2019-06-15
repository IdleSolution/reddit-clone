const { expect } = require("chai");
const register = require("./../../../api/auth/validation/register");

describe("Checking valid register credentials", () => {
    it("Should return error when username is less than 4 characters", () => {
        result = register({
            username: "tes",
            password: "test",
            passwordRpt: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal(
            "Username must be between 4 and 16 characters"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when username is longer than 16 characters", () => {
        result = register({
            username: "testtesttesttesttest",
            password: "test",
            passwordRpt: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal(
            "Username must be between 4 and 16 characters"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when password is less than 4 characters", () => {
        result = register({
            username: "test",
            password: "tes",
            passwordRpt: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.password).to.equal(
            "Password must be between 4 and 30 characters"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when password is longer than 30 characters", () => {
        result = register({
            username: "test",
            password:
                "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
            passwordRpt: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.password).to.equal(
            "Password must be between 4 and 30 characters"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when username field is empty", () => {
        result = register({
            password: "test",
            passwordRpt: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.username).to.equal("Username field is required");
        expect(isValid).to.equal(false);
    });

    it("Should return error when password field is empty", () => {
        result = register({
            username: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.password).to.equal("Password field is required");
        expect(isValid).to.equal(false);
    });

    it("Should return error when e-mail field is empty", () => {
        result = register({
            username: "test",
            password: "test",
            passwordRpt: "test"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.email).to.equal("Email field is required");
        expect(isValid).to.equal(false);
    });

    it("Should return error when passwordRpt field is empty", () => {
        result = register({
            username: "test",
            password: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.passwordRpt).to.equal(
            "Password repeat field is required"
        );
        expect(isValid).to.equal(false);
    });

    it("Should return error when password isn't identical to passwordRpt", () => {
        result = register({
            username: "test",
            password: "test",
            passwordRpt: "test1",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.passwordRpt).to.equal("Passwords must match");
        expect(isValid).to.equal(false);
    });

    it("Should return error when email isn't in correct format", () => {
        result = register({
            username: "test",
            password: "test",
            passwordRpt: "test",
            email: "testgmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors.email).to.equal("Invalid email");
        expect(isValid).to.equal(false);
    });

    it("Should pass when every credential is passed correctly", () => {
        result = register({
            username: "test",
            password: "test",
            passwordRpt: "test",
            email: "test@gmail.com"
        });
        errors = result.errors;
        isValid = result.isValid;

        expect(errors).to.be.an("object");
        expect(errors).to.be.empty;
        expect(isValid).to.be.true;
    });
});
