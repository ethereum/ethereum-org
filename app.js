const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

// Init the app

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '/dist/images/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));

app.set('port', process.env.PORT || 8080);

// Routes
app.get('/', (request, response) => {
  response.render('index');
});

app.get('/wallet', (request, response) => {
  response.render('wallet');
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

app.get('/privacy-policy', (request, response) => {
  response.render('privacy-policy');
});

app.get('/cookie-policy', (request, response) => {
  response.render('cookie-policy');
});

app.get('/terms-of-use', (request, response) => {
  response.render('terms-of-use');
});

app.get('/*', (request, response, next) => {
  let errStatus = 404;

  // respond with html page
  if (request.accepts('html')) {
    response.render('404', { url: request.url });
    return;
  } else {
    response.status(errStatus).end();
  }
});

// error handlers
if (app.get('env') === 'development') {
  // development error handler(Not needed for now)
  app.use((err, request, response, next) => {
    response.status(err.status || 500);
    response.render('error', {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
