const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Comment, Sequelize } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    
    next();
});

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const posts = await Post.findAll({
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
        
        res.render('board', { 
            user: req.user,
            posts: posts
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/search', async (req, res, next) => {
    try {
        const keyword = req.query.keyword;
        
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['name'],
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }],
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.substring]: keyword
                        }
                    },
                    {
                        content: {
                            [Op.substring]: keyword
                        }
                    },
                    {
                        '$User.name$': {
                            [Op.substring]: keyword
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        
        res.render('board', { 
            user: req.user,
            posts: posts,
            keyword: keyword
        });
    } catch (error) {
        console.error('검색 에러:', error);
        next(error);
    }
});

// 게시글 상세 보기
router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id },
            include: [{
                model: User,
                attributes: ['name']
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }]
        });

        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        res.render('board_detail', { 
            user: req.user,
            post: post
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;