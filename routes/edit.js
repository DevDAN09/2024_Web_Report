const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Comment, Sequelize } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

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

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id }
        });

        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        if (post.userId !== req.user.number) {
            return res.status(403).send('권한이 없습니다.');
        }

        res.render('edit', { post, user: req.user });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id', isLoggedIn, upload.single('image'), async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        
        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
        
        if (post.userId !== req.user.number) {
            return res.status(403).send('권한이 없습니다.');
        }

        let imgPath = post.img;

        if (req.body.deleteImage === 'on' && post.img) {
            await fs.unlink(path.join('public', post.img));
            imgPath = null;
        }
        
        if (req.file) {
            if (post.img) {
                try {
                    await fs.unlink(path.join('public', post.img));
                } catch (error) {
                    console.error('기존 이미지 삭제 실패:', error);
                }
            }
            imgPath = `/uploads/${req.file.filename}`;
        }

        await Post.update({
            title: req.body.title,
            content: req.body.content,
            img: imgPath
        }, {
            where: { 
                id: req.params.id,
                userId: req.user.number
            }
        });

        res.redirect('/board');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        
        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
        
        if (post.userId !== req.user.number) {
            return res.status(403).send('권한이 없습니다.');
        }

        // 이미지가 있으면 삭제
        if (post.img) {
            try {
                await fs.unlink(path.join('public', post.img));
            } catch (error) {
                console.error('이미지 삭제 실패:', error);
            }
        }

        await Post.destroy({ where: { id: req.params.id } });
        res.status(200).send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;