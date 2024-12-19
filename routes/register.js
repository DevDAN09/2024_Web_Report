const express = require('express');
const crypto = require('crypto'); // SHA-256 암호화를 위한 모듈
const { User } = require('../models');

const router = express.Router();

router.route('/')
    .post(async (req, res, next) => {
        try {
            // 이메일 중복 체크
            const existingEmail = await User.findOne({
                where: { email: req.body.email }
            });
            if (existingEmail) {
                return res.render('error', {message: '이미 존재하는 이메일입니다.'});
            }

            // 사용자 아이디 중복 체크
            const existingUserId = await User.findOne({
                where: { user_id: req.body.user_id }
            });
            if (existingUserId) {
                return res.render('error', {message: '이미 존재하는 아이디입니다.'});
            }

            // 사용자 이름 중복 체크
            const existingName = await User.findOne({
                where: { name: req.body.name }
            });
            if (existingName) {
                return res.render('error', {message: '이미 존재하는 이름입니다.'});
            }

            // 비밀번호 SHA-256 해시화
            const hashedPassword = crypto.createHash('sha256')
                                         .update(req.body.password)
                                         .digest('hex'); // 비밀번호 해시값 생성

            // 중복이 없는 경우 사용자 생성
            const user = await User.create({
                email: req.body.email,
                name: req.body.name,
                user_id: req.body.user_id,
                password: hashedPassword // 해시된 비밀번호 저장
            });

            return res.render('success', {name: req.body.name});
        } catch (err) {
            console.error(err);
            return res.render('error', {message: '회원가입 중 오류가 발생했습니다.'});
        }
});

module.exports = router;
