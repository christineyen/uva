(function() {
  var FAKE_ACTIVITY_JSON, app, calendar, client, consumer, date, express, oauth, port, rkOptions, runkeeper;
  express = require('express');
  oauth = require('oauth');
  date = require('datejs');
  app = express.createServer();
  rkOptions = exports.options = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    auth_url: 'https://runkeeper.com/apps/authorize',
    access_token_url: 'https://runkeeper.com/apps/token',
    redirect_uri: 'http://uva.herokuapp.com/runkeeper_callback'
  };
  app.configure('development', function() {
    return rkOptions.redirect_uri = 'http://localhost:3000/runkeeper_callback';
  });
  runkeeper = require(__dirname + '/runkeeper.js');
  client = new runkeeper.HealthGraph(rkOptions);
  calendar = require(__dirname + '/calendar_display.js');
  FAKE_ACTIVITY_JSON = '\
  {\
  "size": 40,\
  "items":\
  [ { "type": "Running",\
  "start_time": "Tue, 1 Mar 2011 07:00:00",\
  "total_distance": 3492.27648,\
  "duration": 1437,\
  "uri": "/activities/40" },\
  { "type": "Running",\
  "start_time": "Thu, 3 Mar 2011 07:00:00",\
  "total_distance": 5310.8352,\
  "duration": 2278,\
  "uri": "/activities/39" },\
  { "type": "Running",\
  "start_time": "Sat, 9 Apr 2011 11:00:00",\
  "total_distance": 12939.1258,\
  "duration": 5043,\
  "uri": "/activities/38" },\
  { "type": "Running",\
  "start_time": "Mon, 9 May 2011 07:00:00",\
  "total_distance": 6839.712,\
  "duration": 2570,\
  "uri": "/activities/37" }],\
  "previous": "https://api.runkeeper.com/user/1234567890/activities?page=2&pageSize=4"\
  }';
  consumer = function() {
    return new oauth.OAuth2(rkOptions.client_id, rkOptions.client_secret, 'http://runkeeper.com', '/apps/authorize', '/apps/token');
  };
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'sdofyi234oglkc@oydf'
    }));
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Express'
    });
  });
  app.get('/runkeeper_login', function(req, res) {
    var oa;
    oa = consumer();
    return res.redirect(oa.getAuthorizeUrl({
      response_type: 'code',
      redirect_uri: rkOptions.redirect_uri
    }));
  });
  app.get('/runkeeper_callback', function(req, res) {
    return client.getNewToken(req.param('code'), function(access_token) {
      req.session.access_token = access_token;
      client.access_token = access_token;
      return res.redirect('/calendar');
    });
  });
  app.get('/calendar', function(req, res) {
    var fitnessActivities;
    if (!req.session.access_token) {
      res.redirect('/');
      return;
    }
    fitnessActivities = JSON.parse(FAKE_ACTIVITY_JSON)['items'];
    return client.profile(function(profile) {
      var calDisplay;
      calDisplay = new calendar.CalendarDisplay(fitnessActivities);
      return res.render('calendar', {
        title: 'calendar data!',
        activities: fitnessActivities,
        user: JSON.parse(profile),
        calData: calDisplay.getElts()
      });
    });
  });
  app.helpers(require(__dirname + '/helpers.js').helpers);
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    return console.log("Express server listening on port %d in %s mode", port, app.settings.env);
  });
}).call(this);
