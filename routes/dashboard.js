var express = require('express');
var mysql   = require('../models/mysql.js');
var router  = express.Router();
var Empresa = require('../models/empresa.js');

// Obtem página inicial
router.get('/', function(req, res) {
	if (!req.session.usuario) {
		res.redirect(401, '/users/login');
	} else {
		mysql.query("SELECT COUNT(ID) AS `Count` FROM Empresa WHERE Usuario = ?", req.session.usuario.ID, function(err, linhas) {
			if (err) console.log(err);

			if (linhas[0].Count != 0) {
				var empresa = linhas;
				delete empresa[0].CEP;

				mysql.query("SELECT * FROM CEP WHERE ID = 1", function(err, linhas) {
					empresa[0].CEP = linhas[0];

					empresa = JSON.stringify(empresa);
					empresa = JSON.parse(empresa);

					console.log(req.session.usuario);
					res.render('dashboard/index', { title: 'WebPonto - ' + req.session.usuario.Nome, usuario: req.session.usuario });
				});
			} else {
				res.redirect('empresa');
			}
		});
	}
});

router.get('/empresa', function(req, res) {
	res.render('dashboard/empresa', { title: 'WebPonto - Empresa', usuario: req.session.usuario });
});

router.post('/empresa', function(req, res) {
	var regExp = /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/;

	var Nome_Razao 	  = req.body.razao;
	var Nome_Fantasia = req.body.fantasia;
	var Responsavel   = req.body.responsavel;
	var CNPJ 		  = req.body.CNPJ;
	var IE 			  = req.body.IE;
	var CEP 		  = req.body.CEP;
	var Numero 		  = req.body.numero;
	var Complemento   = req.body.complemento;
    var Telefone 	  = req.body.telefone;
    var Fax 		  = req.body.fax;
    var Usuario 	  = req.session.usuario.ID;

	req.checkBody('razao', 'É necessário preencher a razão social.').notEmpty();
	req.checkBody('fantasia', 'É necessário preencher o nome fantásia.').notEmpty();
	req.checkBody('responsavel', 'É necessário preencher o nome do responsável.').notEmpty();
	req.checkBody('CNPJ', 'É necessário preencher o CNPJ da empresa.').notEmpty();
	req.checkBody('CNPJ', 'CNPJ não é válido.')/*.replace('.', '').replace('/', '').replace('-', '')*/.isInt();
	req.checkBody('IE', 'Inscrição Estadual inválida.')/*.replace('.', '').replace('/', '').replace('-', '')*/.isInt();
	req.checkBody('numero', 'É necessário preencher o número da empresa.').notEmpty();
	req.checkBody('numero', 'Número inválido.').isInt();
	req.checkBody('telefone', 'É necessário preencher o telefone da empresa.').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('dashboard/empresa',{
			errors: errors,
			title: 'WebPonto - Empresa'
		});
	} else {
		res.send('Nada acontece paçoca!');
	}
});

router.get('/cep', function(req, res) {
	res.render('dashboard/cep', { title: 'WebPonto - CEP', usuario: req.session.usuario });
});

module.exports = router;
