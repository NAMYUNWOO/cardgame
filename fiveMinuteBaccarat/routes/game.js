var express = require('express');
const {isLoggedIn} = require('./middlewares');

var router = express.Router();

/* GET users listing. */
router.get('/', isLoggedIn ,function(req, res, next) {
  var nick = req.user.dataValues.nick;
  req.session.nick = nick;
  chats = [{user:"myself",chat:"내가쓴글 내가쓴글......내가쓴글 내가쓴글......내가쓴글 내가쓴글......내가쓴글 내가쓴글......",time:"2019-05-08 20:00:00"},
           {user:"system",chat:"시스템 공지 올라간다",time:"2019-05-08 20:01:00"},
           {user:"user_i",chat:"타인이쓴글 타인이쓴글......타인이쓴글 타인이쓴글......타인이쓴글 타인이쓴글......",time:"2019-05-08 20:02:00"},
          ];
  res.render('game', { nick: nick ,myprofile:req.user,chats:chats,user:"myself" });
});


module.exports = router;
