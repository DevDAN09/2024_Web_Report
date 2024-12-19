const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const path = require('path');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/profile.html'));
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new', {title: '새 게시글 작성', user: req.user});
});

router.get('/', (req, res) => {
    if (req.user) {  // 로그인된 상태
        res.render('index', { 
            user: req.user,
            loginError: null
        });
    } else {  // 로그인되지 않은 상태
        res.render('index', { 
            user: null,
            loginError: null
        });
    }
});

module.exports = router;