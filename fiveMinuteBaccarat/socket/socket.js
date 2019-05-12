const SocketIO = require('socket.io');
const axios = require('axios');
const {createShoe} = require('../serverSide_game/createShoe');
const {getGameOutcome} = require('../serverSide_game/calcGame');
const {calcPayout} = require('../serverSide_game/calcGame');
const {User,Game,Bet} = require('../models');

module.exports = (server,app,sessionMiddleWare) => {
    const io = SocketIO(server,{path:'/socket.io'});
    app.set("io",io);

    const game = io.of('/game')

    io.use((socket,next) => {
        sessionMiddleWare(socket.request,socket.request.res,next);
    });    

    io.interval = setInterval(() => {
        const shoe = createShoe(6);
        const shoeCopied = JSON.parse(JSON.stringify(shoe));
        const GameResObj = getGameOutcome(shoeCopied);
        const GameRes = JSON.stringify(GameResObj);
        const gameId = parseInt(new Date().getTime()/1000);
        app.gameInfo.gameId = gameId;
        app.gameInfo.outcome = GameResObj.outcome;
        console.log(GameRes,gameId);
        Game.create({
            gameResult:GameRes,
            gameId:gameId,
        });
        game.emit('collectBet',{collectBet:"null String"});
        setTimeout(()=>{
            game.emit('startgame',{shoe:shoe});
        },1000);
    },10000);


    game.on('connection', (socket) => {
        const req = socket.request;
        //const code = req.user.dataValues.code;
        const {headers:{referer}} = req;
        const roomId = referer
                        .split("/")[referer.split("/").length-1]
                        .replace(/\?.+/,'')
        socket.join(roomId);
        console.log(`${req.session.nick}님이 입장하셨습니다.`)
        game.to(roomId).emit('join',{chat:`${req.session.nick}님이 입장하셨습니다.`});
        //socket.to(roomId).emit('join',{chat:`${req.session.nick}님이 입장하셨습니다.`});

        socket.on("disconnect", () =>{
            socket.leave(roomId);
            console.log(`${req.session.nick}님이 퇴장하셨습니다.`);
            game.to(roomId).emit('exit',{chat:`${req.session.nick}님이 퇴장하셨습니다.`});
            //socket.to(roomId).emit('exit',{chat:`${req.session.nick}님이 퇴장하셨습니다.`});
        });


        socket.on("betSend", async (data) => {
            const code = req.session.code;
            if (typeof code !== 'undefined'){
                const betMoney = parseInt(data.betMoney);
                const betOutcome = data.betOutcome;
                console.log(`${code} ${betOutcome} ${betMoney}`);
                var userReq = await User.findOne({where : {code:code}});
                var userMoney = parseInt(userReq.dataValues.money);
                const gameId = app.gameInfo.gameId;
                const outcome = app.gameInfo.outcome;
                const payout = calcPayout(outcome,betOutcome,Math.min(userMoney,betMoney));
                if (userMoney != 0){
                    var newUserMoney = userMoney + payout;
                    User.update({
                            money:newUserMoney,
                        },{
                            where:{code:code}
                        }
                    )

                    Bet.create({ //console.log
                        betMoney:betMoney,
                        betOutcome:betOutcome,
                        payout:payout,
                        bettor_code:code,
                        bet_gameId:gameId
                    });                    
                }else{
                    var newUserMoney = 0;
                }
                // only to sender client
                socket.emit("updateAccount",{newUserMoney:newUserMoney,payout:payout});
            }
        });

    });

    game.on('betSend', (socket) => {
        const req = socket.request;
        console.log("catche betSend");
        console.log(req);
        const code = req.user.dataValues.code;
        const betMoney = req.body.betMoney;
        const betChoice = req.body.betChoice;
        console.log(`${code}, ${betChoice}, ${betMoney}`);
        var userReq = User.findOne({attributes:['money'],where : {code:code}});
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
          //req.app.get('io').of('/game').to('game').emit('accountUpdate',{money:newUserMoney,payout:payOut});
          res.send('ok');
        }catch(error){
          console.log(error);
          next(error);
        }
      }
      );

    io.on('connection',(socket) => {
        const req =socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 유저 접속',ip,socket.id, req.ip);
        socket.on('disconnect',() => {
            console.log('클라이언트 접속 해제',ip,socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error',(error) => {
            console.error(error);
        });

        socket.on('reply',(data) => {
            console.log(data);
        });

        socket.interval = setInterval(() => {
            socket.emit('news',"HELLO SOCKET IO");
        },3000);
    });
};