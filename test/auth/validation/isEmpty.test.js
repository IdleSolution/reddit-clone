const { expect } = require("chai");
const isEmpty = require("./../../../api/auth/validation/isEmpty");

describe("isEmpty function", () => {
    describe("Returning false", () => {
        it("Should return false when array is not empty", () => {
            const result = isEmpty(["test", 1]);
            expect(result).to.equal(false);
        });

        it("Should return false when object is not empty", () => {
            const result = isEmpty({ test: 1 });
            expect(result).to.equal(false);
        });

        it("Should return false when number is provided", () => {
            const result = isEmpty(1);
            expect(result).to.equal(false);
        });
    });

    describe("Returning true", () => {
        it("Should return true when array is empty", () => {
            const result = isEmpty([]);
            expect(result).to.equal(true);
        });

        it("Should return true when object is empty", () => {
            const result = isEmpty({});
            expect(result).to.equal(true);
        });

        it("Should return true when undefined is provided", () => {
            const result = isEmpty(undefined);
            expect(result).to.equal(true);
        });

        it("Should return true when null is provided", () => {
            const result = isEmpty(null);
            expect(result).to.equal(true);
        });
    });
});
