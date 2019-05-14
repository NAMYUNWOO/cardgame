const SocketIO = require('socket.io');
const axios = require('axios');
const { createShoe } = require('../serverSide_game/createShoe');
const { getGameOutcome } = require('../serverSide_game/calcGame');
const { calcPayout, getBetOutCome } = require('../serverSide_game/calcGame');
const { User, Game, Bet } = require('../models');

module.exports = (server, app, sessionMiddleWare) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set("io", io);

    const game = io.of('/game')

    io.use((socket, next) => {
        sessionMiddleWare(socket.request, socket.request.res, next);
    });

    io.interval = setInterval(() => {
        const shoe = createShoe(6);
        const shoeCopied = JSON.parse(JSON.stringify(shoe));
        const GameResObj = getGameOutcome(shoeCopied);
        const GameRes = JSON.stringify(GameResObj);
        const gameId = parseInt(new Date().getTime() / 1000);
        app.gameInfo.gameId = gameId;
        app.gameInfo.outcome = GameResObj.outcome;
        app.gameInfo.gameRes = GameRes
        console.log(GameRes, gameId);
        Game.create({
            gameResult: GameRes,
            gameId: gameId,
        });
        game.emit('collectBet', { collectBet: "null String" });
    }, 25000);


    game.on('connection', (socket) => {
        const req = socket.request;
        //const code = req.user.dataValues.code;
        const { headers: { referer } } = req;
        const roomId = referer
            .split("/")[referer.split("/").length - 1]
            .replace(/\?.+/, '')
        socket.join(roomId);
        console.log(`${req.session.nick}님이 입장하셨습니다.`)
        game.to(roomId).emit('join', { chat: `${req.session.nick}님이 입장하셨습니다.` });
        //socket.to(roomId).emit('join',{chat:`${req.session.nick}님이 입장하셨습니다.`});

        socket.on("disconnect", () => {
            socket.leave(roomId);
            console.log(`${req.session.nick}님이 퇴장하셨습니다.`);
            game.to(roomId).emit('exit', { chat: `${req.session.nick}님이 퇴장하셨습니다.` });
            //socket.to(roomId).emit('exit',{chat:`${req.session.nick}님이 퇴장하셨습니다.`});
        });

        socket.on("getSyncTime", async(data) => {
            var syncTime = 25 - (parseInt(new Date().getTime() / 1000) - app.gameStartTime);
            game.to(roomId).emit("syncTime", { syncTime: syncTime })

        });

        socket.on("betSend", async(data) => {
            const code = req.session.code;
            var payout = 0;
            if (typeof code !== 'undefined') {
                const betMoney = parseInt(data.betMoney);
                const betOutcome = getBetOutCome(data.betOutcome);
                var userReq = await User.findOne({ where: { code: code } });
                var userMoney = parseInt(userReq.dataValues.money);
                console.log(`${code} ${betOutcome} ${betMoney}`);
                if (betOutcome != 'null') {
                    const gameId = app.gameInfo.gameId;
                    const outcome = app.gameInfo.outcome;
                    payout = calcPayout(outcome, betOutcome, Math.min(userMoney, betMoney));
                    if (userMoney != 0) {
                        var newUserMoney = userMoney + payout;
                        User.update({
                            money: newUserMoney,
                        }, {
                            where: { code: code }
                        })

                        Bet.create({ //console.log
                            betMoney: betMoney,
                            betOutcome: betOutcome,
                            payout: payout,
                            bettor_code: code,
                            bet_gameId: gameId
                        });
                    } else {
                        var newUserMoney = 0;
                    }

                } else {
                    newUserMoney = userMoney;
                    payout = 0;
                }
                // only to sender client
                var gameRes = JSON.parse(app.gameInfo.gameRes);
                app.gameStartTime = parseInt(new Date().getTime() / 1000);
                socket.emit("updateAccountShowShoe", {
                    newUserMoney: newUserMoney,
                    payout: payout,
                    pHand: gameRes.pHand,
                    bHand: gameRes.bHand,
                    outcome: app.gameInfo.outcome,
                });
            }
        });

    });


    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 유저 접속', ip, socket.id, req.ip);
        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => {
            console.error(error);
        });

        socket.on('reply', (data) => {
            console.log(data);
        });

        socket.interval = setInterval(() => {
            socket.emit('news', "HELLO SOCKET IO");
        }, 3000);
    });
};