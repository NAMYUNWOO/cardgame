var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/register', async function(req, res, next) {
    const { nick, score } = req.body;
    console.log(nick, score);
    const exNick = await UserHookTail.findOne({ where: { nick: nick } });
    try {

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
    return res.json({ message: "" });

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

router.get('/ranking', function(req, res, next) {
    const rankings = UserHookTail.findAll({
        offset: 0,
        limit: 100,
        order: 'score desc'
    });
    return res.json(rankings);
});
module.exports = router;