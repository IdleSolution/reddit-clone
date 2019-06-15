const validator = require("validator");
const isEmpty = require("./isEmpty.js");

function validateRegister(data) {
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.passwordRpt = !isEmpty(data.passwordRpt) ? data.passwordRpt : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    const errors = {};

    if (!validator.isLength(data.username, { min: 4, max: 16 })) {
        errors.username = "Username must be between 4 and 16 characters";
    }

    if (validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Invalid email";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }

    if (data.password !== data.passwordRpt) {
        errors.passwordRpt = "Passwords must match";
    }

    if (!validator.isLength(data.password, { min: 4, max: 30 })) {
        errors.password = "Password must be between 4 and 30 characters";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (validator.isEmpty(data.passwordRpt)) {
        errors.passwordRpt = "Password repeat field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = validateRegister;
