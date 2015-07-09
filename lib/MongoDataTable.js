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

  console.log(options.columns);

  function getCollectionLength(callback) {
    if (self.db === null) {
      callback(new Error('You are not connected to any database server!'));
      return;
    }

    var searchCriteria = cols.buildSearchCriteria(options);
    var earlyCollection = self.db.collection(collectionName);
    response.draw = parseInt(options.draw, 10);

    earlyCollection
      .find(searchCriteria, columns)
      .count(function(error, result) {

        if (error) {
          callback(error, null);
          return;
        }

        response.recordsTotal = result;
        response.recordsFiltered = result;

        callback(null);
      });
  }

  function validateOptions(callback) {
    validator.isOptionsValid(options, callback);
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
    response.data = result;

    if (error) {
      onDataReady(error, null);
      return;
    }

    onDataReady(null, response);
  }

  async.waterfall([validateOptions, getCollectionLength, getAndSortData], returnData);
};

module.exports = MongoDataTable;