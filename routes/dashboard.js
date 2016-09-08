var express = require('express');
var mysql   = require('../models/mysql.js');
var router  = express.Router();
var Empresa = require('../models/empresa.js');

// Obtem página inicial
router.get('/', function(req, res) {
	if (!req.session.usuario) {
		res.redirect(401, '/users/login');
	} else {
		mysql.query("SELECT * FROM Empresa WHERE ID = 1", function(err, linhas) {
			if (err) console.log(err);

			var empresa = linhas;
			delete empresa[0].CEP;

			mysql.query("SELECT * FROM CEP WHERE ID = 1", function(err, linhas) {
				empresa[0].CEP = linhas[0];

				empresa = JSON.stringify(empresa);
				empresa = JSON.parse(empresa);

				console.log(empresa);
				res.render('dashboard/index', { title: 'WebPonto - ' + req.session.usuario, usuario: req.session.usuario });
			});
		});
	}
})

module.exports = router;
