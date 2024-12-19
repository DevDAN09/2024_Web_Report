const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Post } = require('../models');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// multer 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'public/uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', isLoggedIn, (req, res) => {
    res.render('new', { title: '새 게시글 작성', user: req.user });
});

router.post('/', isLoggedIn, upload.single('image'), async (req, res, next) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            throw new Error('제목과 내용을 모두 입력해주세요.');
        }

        const post = await Post.create({
            title,
            content,
            img: req.file ? `/uploads/${req.file.filename}` : null,
            userId: req.user.number
        });
        
        res.redirect('/board');
    } catch (error) {
        console.error(error);
        res.render('new', { 
            error: error.message,
            user: req.user,
            title: req.body.title,
            content: req.body.content
        });
    }
});

module.exports = router;