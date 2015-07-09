function isOptionsValid(options, immediateCallback) {
  if (typeof options === 'undefined') {
    immediateCallback(new Error('Options must be defined!'));
    return;
  }

  if (typeof options.columns === 'undefined') {
    immediateCallback(new Error('Columns must be defined!'));
    return;
  }

  if (typeof options.order === 'undefined') {
    immediateCallback(new Error('Columns order field must be defined!'));
    return;
  }

  if (typeof options.search === 'undefined') {
    immediateCallback(new Error('Search field must be defined!'));
    return;
  }

  var isStartValid = (typeof options.start !== 'undefined' 
    || parseInt(options.start, 10) >= 0);

  if (!isStartValid) {
    immediateCallback(new Error('Start field must be defined!'));
    return;
  }

  var isLengthValid = (typeof options.length !== 'undefined'
    || parseInt(options.length, 10) > 0);

  if (!isLengthValid) {
    immediateCallback(new Error('Length field must be defined!'));
    return;
  }

  immediateCallback(null);
}

exports.isOptionsValid = isOptionsValid;