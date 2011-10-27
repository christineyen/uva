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

    [ hours, minutes, seconds ].join(':')
  formatTime: (rkTimeString) ->
    # Runkeeper hands us times like "Tue, 1 Mar 2011 07:00:00"
     # We want to retur ones like "Mar 1, 2011 (Tues) at 01:50AM"
    Date.parse(rkTimeString).toString('MMM d, yyyy (ddd) @ hh:mmtt')
  pace: (meters, seconds) ->
    minutes = seconds/60
    miles = meters / METERS_IN_A_MILE
    (minutes / miles).toFixed(2)

exports.helpers =
  metersToMi   : conversions.metersToMi
  secondsToHms : conversions.secondsToHms
  formatTime   : conversions.formatTime
  pace         : conversions.pace
