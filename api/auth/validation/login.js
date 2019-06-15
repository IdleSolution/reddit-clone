const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLogin(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // username
    if (!validator.isLength(data.username, { min: 4, max: 30 })) {
        errors.username = "Username must be between 4 and 30 characters";
    }

    if (validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    //password
    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
