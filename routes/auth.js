const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const {isLoggedIn,isNotLoggedIn} = require('./middlewares');
const {User} = require('../models');

const router = express.Router();
router.post('/signup',isNotLoggedIn,async (req,res,next) => {
    const {code,password,nick} = req.body;

    try {
        const exUser = await User.findOne({where : {code}});
        const exNick = await User.findOne({where : {nick:nick}});
        if (exUser) {
            console.log('이미 사용된 코드입니다')
            message = '이미 사용된 코드입니다'
            res.render('signup',{message:message})
        } else if (exNick){
            console.log('이미 사용중인 닉네임 입니다')
            message = '이미 사용중인 닉네임 입니다'
            res.render('signup',{message:message})
        } else{
            const hash = await bcrypt.hash(password,12);
            await User.create({
                code,
                password:hash,
                money:10000,
                validCode:true,
                nick:nick
            });
            return res.redirect('/');
        }
    }catch (error) {
        console.error(error);
        return next(error)
    }
});

router.post('/signin',isNotLoggedIn,(req,res,next) => {
    passport.authenticate('local',(authError,user,info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        } else if (! user.validCode){
            return res.render('error',{message:"가입처리 되지 않은 코드입니다. 쿤보픽에게 문의하세요",error:info});
        } else if (! user) {
            req.flash('loginError',info.message);
            return res.render('error',{message:info.message,error:info});
        } else {

            return req.login(user,(loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                console.log("로그인성공")
                return res.redirect('/game');
            });
        }
    })(req,res,next);
});

router.get('/logout',isLoggedIn,(req,res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports =router;