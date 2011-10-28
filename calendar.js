(function() {
  var Cell, calendarHelpers;
  Cell = function(day, isActive) {
    this.day = day;
    this.active = isActive;
    this._activities = [];
    return this;
  };
  Cell.prototype["class"] = function() {
    if (this.active) {
      return 'active';
    } else {
      return 'inactive';
    }
  };
  Cell.prototype.addActivity = function(activity) {
    return this._activities.push(activity);
  };
  Cell.prototype.activities = function() {
    var act, _i, _len, _ref, _results;
    _ref = this._activities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      act = _ref[_i];
      _results.push(act['type']);
    }
    return _results;
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
      var act, d, day, missingNumDays, month, monthCells, monthOffset, prevMoDays, prevMoStart, _i, _len, _ref, _ref2;
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
      for (_i = 0, _len = activities.length; _i < _len; _i++) {
        act = activities[_i];
        d = Date.parse(act['start_time']);
        monthCells[(monthOffset - 1) + d.getDate()].addActivity(act);
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
