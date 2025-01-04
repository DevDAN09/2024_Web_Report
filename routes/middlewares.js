exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } 
    
    if (req.path === '/') {
        return next();
    }

    res.status(403).send('로그인 필요');
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}