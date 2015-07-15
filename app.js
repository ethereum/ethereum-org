var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var approvedBlock = require('./config/config');

// Init the app
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, '/public/images/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res) {
	res.render('index', { title: 'Ethereum Frontier' });
});

app.get('/geth', function(req, res) {
	res.render('geth', { title: 'Install Geth' });
});

app.get('/ether', function(req, res) {
	res.render('ether', { title: 'Get Ether' });
});

app.get('/greeter', function(req, res) {
	res.render('greeter', { title: 'Create a Hello World Contract in ethereum' });
});

app.get('/token', function(req, res) {
	res.render('token', { title: 'Create a cryptocurrency contract in Ethereum' });
});

app.get('/crowdsale', function(req, res) {
	res.render('crowdsale', { title: 'Create a crowdsale contract in Ethereum' });
});

app.get('/dao', function(req, res) {
	res.render('dao', { title: 'Create a Democracy contract in Ethereum' });
});

app.get('/sale', function(req, res) {
	res.render('sale', { title: '2014 ether presale' });
});

app.get('/foundation', function(req, res) {
	res.render('foundation', { title: 'Ethereum Foundation' });
});

app.get('/agreement', function(req, res) {
	res.render('agreement', { title: 'Legal agreement' });
});


app.get('/getBlock', function(req, res) {
	res.json(approvedBlock);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
