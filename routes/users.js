var bcrypt 		  = require('bcryptjs');
var express 	  = require('express');
var mysql         = require('../models/mysql.js');
var passport	  = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Instanciação das variáveis
var router = express.Router();
var Usuario = require('../models/usuario');

// Obtem página de registro
router.get('/register', function(req, res){
	res.render('home/register', { title: 'WebPonto - Registro' });
});

// Obtem página de autenticação
router.get('/login', function(req, res){
	res.render('home/login', { title: 'WebPonto - Autenticação' });
});

router.get('/logout', function(req, res){
	req.logout();

	delete req.session.usuario;
	req.flash('success_msg', 'Você desconectou-se!');

	res.redirect('/users/login');
});

router.get('/dashboard', function(req, res) {
	if (!req.session.usuario) {
		return res.redirect(401, '/users/login');
	}

	return res.status(200).send('Bem vindo usuário!');
})

// Recebe informações da página de registro
router.post('/register', function(req, res) {
	var nome = req.body.nome;
	var email = req.body.email;
	var login = req.body.login;
	var sexo = req.body.genero;
	var senha = req.body.senha;
	var senha2 = req.body.confirmacao;

	req.checkBody('nome', 'É necessário preencher o nome.').notEmpty();
	req.checkBody('email', 'É necessário preencher o endereço de e-mail.').notEmpty();
	req.checkBody('email', 'E-mail não é válido.').isEmail();
	req.checkBody('login', 'É necessário preencher o nome de usuário.').notEmpty();
	req.checkBody('senha', 'É necessário preencher o campo de senha.').notEmpty();
	req.checkBody('confirmacao', 'As senhas não se coincidem.').equals(req.body.senha);

	var errors = req.validationErrors();

	if(errors){
		res.render('home/register',{
			errors: errors,
			title: 'WebPonto - Registro'
		});
	} else {
		var usuario = new Usuario(null, nome, email, login, sexo, senha);

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(usuario.Senha, salt, function(err, hash) {
				usuario.Senha = hash;

				mysql.query('INSERT INTO Usuario SET ?', usuario, function(err, res) {
					if (err) {
						console.log(err);
						return res.status(500).send();
					} else {
						return res.status(200).send();
					}
				});

				req.flash('success_msg', 'Registro concluido com sucesso. Você já pode se conectar.');

				res.redirect('/users/login');
			});
		});
	}
});

// Recebe informações da página de login
router.post('/login', passport.authenticate('login', {successRedirect:'/users/dashboard', failureRedirect:'/users/login',failureFlash: true}));

passport.use('login', new LocalStrategy({ usernameField: 'login', passwordField: 'senha', passReqToCallback : true }, function(req, login, senha, done) {
	mysql.query("SELECT * FROM Usuario WHERE Login = ?", login, function(err, linha) {
		if (err) {
			console.log(err);
			return done(null, false, {message: err});
		}

		var usuario = linha[0];

		if (!usuario || usuario === 'undefined') {
			return done(null, false, {message: 'Usuário desconhecido'});
		}

		bcrypt.compare(senha, usuario.Senha, function(err, isMatch) {
	    	if (err) return done(null, false, {message: err});

			if (isMatch) {
				req.session.usuario = linha[0].Login;

				return done(null, usuario);
			} else {
				done(null, false, {message: 'Senha inválida'});
			}
		});
	});
}));

passport.serializeUser(function(usuario, done) {
  done(null, usuario.ID);
});

passport.deserializeUser(function(id, done) {
	mysql.query("SELECT * FROM Usuario WHERE ID = ?", id, function(err, linhas) {
		if (err) throw err;

		done(err, linhas[0]);
	});
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
	}

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
