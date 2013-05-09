# Module dependencies.
express = require('express')
oauth   = require('oauth')
helpers = require('./helpers').helpers

app = express()

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
  app.use(express.static(__dirname + '/public'))
)
app.engine('jade', require('jade').__express)

app.configure('development', ->
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  app.use(express.session(
    secret: 'sdofyi234oglkc@oydf'
  ))
)

app.configure('production', ->
  app.use(express.errorHandler())
  app.use(express.session(
    secret: 'sdofyi234oglkc@oydf'
  ))
)

# Routes
app.get('/', (req, res) ->
  res.render('index')
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
  errors = []

  client.profile((profile) ->
    fitnessActivities = []
    profileInfo = {}
    try
      profileInfo = JSON.parse(profile)
    catch error
      errors.push(error)

    client.fitnessActivityFeed((activities) ->
      try
        fitnessActivities = JSON.parse(activities)['items']
        calDisplay = new calendar.CalendarDisplay(fitnessActivities)
      catch error
        console.log(error)
        errors.push(error)

      res.render('calendar',
        title      : 'calendar data!'
        activities : fitnessActivities
        user       : profileInfo
        calData    : calDisplay.getElts()
        errors     : errors
        h          : helpers
      )
    )

  )
)

port = process.env.PORT || 3000
app.listen(port, ->
  console.log("Express server listening on port %d in %s mode", port, app.settings.env)
)
