var express = require('express');
const {isLoggedIn,isNotLoggedIn} = require('./middlewares');
var router = express.Router();

/* GET home page. */
router.get('/',isNotLoggedIn,function(req, res, next) {
  res.render('signin');
});

module.exports = router;
