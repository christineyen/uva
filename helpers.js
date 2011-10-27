METERS_IN_A_MILE = 1609.344;
HOUR             = 3600;
MINUTE           = 60;

exports.helpers = {
  metersToMi: function(meters) {
    return (meters / METERS_IN_A_MILE).toFixed(2);
  },
  secondsToHms: function(seconds) {
    var hours = Math.floor(seconds / HOUR);
    seconds -= hours * HOUR;

    var minutes = Math.floor(seconds / MINUTE);
    seconds -= minutes * MINUTE;

    return [ hours, minutes, seconds ].join(':');
  },
  formatTime: function(rkTimeString) {
    // Runkeeper hands us times like "Tue, 1 Mar 2011 07:00:00"
    //
    // Short of importing datejs / other nice libraries, we'll just regex the
    // crap out of the default string for now.
    return rkTimeString.replace(/ \d{4}/, ' at')
      .replace(/, (\d+) (\w+)/, ", $2 $1")
      .replace(/:\d{2}$/, '');
  },
  pace: function(meters, seconds) {
    minutes = seconds/60;
    miles = meters / METERS_IN_A_MILE;
    return (minutes / miles).toFixed(2);
  }
}
