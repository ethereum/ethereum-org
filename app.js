const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

// Init the app
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(path.join(__dirname, '/dist/images/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

app.set('port', process.env.PORT || 3000);

// Routes
app.get('/', (request, response) => {
	response.render('index');
});

app.get('/cli', (request, response) => {
	response.render('cli');
});

app.get('/ether', (request, response) => {
	response.render('ether');
});

app.get('/greeter', (request, response) => {
	response.render('greeter');
});

app.get('/token', (request, response) => {
	response.render('token');
});

app.get('/crowdsale', (request, response) => {
	response.render('crowdsale');
});

app.get('/dao', (request, response) => {
	response.render('dao');
});

app.get('/agreement', (request, response) => {
	response.render('agreement');
});

app.get('/assets', (request, response) => {
	response.render('assets');
});

app.get('/brand', (request, response) => {
	response.render('brand');
});

app.get('/foundation', (request, response) => {
	response.render('foundation');
});

app.get('/donate', (request, response) => {
	response.render('donate');
});

app.get('/devgrants', (request, response) => {
	response.render('devgrants');
});

app.get('/devcontwo', (request, response) => {
	response.render('devcon2');
});

app.get('/swarm', (request, response) => {
	response.render('swarm');
});

// catch 404 and forward to error handler
app.use((request, response, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	
	// responsepond with html page
	if (request.accepts('html')) {
	    response.render('404', { url: request.url });
	    return;
	}
	
	next(err);
});

// error handlers
if (app.get('env') === 'development') {
	app.use((err, request, response, next) => {
		response.status(err.status || 500);
		response.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
app.use((err, request, response, next) => {
	response.status(err.status || 500);
	response.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
