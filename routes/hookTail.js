var express = require('express');
var router = express.Router();
const { UserHookTail } = require('../models');

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
        message = "unknown"
        return res.json({ message: message, error: exception });
    }


});

router.post('/score', async function(req, res, next) {
    const { nick, score } = req.body;
    await UserHookTail.update({
        score: score,
    }, {
        where: { nick: nick }
    });

    return res.json({ nick: nick, score: score });

});

router.post('/ranking', async function(req, res, next) {
    const { nick } = req.body;
    const ranking = await UserHookTail.findAll({
        attributes: ["nick", "score"],
        order: [
            ['score', 'DESC']
        ]
    });
    const nickRes = await UserHookTail.findOne({ where: { nick: nick } });
    return res.json({ ranking: ranking, score: nickRes.score });
});
module.exports = router;