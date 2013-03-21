(function() {
  var RedisStore, app, calendar, client, consumer, date, express, oauth, port, rkOptions, runkeeper, url;
  express = require('express');
  oauth = require('oauth');
  date = require('datejs');
  url = require('url');
  RedisStore = require('connect-redis')(express);
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
  consumer = function() {
    return new oauth.OAuth2(rkOptions.client_id, rkOptions.client_secret, 'http://runkeeper.com', '/apps/authorize', '/apps/token');
  };
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return app.use(express.session({
      secret: 'sdofyi234oglkc@oydf'
    }));
  });
  app.configure('production', function() {
    var redisAuth, redisUrl;
    app.use(express.errorHandler());
    redisUrl = url.parse(process.env.REDISTOGO_URL);
    redisAuth = redisUrl.auth.split(':');
    return app.use(express.session({
      secret: 'sdofyi234oglkc@oydf',
      store: new RedisStore({
        host: redisUrl.hostname,
        port: redisUrl.port,
        db: redisAuth[0],
        pass: redisAuth[1]
      })
    }));
  });
  app.get('/', function(req, res) {
    return res.render('index');
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
    var errors;
    if (!req.session.access_token) {
      res.redirect('/');
      return;
    }
    errors = [];
    return client.profile(function(profile) {
      var fitnessActivities, profileInfo;
      fitnessActivities = [];
      profileInfo = {};
      try {
        profileInfo = JSON.parse(profile);
      } catch (error) {
        errors.push(error);
      }
      return client.fitnessActivityFeed(function(activities) {
        var calDisplay;
        try {
          fitnessActivities = JSON.parse(activities)['items'];
          calDisplay = new calendar.CalendarDisplay(fitnessActivities);
        } catch (error) {
          console.log(error);
          errors.push(error);
        }
        return res.render('calendar', {
          title: 'calendar data!',
          activities: fitnessActivities,
          user: profileInfo,
          calData: calDisplay.getElts(),
          errors: errors
        });
      });
    });
  });
  app.helpers(require(__dirname + '/helpers.js').helpers);
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    return console.log("Express server listening on port %d in %s mode", port, app.settings.env);
  });
}).call(this);
