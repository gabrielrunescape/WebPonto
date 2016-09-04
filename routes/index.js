var express = require('express');
var mysql   = require('../models/mysql.js');
var router  = express.Router();

// Obtem página inicial
router.get('/', function(req, res){
	if (req.session.usuario) {
		res.redirect('/dashboard');
	} else {
		res.render('home/index', { title: 'WebPonto' });
	}
});

module.exports = router;
