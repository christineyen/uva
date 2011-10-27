(function() {
  var HOUR, METERS_IN_A_MILE, MINUTE, conversions;
  METERS_IN_A_MILE = 1609.344;
  HOUR = 3600;
  MINUTE = 60;
  conversions = {
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
      return Date.parse(rkTimeString).toString('MMM d, yyyy (ddd) @ hh:mmtt');
    },
    pace: function(meters, seconds) {
      var miles, minutes;
      minutes = seconds / 60;
      miles = meters / METERS_IN_A_MILE;
      return (minutes / miles).toFixed(2);
    }
  };
  exports.helpers = {
    metersToMi: conversions.metersToMi,
    secondsToHms: conversions.secondsToHms,
    formatTime: conversions.formatTime,
    pace: conversions.pace
  };
}).call(this);
