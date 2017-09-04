var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

// Init the app
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, '/dist/images/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

app.set('port', process.env.PORT || 8080);

// Routes
app.get('/', function(req, res) {
	res.render('index');
});

app.get('/wallet', function(req, res) {
	res.render('wallet')
});

app.get('/cli', function(req, res) {
	res.render('cli');
});

app.get('/ether', function(req, res) {
	res.render('ether');
});

app.get('/greeter', function(req, res) {
	res.render('greeter');
});

app.get('/token', function(req, res) {
	res.render('token');
});

app.get('/crowdsale', function(req, res) {
	res.render('crowdsale');
});

app.get('/dao', function(req, res) {
	res.render('dao');
});

app.get('/agreement', function(req, res) {
	res.render('agreement');
});

app.get('/assets', function(req, res) {
	res.render('assets');
});

app.get('/brand', function(req, res) {
	res.render('brand');
});

app.get('/foundation', function(req, res) {
	res.render('foundation');
});

app.get('/donate', function(req, res) {
	res.render('donate');
});

app.get('/devgrants', function(req, res) {
	res.render('devgrants');
});

app.get('/devcontwo', function(req, res) {
	res.render('devcon2');
});

app.get('/swarm', function(req, res) {
	res.render('swarm');
});

app.get('/privacy-policy', function(req, res) {
	res.render('privacy-policy');
});

app.get('/cookie-policy', function(req, res) {
	res.render('cookie-policy');
});

app.get('/terms-of-use', function(req, res) {
	res.render('terms-of-use');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	
	// respond with html page
	if (req.accepts('html')) {
	    res.render('404', { url: req.url });
	    return;
	}
	
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
