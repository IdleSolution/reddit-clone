const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const knex = require("./../database/knex");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "&<k)I2+d{sV[Nas$KyR|$}DiD`=as(";

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            knex("users")
                .select("*")
                .where({ id: jwt_payload.id })
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch(err => err);
        })
    );
};
