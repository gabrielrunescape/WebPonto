//var connection       = require('express-myconnection');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var express          = require('express');
var expressValidator = require('express-validator');
var flash            = require('connect-flash');
var session          = require('express-session');
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var path             = require('path');

// Inicia aplicação e define rotas
var app = express();
var routes = require('./routes/index');
var users = require('./routes/users');

// View Engine
app.set('view engine', 'ejs');

// Deixar pasta (public) estatica
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Sessão do Express
app.use(session({
    secret: 'es_un_secreto',
    saveUninitialized: true,
    resave: true
}));

// Inicio do Passport
app.use(passport.initialize());
app.use(passport.session());

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Validador do Express
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Conexão com Flash
app.use(flash());

// Variáveis Globais
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.usuario = req.usuario || null;
  next();
});

// Rotas
app.use('/', routes);
app.use('/users', users);

// Porta da aplicação
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Servidor iniciado na porta ' + app.get('port'));
});
