var express = require('express');
var mysql   = require('../models/mysql.js');
var router  = express.Router();

// Obtem página inicial
router.get('/', function(req, res){
	res.render('home/index', { title: 'Express Менеджер' });
});

module.exports = router;
