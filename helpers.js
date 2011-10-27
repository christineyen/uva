(function() {
  var HOUR, METERS_IN_A_MILE, MINUTE;
  METERS_IN_A_MILE = 1609.344;
  HOUR = 3600;
  MINUTE = 60;
  exports.helpers = {
    metersToMi: function(meters) {
      return (meters / METERS_IN_A_MILE).toFixed(2);
    },
    secondsToHms: function(seconds) {
      var hours, minutes;
      hours = Math.floor(seconds / HOUR);
      seconds -= hours * HOUR;
      minutes = Math.floor(seconds / MINUTE);
      seconds -= minutes * MINUTE;
      return [hours, minutes, seconds].join(':');
    },
    formatTime: function(rkTimeString) {
      return rkTimeString.replace(/\s\d{4}/, ' at').replace(/, (\d+) (\w+)/, ", $2 $1").replace(/:\d{2}$/, '');
    },
    pace: function(meters, seconds) {
      var miles, minutes;
      minutes = seconds / 60;
      miles = meters / METERS_IN_A_MILE;
      return (minutes / miles).toFixed(2);
    }
  };
}).call(this);
