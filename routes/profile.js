const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Post, User, Comment } = require('../models');

const router = express.Router();

router.get('/info', isLoggedIn, async (req, res, next) => {
    try {
        // 사용자의 게시글 조회
        const posts = await Post.findAll({
            where: { userId: req.user.number },
            include: [{
                model: User,
                attributes: ['name']
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        // 응답 데이터 구성
        res.json({
            user: {
                user_id: req.user.user_id,
                name: req.user.name,
                email: req.user.email
            },
            posts: posts,
            postCount: posts.length
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router; 