var express = require('express');
var mysql   = require('../models/mysql.js');
var router  = express.Router();

// Obtem página inicial
router.get('/', function(req, res) {
	if (!req.session.usuario) {
		res.redirect(401, '/users/login');
	}

    //res.status(200).send();
    res.render('dashboard/index', { title: 'WebPonto - ' + req.session.usuario });
})

module.exports = router;
