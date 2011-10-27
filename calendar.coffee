Cell = (day, isActive) ->
  # Each "cell" has:
  # 1) .day() - the day of the month
  # 2) .activities() - a list of activities started on that day
  # 3) .class() - any other strings the frontend should know about,
  #   e.g. 'inactive' and/or 'today.' adds 'hasActivities' by default if
  #   activities().length > 0
  this.day = day
  this.active = isActive

Cell.prototype.class = ->
  if this.active then 'active' else 'inactive'
 

calendarHelpers =
  _activitiesByMonth: (activities) ->
    # @param: activities - a bunch of JSON objects with start_time parameters
    # returns: a dictionary with 'month' keys (e.g. "March 2011") and array
    #     values (containing the original activities, partitioned by month)
    actByMonth = {}
    for act in activities
      d = Date.parse(act['start_time'])
      monthKey = d.toString('MMMM yyyy')

      actByMonth[monthKey] ?= []
      actByMonth[monthKey].push(act)
    actByMonth

  _fillMonth: (monthStr, activities) ->
    # @param: activities - a bunch of JSON objects with start_time parameters,
    #     relevant for a particular month
    # returns: an array of Cells, 1 per cell in a table representing the month.
    #     Includes "inactive" Cells to represent days of other months.
    #
    # ready to be handed off to the template

    monthCells  = []
    # month is the first day of the month represented by monthStr
    month       = Date.parse(monthStr)
    monthOffset = month.getDay()

    # handle days of previous month - prepend month.getDay() days
    # e.g. if month starts on a Tuesday, getDay() is 2 - so if the previous
    #   month was January, we prepend [30..31]
    if monthOffset > 0
      month.addMonths(-1)
      prevMoDays  = Date.getDaysInMonth(month.getFullYear(), month.getMonth())
      prevMoStart = prevMoDays - (monthOffset - 1)

      for day in [ prevMoStart .. prevMoDays ]
        monthCells.push(new Cell(day, false))
      month.addMonths(1)

    # Now the current month
    for day in [ 1 .. Date.getDaysInMonth(month.getFullYear(), month.getMonth()) ]
      monthCells.push(new Cell(day, true))

    # Now the next month, if necessary
    missingNumDays = (monthCells.length % 7)
    if missingNumDays > 0
      for day in [ 1 .. (7 - missingNumDays) ]
        monthCells.push(new Cell(day, false))

    # Now we push on activities, indexing into the array by using monthOffset
    #
    #
    #
    #

    monthCells
 
  getElts: (activities) ->
    # @param: activities - a bunch of JSON objects with start_time parameters
    # returns: a dictionary of values. Each top-level key is the name of a
    #     month represented in the list of activities. Each top-level
    #     value is a 7xn array of Cells, each representing a cell in a table
    #     for each month.

    # Step 1: break activities into groups by month
    actByMonth = calendarHelpers._activitiesByMonth(activities)

    # Step 2: pass each month's worth of activities into a "filler" step, where
    # the month's days are generated and populated with relevant activities
    for monthName, activities of actByMonth
      actByMonth[monthName] = calendarHelpers._fillMonth(monthName, activities)

    actByMonth

exports.helpers =
  getElts : calendarHelpers.getElts

