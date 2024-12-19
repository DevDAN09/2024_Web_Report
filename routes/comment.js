const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Post, User, Comment } = require('../models');

const router = express.Router();

router.get('/:id', isLoggedIn, async (req, res, next) => {
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

// 댓글 작성 API
router.post('/:postId', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.postId } });
        if (!post) {
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        const comment = await Comment.create({
            content: req.body.content,
            postId: req.params.postId,
            userId: req.user.number,
        });

        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['name']
            }]
        });
        res.redirect(`/board`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 댓글 삭제 API
router.delete('/:commentId', isLoggedIn, async (req, res, next) => {
    try {
        const comment = await Comment.findOne({ 
            where: { 
                id: req.params.commentId,
                userId: req.user.number 
            }
        });

        if (!comment) {
            return res.status(404).json({ error: '댓글을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }

        await comment.destroy();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 댓글 수정 API
router.put('/:commentId', isLoggedIn, async (req, res, next) => {
    try {
        const comment = await Comment.findOne({ 
            where: { 
                id: req.params.commentId,
                userId: req.user.number 
            }
        });

        if (!comment) {
            return res.status(404).json({ error: '댓글을 찾을 수 없거나 수정 권한이 없습니다.' });
        }

        await comment.update({
            content: req.body.content
        });

        res.json({ 
            success: true,
            comment: {
                id: comment.id,
                content: comment.content,
                updatedAt: comment.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router; 