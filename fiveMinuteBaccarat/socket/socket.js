const SocketIO = require('socket.io');
const axios = require('axios');
const {createShoe} = require('../serverSide_game/createShoe');
const {getGameOutcome} = require('../serverSide_game/calcGame');
const {Game} = require('../models');

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
        // Game.create({
        //     gameResult:GameRes,
        //     gameId:gameId,
        // });
        console.log();
        game.emit('collectBet',{collectBet:"null String"});
        setTimeout(()=>{
            game.emit('startgame',{shoe:shoe});
        },1000);
    },60000);


    game.on('connection', (socket) => {
        const req = socket.request;
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

    });

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