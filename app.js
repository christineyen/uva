/**
 * Module dependencies.
 */

require.paths.push('support/runkeeper/lib');
var express = require('express');
var oauth   = require ('oauth');

var app = express.createServer();

var rkOptions = exports.options = {
  client_id        : process.env.CLIENT_ID,
  client_secret    : process.env.CLIENT_SECRET,
  auth_url         : 'https://runkeeper.com/apps/authorize',
  access_token_url : 'https://runkeeper.com/apps/token',
  redirect_uri     : 'http://uva.herokuapp.com/runkeeper_callback',
};
app.configure('development', function() {
  // Not sure if this is kosher, but I want to override the base redirect_uri
  // for the development environment. Happy to receive corrections :)
  rkOptions.redirect_uri = 'http://localhost:3000/runkeeper_callback'
});
var runkeeper = require('./support/runkeeper/lib/runkeeper');
var client = new runkeeper.HealthGraph(rkOptions);

function consumer() {
  return new oauth.OAuth2(
    rkOptions.client_id,
    rkOptions.client_secret,
    'http://runkeeper.com',
    '/apps/authorize',
    '/apps/token');
}

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'sdofyi234oglkc@oydf'
  }))
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
  if (!req.session.oauth_access_token) {
    res.redirect('/runkeeper_login');
  } else {
    res.redirect('/calendar');
  }
  //res.render('index', {
    //title: 'Express'
  //});
});

app.get('/runkeeper_login', function(req, res) {
  var oa = consumer();
  res.redirect(oa.getAuthorizeUrl({
    response_type: 'code',
    redirect_uri : rkOptions.redirect_uri
  }));
});

app.get('/runkeeper_callback', function(req, res) {
  client.getNewToken(req.param('code'), function(access_token) {
    client.access_token = access_token;
    res.redirect('/calendar');
  });
});

app.get('/calendar', function(req, res) {
  client.profile(function(data) {
    console.log('YES YES YES ' + data);
    //res.send(JSON.parse(data));
    res.render('calendar', {
      title: 'calendar data!',
      data: data['name']
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
