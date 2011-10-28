# Module dependencies.
express = require('express')
oauth   = require('oauth')
date    = require('datejs')

app = express.createServer()

rkOptions = exports.options =
  client_id        : process.env.CLIENT_ID,
  client_secret    : process.env.CLIENT_SECRET,
  auth_url         : 'https://runkeeper.com/apps/authorize',
  access_token_url : 'https://runkeeper.com/apps/token',
  redirect_uri     : 'http://uva.herokuapp.com/runkeeper_callback',
app.configure('development', ->
  # Not sure if this is kosher, but I want to override the base redirect_uri
  # for the development environment. Happy to receive corrections :)
  rkOptions.redirect_uri = 'http://localhost:3000/runkeeper_callback'
)
runkeeper  = require(__dirname + '/runkeeper.js')
client     = new runkeeper.HealthGraph(rkOptions)
calendar   = require(__dirname + '/calendar_display.js')

FAKE_ACTIVITY_JSON = '
  {
  "size": 40,
  "items":
  [ { "type": "Running",
  "start_time": "Tue, 1 Mar 2011 07:00:00",
  "total_distance": 3492.27648,
  "duration": 1437,
  "uri": "/activities/40" },
  { "type": "Running",
  "start_time": "Thu, 3 Mar 2011 07:00:00",
  "total_distance": 5310.8352,
  "duration": 2278,
  "uri": "/activities/39" },
  { "type": "Running",
  "start_time": "Sat, 9 Apr 2011 11:00:00",
  "total_distance": 12939.1258,
  "duration": 5043,
  "uri": "/activities/38" },
  { "type": "Running",
  "start_time": "Mon, 9 May 2011 07:00:00",
  "total_distance": 6839.712,
  "duration": 2570,
  "uri": "/activities/37" }],
  "previous": "https://api.runkeeper.com/user/1234567890/activities?page=2&pageSize=4"
  }'

consumer = ->
  new oauth.OAuth2(
    rkOptions.client_id,
    rkOptions.client_secret,
    'http://runkeeper.com',
    '/apps/authorize',
    '/apps/token')

# Configuration
app.configure(->
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.logger())
  app.use(express.bodyParser())
  app.use(express.cookieParser())
  app.use(express.session(
    secret: 'sdofyi234oglkc@oydf'
  ))
  app.use(express.static(__dirname + '/public'))
)

app.configure('development', ->
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
)

app.configure('production', ->
  app.use(express.errorHandler())
)

# Routes
app.get('/', (req, res) ->
  res.render('index',
    title: 'Express'
  )
)

app.get('/runkeeper_login', (req, res) ->
  oa = consumer()
  res.redirect(oa.getAuthorizeUrl(
    response_type: 'code',
    redirect_uri : rkOptions.redirect_uri
  ))
)

app.get('/runkeeper_callback', (req, res) ->
  client.getNewToken(req.param('code'), (access_token) ->
    req.session.access_token = access_token
    client.access_token      = access_token
    res.redirect('/calendar')
  )
)

app.get('/calendar', (req, res) ->
  # Early return in case the access_token isn't set
  if (!req.session.access_token)
    res.redirect('/')
    return
  # Once the data access request gets approved, pull REAL fitness activities.
  # For now, we push dummy data.
  fitnessActivities = JSON.parse(FAKE_ACTIVITY_JSON)['items']

  client.profile((profile) ->
    calDisplay = new calendar.CalendarDisplay(fitnessActivities)
    res.render('calendar',
      title      : 'calendar data!'
      activities : fitnessActivities
      user       : JSON.parse(profile)
      calData    : calDisplay.getElts()
    )
  )
)

app.helpers(require(__dirname + '/helpers.js').helpers)

port = process.env.PORT || 3000
app.listen(port, ->
  console.log("Express server listening on port %d in %s mode", port, app.settings.env)
)
