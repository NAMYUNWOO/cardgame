const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server,app,sessionMiddleWare) => {
    const io = SocketIO(server,{path:'/socket.io'});
    app.set("io",io);

    const game = io.of('/game')

    io.use((socket,next) => {
        sessionMiddleWare(socket.request,socket.request.res,next);
    })    

    game.on('connection', (socket) => {
        const req = socket.request;
        const {headers:{referer}} = req;
        const roomId = referer
                        .split("/")[referer.split("/").length-1]
                        .replace(/\?.+/,'')
        socket.join(roomId);
        console.log(`${req.session.nick}님이 입장하셨습니다.`)
        game.emit('join',{chat:`${req.session.nick}님이 입장하셨습니다.`});
        //socket.to(roomId).emit('join',{chat:`${req.session.nick}님이 입장하셨습니다.`});

        socket.on("disconnect", () =>{
            socket.leave(roomId);
            console.log(`${req.session.nick}님이 퇴장하셨습니다.`);
            game.emit('exit',{chat:`${req.session.nick}님이 퇴장하셨습니다.`});
            //socket.to(roomId).emit('exit',{chat:`${req.session.nick}님이 퇴장하셨습니다.`});
        })

    })

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