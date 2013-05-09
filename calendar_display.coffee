moment  = require('moment')

Cell = (day, isActive) ->
  ###
  # Each Cell represents a square in a calendar. This is a class for the purpose
  # of providing lots of assistance to the view.
  ###
  this.day         = day
  this.active      = isActive
  this._activities = []
  this

Cell.prototype.class = ->
  # CSS classes to be passed through to the frontend - a string representation
  # of any important attributes of this Cell.
  classes = if this.active then ['active'] else ['inactive']
  classes.push('hasActivities') if this._activities.length > 0
  classes.join(' ')

Cell.prototype.addActivity = (activity) ->
  this._activities.push(activity)

Cell.prototype.activities = ->
  this._activities

Cell.prototype.toString = ->
  "Day: #{ this.day }
   Classes: #{ this.class() }
   Activities: #{ this.activities() }"

CalendarDisplay = exports.CalendarDisplay = (activities) ->
  ###
  # Handles the partitioning of a raw list of FitnessActivities, provided by
  # RunKeeper, into days by month and readying the data to be rendered by the
  # frontend.
  ###
  this._activities = activities
  this

CalendarDisplay.prototype._activitiesByMonth = ->
  # @param: activities - a bunch of JSON objects with start_time parameters
  # returns: a dictionary with 'month' keys (e.g. "March 2011") and array
  #     values (containing the original activities, partitioned by month)
  actByMonth = {}
  for act in this._activities
    monthKey = moment(act['start_time']).format('MMMM YYYY')

    actByMonth[monthKey] ?= []
    actByMonth[monthKey].push(act)
  actByMonth

CalendarDisplay.prototype._fillMonth = (monthStr, activities) ->
  # @param: activities - a bunch of JSON objects with start_time parameters,
  #     relevant for a particular month
  # returns: an array of Cells, 1 per cell in a table representing the month.
  #     Includes "inactive" Cells to represent days of other months.

  # month is the first day of the month represented by monthStr
  month       = moment(monthStr)
  monthOffset = month.date()

  monthCells  = []
  # handle days of previous month - prepend month.getDay() days
  # e.g. if month starts on a Tuesday, getDay() is 2 - so if the previous
  #   month was January, we prepend [30..31]
  if monthOffset > 0
    month.subtract('months', 1)
    prevMoDays  = month.daysInMonth()
    prevMoStart = prevMoDays - (monthOffset - 1)
    for day in [ prevMoStart .. prevMoDays ]
      monthCells.push(new Cell(day, false))
    month.add('months', 1)

  # Now the current month
  for day in [ 1 .. month.daysInMonth() ]
    monthCells.push(new Cell(day, true))

  # Now the next month, if necessary
  missingNumDays = (monthCells.length % 7)
  if missingNumDays > 0
    for day in [ 1 .. (7 - missingNumDays) ]
      monthCells.push(new Cell(day, false))

  # Now we push on activities, indexing into the array by using monthOffset
  for act in activities
    d = moment(act['start_time'])
    monthCells[(monthOffset - 1) + d.date()].addActivity(act)
  monthCells

CalendarDisplay.prototype.getElts = ->
  # @param: activities - a bunch of JSON objects with start_time parameters
  # returns: a dictionary of values. Each top-level key is the name of a
  #     month represented in the list of activities. Each top-level
  #     value is a 7xn array of Cells, each representing a cell in a table
  #     for each month.

  # Step 1: break activities into groups by month
  actByMonth = this._activitiesByMonth()

  # Step 2: pass each month's worth of activities into a "filler" step, where
  # the month's days are generated and populated with relevant activities
  for monthName, activities of actByMonth
    actByMonth[monthName] = this._fillMonth(monthName, activities)
  actByMonth

