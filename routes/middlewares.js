exports.isLoggedIn = (req,res,next) => {
    if (req.isAuthenticated() ){
        //res.redirect('/game');
        next();
    }else{
        //req.flash("로그인이 필요합니다.")
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req,res,next) => {
    if (! req.isAuthenticated() ){
        next();
    }else{
        res.redirect('/game');
    }
};