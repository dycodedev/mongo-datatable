var async = require('async');
var cols = require('./columns');
var validator = require('./validator');

function MongoDataTable(dbObject) {
  this.db = dbObject;
}

MongoDataTable.prototype.get = function(collectionName, options, onDataReady) {
  var self = this;
  var columns = cols.extractColumns(options);

  var response = {
    draw: 0,
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
    error: null
  };

  function getCollectionLength(callback) {
    if (self.db === null || typeof self.db === 'undefined') {
      return callback(new Error('You are not connected to any database server'));
    }

    var searchCriteria = cols.buildSearchCriteria(options);
    var earlyCollection = self.db.collection(collectionName);
    response.draw = parseInt(options.draw, 10);

    earlyCollection
      .find(searchCriteria, columns)
      .count(function(error, result) {

        if (error) {
          return callback(error, null);
        }

        response.recordsTotal = result;
        response.recordsFiltered = result;

        return callback(null);
      });
  }

  function validateOptions(callback) {
    validator.isOptionsValid(options, callback);
  }

  function buildDefaultValue(callback) {
    var showAlertOnError = options.showAlertOnError;

    if (!showAlertOnError) {
      options.showAlertOnError = false;
    }

    return callback(null);
  }

  function getAndSortData(callback) {
    var sortOrder = cols.buildColumnSortOrder(options);
    var collection = self.db.collection(collectionName);
    var searchCriteria = cols.buildSearchCriteria(options);

    collection = collection.find(searchCriteria, columns)
      .skip(parseInt(options.start))
      .limit(parseInt(options.length))

    for (index in sortOrder) {
      collection = collection.sort(sortOrder[index]);
    }

    collection.toArray(callback);
  }

  function returnData(error, result) {
    if (error) {
      if (options.showAlertOnError) {
        response.error = error.message;
      }

      return onDataReady(error, response);
    }

    // Everything's ok!
    response.data = result;
    return onDataReady(null, response);
  }

  var tasks = [
    validateOptions,
    buildDefaultValue,
    getCollectionLength,
    getAndSortData
  ];

  async.waterfall(tasks, returnData);
};

module.exports = MongoDataTable;