var bcrypt = require('bcryptjs');
var mysql  = require('../models/mysql.js');

module.exports = function Usuario(id, nome, email, login, sexo, senha) {
	this.ID = id;
	this.Nome = nome;
	this.Email = email;
	this.Login = login;
	this.Sexo = sexo;
	this.Senha = senha;
}

module.exports.criarUsuario = function (usuario, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(usuario.Senha, salt, function(err, hash) {
	        usuario.Senha = hash;
	    });
	});
}

module.exports.getUserByLogin = function(login){
	var resultados = [];

	mysql.query("SELECT * FROM Usuario WHERE Login = ?", login, function(err, linhas) {
		if (err) throw err;

		linhas.forEach(function(row) {
            resultados.push(row);
        });
	});

	return resultados;
}

module.exports.getUserById = function(id, callback){
	var resultados = [];

	mysql.query("SELECT * FROM Usuario WHERE ID = ?", id, function(err, linhas) {
		if (err) throw err;

		linhas.forEach(function(row) {
            resultados.push(row);
        });
	});

	return resultados;
}

module.exports.compararSenha = function(senha, hash, callback){
	bcrypt.compare(senha, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
