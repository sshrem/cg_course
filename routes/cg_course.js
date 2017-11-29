/**
 * Created by shrem on 7/14/17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cg_course', { title: 'CG Course' });
});

module.exports = router;

