(function() {
  var CalendarDisplay, Cell;
  Cell = function(day, isActive) {
    /*
      # Each Cell represents a square in a calendar. This is a class for the purpose
      # of providing lots of assistance to the view.
      */    this.day = day;
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
    var act, _i, _len, _ref, _results;
    _ref = this._activities;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      act = _ref[_i];
      _results.push(act['type']);
    }
    return _results;
  };
  Cell.prototype.toString = function() {
    return "Day: " + this.day + "   Classes: " + (this["class"]()) + "   Activities: " + (this.activities());
  };
  CalendarDisplay = exports.CalendarDisplay = function(activities) {
    /*
      # Handles the partitioning of a raw list of FitnessActivities, provided by
      # RunKeeper, into days by month and readying the data to be rendered by the
      # frontend.
      */    this._activities = activities;
    return this;
  };
  CalendarDisplay.prototype._activitiesByMonth = function() {
    var act, actByMonth, d, monthKey, _i, _len, _ref, _ref2;
    actByMonth = {};
    _ref = this._activities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      act = _ref[_i];
      d = Date.parse(act['start_time']);
      monthKey = d.toString('MMMM yyyy');
            if ((_ref2 = actByMonth[monthKey]) != null) {
        _ref2;
      } else {
        actByMonth[monthKey] = [];
      };
      actByMonth[monthKey].push(act);
    }
    return actByMonth;
  };
  CalendarDisplay.prototype._fillMonth = function(monthStr, activities) {
    var act, d, day, missingNumDays, month, monthCells, monthOffset, prevMoDays, prevMoStart, _i, _len, _ref, _ref2;
    month = Date.parse(monthStr);
    monthOffset = month.getDay();
    monthCells = [];
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
  };
  CalendarDisplay.prototype.getElts = function() {
    var actByMonth, activities, monthName;
    actByMonth = this._activitiesByMonth();
    for (monthName in actByMonth) {
      activities = actByMonth[monthName];
      actByMonth[monthName] = this._fillMonth(monthName, activities);
    }
    return actByMonth;
  };
}).call(this);
