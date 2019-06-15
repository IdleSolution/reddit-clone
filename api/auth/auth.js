const express = require("express");
const router = express.Router();
const validateRegister = require("./validation/register.js");
const validateLogin = require("./validation/login.js");
const bcrypt = require("bcrypt");
const knex = require("./../../database/knex.js");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    if (req.body.password === req.body.passwordRpt) {
        knex("users")
            .select("*")
            .where({ username: req.body.username.toLowerCase() })
            .orWhere({ email: req.body.email.toLowerCase() })
            .then(data => {
                if (data.length !== 0) {
                    errors.username =
                        "User with that username or email already exists.";
                    return res.status(400).json(errors);
                }

                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    if (err) {
                        return res.status(400).json({ errors: err });
                    }

                    knex("users")
                        .insert({
                            username: req.body.username.toLowerCase(),
                            password: hash,
                            email: req.body.email.toLowerCase(),
                            karma: 0,
                            active: true,
                            created_at: new Date()
                        })
                        .then(data => res.json(data))
                        .catch(e => res.json(e));
                });
            });
    } else {
        return res.status(400).json({ error: "Passwords dont match" });
    }
});

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    knex("users")
        .select("*")
        .where({ username: req.body.username.toLowerCase() })
        .then(data => {
            if (data.length === 0) {
                errors.username = "User not found!";
                return res.status(400).json(errors);
            }
            bcrypt
                .compare(req.body.password, data[0].password)
                .then(matches => {
                    if (matches) {
                        const payload = {
                            id: data[0].id,
                            username: data[0].username
                        };
                        jwt.sign(
                            payload,
                            "&<k)I2+d{sV[Nas$KyR|$}DiD`=as(",
                            { expiresIn: 604800 },
                            (err, token) => {
                                if (err) {
                                    error.somethingElse =
                                        "Something went wrong, its not your fault. Try again in some time";
                                    return res.status(400).json(error);
                                }

                                return res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        );
                    } else {
                        errors.password = "Password incorrect";
                        return res.status(400).json(errors);
                    }
                });
        });
});

module.exports = router;
