const moment = require('moment-timezone');
moment.tz.setDefault('America/Los_Angeles');

// See https://stackoverflow.com/a/28431880/1855917
exports.stringToDate = string => {
  return new Date(`${string.substring(0, 10)}T00:00:00Z`);
};

exports.dateToString = date => {
  return date.toISOString().substring(0, 10);
};

exports.previousDay = date => {
  return moment(date).subtract(1, 'day').toDate();
};

exports.previousWeek = date => {
  return moment(date).subtract(1, 'week').toDate();
};

exports.previousMonth = date => {
  return moment(date).subtract(1, 'month').toDate();
}

exports.startOfWeek = (date = new Date()) => {
  return moment(date).startOf('isoWeek').toDate();
}

exports.endOfWeek = (date = new Date()) => {
  return moment(date).endOf('isoWeek').toDate();
}

exports.startOfMonth = (date = new Date()) => {
  return moment(date).startOf('month').toDate();
}

exports.endOfMonth = (date = new Date()) => {
  return moment(date).endOf('month').subtract(1, 'day').toDate();
}

exports.daysAgo = (days) => {
  return moment(new Date()).subtract(days, 'day').toDate();
}

