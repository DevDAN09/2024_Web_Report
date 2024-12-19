const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');

require('dotenv').config();
const passport = require('passport');
const passportConfig = require('./passport');
const { isLoggedIn, isNotLoggedIn } = require('./routes/middlewares');

const RegisterRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const pageRouter = require('./routes/page');
const boardRouter = require('./routes/board');
const editRouter = require('./routes/edit');
const newRouter = require('./routes/new');
const profileRouter = require('./routes/profile');
const commentRouter = require('./routes/comment');

const { sequelize, Post, Comment, User } = require('./models');

const app = express();
passportConfig();
app.set('port', 3000);

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//템플릿 엔진 설정 (동적 HTML 생성)
app.set('view engine', 'pug');
app.set('views', './views');

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// multer 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'public/images/');  // 업로드 경로
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB 제한
});

// 라우터 등록
app.use('/register', RegisterRouter);
app.use('/', authRouter);
app.use('/', pageRouter);
app.use('/board', boardRouter);
app.use('/new', newRouter);
app.use('/edit', editRouter);
app.use('/profile', profileRouter);
app.use('/comment', commentRouter);

sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
})

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/account.html'));
})

app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { userId: req.user.number },
            include: [{
                include: [{
                    model: User,
                    attributes: ['name']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.render('profile', {
            user: req.user,
            posts: posts,
            postCount: posts.length
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), '번 포트에서 대기중...');
})