var express = require('express');
var mysql   = require('../models/mysql.js');
var router  = express.Router();

var bkfd2Password = require("pbkdf2-password");
var hasher        = bkfd2Password();
var senha         = { password: "123456" };

// Obtem página inicial
router.get('/', function(req, res){
	res.render('index', { title: 'Express Менеджер' });
});

router.get('/teste', function(req, res) {
  hasher(senha, function(err, pass, salt, hash) {
    senha = salt;
    res.send("senha cript: " + senha);
  });

  /*mysql.query('SELECT * FROM Usuario;', function(err, linhas, colunas) {
    if (err) throw err;

    res.send(linhas);
  });*/
});

module.exports = router;
