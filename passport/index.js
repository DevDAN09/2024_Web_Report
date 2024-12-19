const passport = require('passport');
const local = require('./localStrategy');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.number);
    });
    passport.deserializeUser((number, done) => {
        User.findOne({ where: { number } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
}