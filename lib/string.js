'use strict';

function escapeNonAlphanumeric(string) {
  return string.replace(/[\W\s]/g, '\\$&');
}

function stringToBoolean(string) {
  if (typeof string === 'boolean') {
    return string;
  }

  if (string === 'true') {
    return true;
  } else if (string === 'false') {
    return false;
  }

  throw new Error('Argument passed is not boolean type');
}

module.exports = {
  escapeNonAlphanumeric,
  stringToBoolean,
};
