METERS_IN_A_MILE = 1609.344
HOUR             = 3600
MINUTE           = 60

conversions =
  metersToMi: (meters) ->
    (meters / METERS_IN_A_MILE).toFixed(2)
  secondsToHms: (seconds) ->
    hours = Math.floor(seconds / HOUR)
    seconds -= hours * HOUR

    minutes = Math.floor(seconds / MINUTE)
    seconds -= minutes * MINUTE

    [ hours, minutes, Math.floor(seconds) ].join(':')
  pace: (meters, seconds) ->
    minutes = seconds/60
    miles = meters / METERS_IN_A_MILE
    (minutes / miles).toFixed(2)

viewHelpers =
  formatDateTime: (rkTimeString) ->
    # RunKeeper hands us times like "Tue, 1 Mar 2011 07:00:00"
     # We want to retur ones like "Mar 1, 2011 (Tues) at 1:50PM"
    Date.parse(rkTimeString).toString('MMM d, yyyy (ddd) @ h:mmtt')
  formatTimeDuration: (rkTimeString, seconds) ->
    start = Date.parse(rkTimeString)
    end = start.clone().addSeconds(seconds)
    start.toString('hh:mmtt') + ' - ' + end.toString('hh:mmtt')
  cellToolTip: (act) ->
    dist = act['total_distance']
    dur  = act['duration']

    tips = []
    tips.push("#{ conversions.metersToMi(dist) } miles (#{ conversions.pace(dist, dur) } min/mi)")
    tips.push(viewHelpers.formatTimeDuration(act['start_time'], act['duration']))
    tips.join('<br/>')

exports.helpers =
  metersToMi     : conversions.metersToMi
  secondsToHms   : conversions.secondsToHms
  formatDateTime : viewHelpers.formatDateTime
  formatTime     : viewHelpers.formatTime
  cellToolTip    : viewHelpers.cellToolTip
  pace           : conversions.pace
