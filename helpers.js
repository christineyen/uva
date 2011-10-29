(function() {
  var HOUR, METERS_IN_A_MILE, MINUTE, conversions, viewHelpers;
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
    pace: function(meters, seconds) {
      var miles, minutes;
      minutes = seconds / 60;
      miles = meters / METERS_IN_A_MILE;
      return (minutes / miles).toFixed(2);
    }
  };
  viewHelpers = {
    formatDateTime: function(rkTimeString) {
      return Date.parse(rkTimeString).toString('MMM d, yyyy (ddd) @ hh:mmtt');
    },
    formatTimeDuration: function(rkTimeString, seconds) {
      var end, start;
      start = Date.parse(rkTimeString);
      end = start.clone().addSeconds(seconds);
      return start.toString('hh:mmtt') + ' - ' + end.toString('hh:mmtt');
    },
    cellToolTip: function(act) {
      var dist, dur, tips;
      dist = act['total_distance'];
      dur = act['duration'];
      tips = [];
      tips.push("" + (conversions.metersToMi(dist)) + " miles (" + (conversions.pace(dist, dur)) + " min/mi)");
      tips.push(viewHelpers.formatTimeDuration(act['start_time'], act['duration']));
      return tips.join('<br/>');
    }
  };
  exports.helpers = {
    metersToMi: conversions.metersToMi,
    secondsToHms: conversions.secondsToHms,
    formatDateTime: viewHelpers.formatDateTime,
    formatTime: viewHelpers.formatTime,
    cellToolTip: viewHelpers.cellToolTip,
    pace: conversions.pace
  };
}).call(this);
