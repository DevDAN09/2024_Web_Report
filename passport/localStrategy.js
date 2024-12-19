const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'user_id',
        passwordField: 'password',
    }, async (user_id, password, done) => {
        try {
            const user = await User.findOne({ where: { user_id } });
            if (!user) {
                return done(null, false, { message: '존재하지 않는 사용자입니다.' });
            }

            // 입력된 비밀번호를 SHA-256으로 해시화
            const hashedInputPassword = crypto.createHash('sha256')
                                            .update(password)
                                            .digest('hex');
            
            // 저장된 해시값과 비교
            if (hashedInputPassword === user.password) {
                return done(null, user);
            } else {
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }));
};