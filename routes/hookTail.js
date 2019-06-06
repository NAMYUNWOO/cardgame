var express = require('express');
var router = express.Router();

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

router.post('/score', function(req, res, next) {
    const { nick, score } = req.body;
    UserHookTail.update({
        score: score,
    }, {
        where: { nick: nick }
    });
});

router.get('/ranking', function(req, res, next) {
    const rankings = UserHookTail.findAll({
        offset: 0,
        limit: 100,
        order: 'score desc'
    });
    return res.json(rankings);
});
module.exports = router;