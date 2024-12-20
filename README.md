﻿# 2024_Web_Report

## 프로젝트 소개
Node.js와 Express를 기반으로 한 게시판 웹 애플리케이션입니다. 사용자 인증, 게시글 관리, 댓글 기능을 제공하며, 이미지 업로드도 지원합니다.

### 주요 기능
- **사용자 관리**
  - 회원가입 및 로그인
  - 프로필 페이지
  - 작성 게시글 관리

- **게시판 기능**
  - 게시글 CRUD (작성, 조회, 수정, 삭제)
  - 이미지 업로드
  - 댓글 작성
  - 게시글 검색 (제목, 내용, 작성자)

### 기술 스택
- **Backend**
  - Node.js
  - Express
  - MySQL (Sequelize ORM)
  - Passport.js (인증)

- **Frontend**
  - Pug Template Engine
  - HTML/CSS
  - JavaScript

- **파일 업로드**
  - Multer

### 프로젝트 구조
project/  
├── models/ # 데이터베이스 모델  
├── routes/ # API 라우터  
├── views/ # Pug 템플릿  
├── pages/ # HTML 페이지  
├── public/ # 정적 파일  
│ └── uploads/ # 업로드된 이미지  
├── passport/ # 인증 설정  
└── app.js # 메인 서버 파일  

### 실행 방법
1. 저장소 클론
```bash
git clone [repository-url]
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정 (.env)
```
COOKIE_SECRET=your_cookie_secret
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_USER=your_db_user
DB_NAME=your_db_name
```

4. 서버 실행
```bash
npm start
```

### API 엔드포인트
- **인증**
  - POST `/register`: 회원가입
  - POST `/login`: 로그인
  - GET `/logout`: 로그아웃

- **게시판**
  - GET `/board`: 게시글 목록
  - GET `/board/:id`: 게시글 상세
  - POST `/new`: 게시글 작성
  - POST `/edit/:id`: 게시글 수정
  - GET `/board/search`: 게시글 검색

- **댓글**
  - POST `/comment/:postId`: 댓글 작성

- **프로필**
  - GET `/profile`: 사용자 프로필

### 개발자
- 이름: [개발자 이름]
- 학번: [학번]
- 이메일: [이메일]
