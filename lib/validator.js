var util = require('util');

function isOptionsValid(options, immediateCallback) {
  if (typeof options === 'undefined')
    return immediateCallback(new Error('Options must be defined!'));

  if (typeof options.columns === 'undefined')
    return immediateCallback(new Error('Columns must be defined!'));

  if (typeof options.order === 'undefined')
    return immediateCallback(new Error('Columns order field must be defined!'));

  if (typeof options.search === 'undefined')
    return immediateCallback(new Error('Search field must be defined!'));

  if (typeof options.aggregateQuery !== 'undefined' && (!util.isArray(options.aggregateQuery) || options.aggregateQuery.length==0) )
    return immediateCallback(new Error('Aggregate query must be non empty array object!'));

  var isStartValid = (typeof options.start !== 'undefined'
    || parseInt(options.start, 10) >= 0);

  var isLengthValid = (typeof options.length !== 'undefined'
    || parseInt(options.length, 10) > 0);

  if (!isStartValid)
    return immediateCallback(new Error('Start field must be defined!'));

  if (!isLengthValid)
    return immediateCallback(new Error('Length field must be defined!'));

  return immediateCallback(null);
}

exports.isOptionsValid = isOptionsValid;
