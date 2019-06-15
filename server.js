const express = require("express");
const app = express();
const knex = require("./database/knex.js");
const port = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const path = require('path');

const auth = require("./api/auth/auth");
const subreddit = require("./api/subreddit");
const post = require("./api/post");
const comment = require("./api/comment");
const profile = require("./api/profile");

const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const passport = require("passport");
app.use(passport.initialize());
require("./config/passport")(passport);

app.use(express.static(path.join(__dirname, '/client/build')))


app.use("/auth", auth);
app.use("/r", subreddit);
app.use("/post", post);
app.use("/comment", comment);
app.use("/profile", profile);

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = app;
