var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource dkdkdkdkdkdkdkd');
});

router.get('/cool/', function(req, res, next) {
  res.send('this is the cool response');
});

module.exports = router;
