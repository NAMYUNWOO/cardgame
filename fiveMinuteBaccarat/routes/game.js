var express = require('express');
const {isLoggedIn} = require('./middlewares');
var router = express.Router();

/* GET users listing. */
router.get('/', isLoggedIn ,function(req, res, next) {
  var nick = req.user.dataValues.nick;
  var code = req.user.dataValues.code;
  req.session.nick = nick;
  req.session.code = code;
  
  
  chats = [{user:"system",chat:"바르고 고운 말을 씁시다",time:"2019-05-08 20:01:00"},
          ];
  res.render('game', { nick: nick ,myprofile:req.user,chats:chats,user:nick,money: req.user.dataValues.money});
});

router.post('/chat', isLoggedIn , async (req, res, next) => {
  try{
    const chat = {
      nick : req.session.nick,
      chat : req.body.chat
    };
    console.log(req.session.nick);
    req.app.get('io').of('/game').to('game').emit('chat',chat);
    res.send('ok');
  }catch(error){
    console.log(error);
    next(error);
  }
});


module.exports = router;
