// Generated by CoffeeScript 1.6.2
(function() {
  var CalendarDisplay, Cell, moment;

  moment = require('moment');

  Cell = function(day, isActive) {
    /*
    # Each Cell represents a square in a calendar. This is a class for the purpose
    # of providing lots of assistance to the view.
    */
    this.day = day;
    this.active = isActive;
    this._activities = [];
    return this;
  };

  Cell.prototype["class"] = function() {
    var classes;

    classes = this.active ? ['active'] : ['inactive'];
    if (this._activities.length > 0) {
      classes.push('hasActivities');
    }
    return classes.join(' ');
  };

  Cell.prototype.addActivity = function(activity) {
    return this._activities.push(activity);
  };

  Cell.prototype.activities = function() {
    return this._activities;
  };

  Cell.prototype.toString = function() {
    return "Day: " + this.day + "   Classes: " + (this["class"]()) + "   Activities: " + (this.activities());
  };

  CalendarDisplay = exports.CalendarDisplay = function(activities) {
    /*
    # Handles the partitioning of a raw list of FitnessActivities, provided by
    # RunKeeper, into days by month and readying the data to be rendered by the
    # frontend.
    */
    this._activities = activities.reverse();
    return this;
  };

  CalendarDisplay.prototype.activitiesByMonth = function() {
    var act, actByMonth, monthKey, _i, _len, _ref, _ref1;

    actByMonth = {};
    _ref = this._activities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      act = _ref[_i];
      monthKey = moment(act['start_time']).format('MMMM YYYY');
      if ((_ref1 = actByMonth[monthKey]) == null) {
        actByMonth[monthKey] = [];
      }
      actByMonth[monthKey].push(act);
    }
    return actByMonth;
  };

  CalendarDisplay.prototype._fillMonth = function(monthStr, activities) {
    var act, d, day, missingNumDays, month, monthCells, monthOffset, prevMoDays, prevMoStart, _i, _j, _k, _l, _len, _ref, _ref1;

    month = moment(monthStr);
    monthOffset = month.day();
    monthCells = [];
    if (monthOffset > 0) {
      month.subtract('months', 1);
      prevMoDays = month.daysInMonth();
      prevMoStart = prevMoDays - (monthOffset - 1);
      for (day = _i = prevMoStart; prevMoStart <= prevMoDays ? _i <= prevMoDays : _i >= prevMoDays; day = prevMoStart <= prevMoDays ? ++_i : --_i) {
        monthCells.push(new Cell(day, false));
      }
      month.add('months', 1);
    }
    for (day = _j = 1, _ref = month.daysInMonth(); 1 <= _ref ? _j <= _ref : _j >= _ref; day = 1 <= _ref ? ++_j : --_j) {
      monthCells.push(new Cell(day, true));
    }
    missingNumDays = monthCells.length % 7;
    if (missingNumDays > 0) {
      for (day = _k = 1, _ref1 = 7 - missingNumDays; 1 <= _ref1 ? _k <= _ref1 : _k >= _ref1; day = 1 <= _ref1 ? ++_k : --_k) {
        monthCells.push(new Cell(day, false));
      }
    }
    for (_l = 0, _len = activities.length; _l < _len; _l++) {
      act = activities[_l];
      d = moment(act['start_time']);
      monthCells[(monthOffset - 1) + d.date()].addActivity(act);
    }
    return monthCells;
  };

  CalendarDisplay.prototype.getElts = function() {
    var actByMonth, activities, monthName;

    actByMonth = this.activitiesByMonth();
    for (monthName in actByMonth) {
      activities = actByMonth[monthName];
      actByMonth[monthName] = this._fillMonth(monthName, activities);
    }
    return actByMonth;
  };

}).call(this);
