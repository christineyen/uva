moment  = require('moment')

METERS_IN_A_MILE = 1609.344
HOUR             = 3600
MINUTE           = 60

conversions =
  metersToMi: (meters) ->
    (meters / METERS_IN_A_MILE).toFixed(2)
  secondsToHms: (seconds) ->
    hours = Math.floor(seconds / HOUR)
    seconds = seconds % HOUR
    minutes = Math.floor(seconds / MINUTE)
    seconds = Math.floor(seconds % MINUTE)

    minutes = '0' + minutes if minutes < 10
    seconds = '0' + seconds if seconds < 10
    strParts = [ minutes, seconds ]

    strParts.unshift(hours) if hours > 0
    strParts.join(':')
conversions['pace'] = (meters, seconds) ->
    miles = meters / METERS_IN_A_MILE
    this.secondsToHms(seconds / miles)

viewHelpers =
  formatDateTime: (rkTimeString) ->
    # RunKeeper hands us times like "Tue, 1 Mar 2011 07:00:00"
     # We want to retur ones like "Mar 1, 2011 (Tues) at 1:50PM"
    moment(rkTimeString).format('MMM D, YYYY (ddd) @ h:mmA')
  formatTimeDuration: (rkTimeString, seconds) ->
    start = moment(rkTimeString)
    end = start.clone().add('seconds', seconds)
    start.format('hh:mmA') + ' - ' + end.format('hh:mmA')
  cellToolTip: (act) ->
    dist = act['total_distance']
    dur  = act['duration']

    tips = []
    tips.push("#{ conversions.metersToMi(dist) } miles (#{ conversions.pace(dist, dur) } min/mi)")
    tips.push(viewHelpers.formatTimeDuration(act['start_time'], act['duration']))
    tips.join('<br/>')
  monthToClassName: (monthName) ->
    monthName.replace(/\s/, '').toLowerCase()

exports.helpers =
  metersToMi     : conversions.metersToMi
  secondsToHms   : conversions.secondsToHms
  formatDateTime : viewHelpers.formatDateTime
  formatTime     : viewHelpers.formatTime
  cellToolTip    : viewHelpers.cellToolTip
  pace           : conversions.pace
  monthToClassName : viewHelpers.monthToClassName
