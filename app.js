/**
 * Module dependencies.
 */

require.paths.push(__dirname + '/support/runkeeper/lib');
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
var runkeeper = require(__dirname + '/support/runkeeper/lib/runkeeper.js');
var client = new runkeeper.HealthGraph(rkOptions);

var FAKE_ACTIVITY_JSON = ' \
  { \
  "size": 40, \
  "items": \
  [ { "type": "Running", \
  "start_time": "Tue, 1 Mar 2011 07:00:00", \
  "total_distance": 3492.27648, \
  "duration": 1437, \
  "uri": "/activities/40" }, \
  { "type": "Running", \
  "start_time": "Thu, 3 Mar 2011 07:00:00", \
  "total_distance": 5310.8352, \
  "duration": 2278, \
  "uri": "/activities/39" }, \
  { "type": "Running", \
  "start_time": "Sat, 5 Mar 2011 11:00:00", \
  "total_distance": 12939.1258, \
  "duration": 5043, \
  "uri": "/activities/38" }, \
  { "type": "Running", \
  "start_time": "Mon, 7 Mar 2011 07:00:00", \
  "total_distance": 6839.712, \
  "duration": 2570, \
  "uri": "/activities/37" }], \
  "previous": "https://api.runkeeper.com/user/1234567890/activities?page=2&pageSize=4" \
  } \
';

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
  res.render('index', {
    title: 'Express'
  });
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
    req.session.access_token = access_token
    client.access_token      = access_token;
    res.redirect('/calendar');
  });
});

app.get('/calendar', function(req, res) {
  // Early return in case the access_token isn't set
  if (!req.session.access_token) {
    res.redirect('/');
    return;
  }
  // Once the data access request gets approved, pull REAL fitness activities.
  // For now, we push dummy data.
  fitnessActivities = JSON.parse(FAKE_ACTIVITY_JSON);

  client.profile(function(profile) {
    res.render('calendar', {
      title      : 'calendar data!',
      user       : JSON.parse(profile),
      activities : fitnessActivities['items']
    });
  });
});

app.helpers(require(__dirname + '/helpers.js').helpers);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});
