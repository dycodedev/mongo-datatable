'use strict';

function isOptionsValid(options, immediateCallback) {
  if (typeof options === 'undefined') {
    return immediateCallback(new Error('Options must be defined!'));
  }

  if (typeof options.columns === 'undefined') {
    return immediateCallback(new Error('Columns must be defined!'));
  }

  if (typeof options.order === 'undefined') {
    return immediateCallback(new Error('Columns order field must be defined!'));
  }

  if (typeof options.search === 'undefined') {
    return immediateCallback(new Error('Search field must be defined!'));
  }

  const isStartValid = (typeof options.start !== 'undefined'
    && parseInt(options.start, 10) >= 0);

  const isLengthValid = (typeof options.length !== 'undefined'
    && parseInt(options.length, 10) > 0);

  if (!isStartValid) {
    return immediateCallback(new Error('Start field must be defined!'));
  }

  if (!isLengthValid) {
    return immediateCallback(new Error('Length field must be defined!'));
  }

  return immediateCallback(null);
}

module.exports = {
  isOptionsValid,
};

