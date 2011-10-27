(function() {
  var Cell, calendarHelpers;
  Cell = function(day, isActive) {
    this.day = day;
    return this.active = isActive;
  };
  Cell.prototype["class"] = function() {
    if (this.active) {
      return 'active';
    } else {
      return 'inactive';
    }
  };
  calendarHelpers = {
    _activitiesByMonth: function(activities) {
      var act, actByMonth, d, monthKey, _i, _len, _ref;
      actByMonth = {};
      for (_i = 0, _len = activities.length; _i < _len; _i++) {
        act = activities[_i];
        d = Date.parse(act['start_time']);
        monthKey = d.toString('MMMM yyyy');
                if ((_ref = actByMonth[monthKey]) != null) {
          _ref;
        } else {
          actByMonth[monthKey] = [];
        };
        actByMonth[monthKey].push(act);
      }
      return actByMonth;
    },
    _fillMonth: function(monthStr, activities) {
      var day, missingNumDays, month, monthCells, monthOffset, prevMoDays, prevMoStart, _ref, _ref2;
      monthCells = [];
      month = Date.parse(monthStr);
      monthOffset = month.getDay();
      if (monthOffset > 0) {
        month.addMonths(-1);
        prevMoDays = Date.getDaysInMonth(month.getFullYear(), month.getMonth());
        prevMoStart = prevMoDays - (monthOffset - 1);
        for (day = prevMoStart; prevMoStart <= prevMoDays ? day <= prevMoDays : day >= prevMoDays; prevMoStart <= prevMoDays ? day++ : day--) {
          monthCells.push(new Cell(day, false));
        }
        month.addMonths(1);
      }
      for (day = 1, _ref = Date.getDaysInMonth(month.getFullYear(), month.getMonth()); 1 <= _ref ? day <= _ref : day >= _ref; 1 <= _ref ? day++ : day--) {
        monthCells.push(new Cell(day, true));
      }
      missingNumDays = monthCells.length % 7;
      if (missingNumDays > 0) {
        for (day = 1, _ref2 = 7 - missingNumDays; 1 <= _ref2 ? day <= _ref2 : day >= _ref2; 1 <= _ref2 ? day++ : day--) {
          monthCells.push(new Cell(day, false));
        }
      }
      return monthCells;
    },
    getElts: function(activities) {
      var actByMonth, monthName;
      actByMonth = calendarHelpers._activitiesByMonth(activities);
      for (monthName in actByMonth) {
        activities = actByMonth[monthName];
        actByMonth[monthName] = calendarHelpers._fillMonth(monthName, activities);
      }
      return actByMonth;
    }
  };
  exports.helpers = {
    getElts: calendarHelpers.getElts
  };
}).call(this);
