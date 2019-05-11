var express = require('express');
const {isLoggedIn} = require('./middlewares');
const {User} = require('../models');
const {calcPayout} = require('../serverSide_game/calcGame');
var router = express.Router();

/* GET users listing. */
router.get('/', isLoggedIn ,function(req, res, next) {
  var nick = req.user.dataValues.nick;
  req.session.nick = nick;
  
  
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


router.post('/bet', isLoggedIn , async (req, res, next) => {
  //const shoe = createShoe(6);
  const code = req.user.dataValues.code;
  const betMoney = req.body.betMoney;
  const betChoice = req.body.betChoice;
  console.log(`${code}, ${betChoice}, ${betMoney}`);
  var userReq = await User.findOne({attributes:['money'],where : {code:code}});
  var userMoney = parseInt(userReq.dataValues.money);
  const payout = calcPayout(req.app.gameInfo.outcome,betChoice,Math.min(userMoney,betMoney));
  if (userMoney != 0){
    var newUserMoney = userMoney + payout;
    User.update({
      money:newUserMoney,
    },{
      where:{code:code}
    })
  }else{
    var newUserMoney = 0;

  }
  console.log('I have ',newUserMoney);
  try{
    const chat = {
      nick : req.session.nick,
      chat : `${betChoice} 에 ${betMoney} 배팅!`
    };
    req.app.get('io').of('/game').to('game').emit('chat',chat);
    req.app.get('io').of('/game').to('game').emit('accountUpdate',{money:newUserMoney,payout:payOut});
    res.send('ok');
  }catch(error){
    console.log(error);
    next(error);
  }
});

module.exports = router;
