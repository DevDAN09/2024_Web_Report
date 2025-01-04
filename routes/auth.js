const express = require('express');
const passport = require('passport');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.render('index', {loginError: info.message});
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.render('index', {user});
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.redirect('/');
        });
        
    });
});


module.exports = router;