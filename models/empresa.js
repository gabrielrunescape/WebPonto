var mysql = require('../models/mysql.js');

module.exports = function Empresa() {
	this.ID = null;
	this.Nome_Razao = null;
	this.Nome_Fantasia = null;
	this.Responsavel = null;
	this.CNPJ = null;
	this.IE = null;

    this.CEP = {
        ID: null,
        CEP: null,
        Logradouro: null,
        Bairro: null,
        Localidade: null,
        UF: null,
        IBGE: null
    };

    this.Numero = null;
    this.Complemento = null;
    this.Telefone = null;
    this.Fax = null;
    this.Usuario = null;
}

module.exports.getUserById = function(id, callback){
	var resultados = [];

	mysql.query("SELECT * FROM Empresa WHERE ID = ?", id, function(err, linhas) {
		if (err) throw err;

		linhas.forEach(function(row) {
			if (linhas.CEP) {
				mysql.query("SELECT * FROM CEP WHERE ID = ?", linhas.CEP, function(err, linhas) {
					resultados.CEP.forEach(function(linha) {
						resultados.CEP.push(linha);
					});
				});
			} else {
            	resultados.push(row);
			}
        });
	});

	return resultados;
}
