var express = require('express');
var router = express.Router();
const { UserHookTail, Sequelize: { Op } } = require('../models');

/* GET home page. */
router.post('/register', async function(req, res, next) {
    const { nick, score } = req.body;
    console.log(nick, score);
    try {
        const exNick = await UserHookTail.findOne({ where: { nick: nick } });
        if (exNick) {
            message = 'nickExists'
            return res.json({ message: message });
        } else {
            await UserHookTail.create({
                nick: nick,
                score: score,
            });
            message = "success"
            return res.json({ message: message });
        }
    } catch (exception) {
        message = "error"
        return res.json({ message: message });
    }


});

router.post('/score', async function(req, res, next) {
    const { nick, score } = req.body;
    try {
        await UserHookTail.update({
            score: score,
        }, {
            where: {
                nick: nick,
                score: {
                    [Op.lt]: score
                }
            }
        });

        return res.json({ message: "success" });

    } catch (exception) {
        return res.json({ message: "fail" });

    }

});

router.post('/ranking', async function(req, res, next) {
    const { nick } = req.body;
    try {
        const ranking = await UserHookTail.findAll({
            attributes: ["nick", "score"],
            order: [
                ['score', 'DESC']
            ]
        });
        var rankingUsers = [];
        var rankingScores = [];
        var useridx = 0;
        for (var i = 0; i < ranking.length; i++) {
            var obji = ranking[i];
            rankingUsers.push(obji.nick)
            rankingScores.push(obji.score.toString());
            if (obji.nick == nick) {
                useridx = i;
            }
        }

        return res.json({ rankingUsers: rankingUsers, rankingScores: rankingScores, useridx: useridx, message: "success" });

    } catch (exception) {
        return res.json({
            rankingUsers: [""],
            rankingScores: [""],
            useridx: useridx,
            message: "error"
        });
    }

});
module.exports = router;