var express = require('express');
const {isLoggedIn} = require('./middlewares');

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


const deckCards = ["2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD"]
function createShoe(numDecks){
  //Inefficient and insecure
  let shoe = [];
  for(let i = 0; i<numDecks; i++){
    let tempDeck = deckCards.slice(0,52);
    for(let j = tempDeck.length; j>0; j--){
      //Replace with difference random number generator
      let r = Math.floor(Math.random()*j)
      shoe.push(...tempDeck.splice(r,1));
    }
  }
  return shoe;
}

router.post('/bet', isLoggedIn , async (req, res, next) => {
  const shoe = createShoe(6)
  const bet = req.body.bet;
  try{
    const chat = {
      nick : req.session.nick,
      chat : `${bet} 에 배팅!`
    };
    console.log(req.bet);
    req.app.get('io').of('/game').to('game').emit('chat',chat);
    req.app.get('io').of('/game').to('game').emit('bet',{shoe:shoe,bet:bet});
    res.send('ok');
  }catch(error){
    console.log(error);
    next(error);
  }
});

module.exports = router;
