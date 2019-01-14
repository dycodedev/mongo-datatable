'use strict';

var asyncjs = require('async');
var forEach = require('lodash/forEach');
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

  var searchCriteria = cols.buildSearchCriteria(options);
  var aggQuery = cols.buildAggregateQuery(searchCriteria, options);

  function getCollectionLength(callback) {
    if (self.db === null || typeof self.db === 'undefined') {
      return callback(new Error('You are not connected to any database server'));
    }

    var earlyCollection = self.db.collection(collectionName);
    response.draw = parseInt(options.draw, 10);

    if (options.aggregateQuery) {

      var aggCountQuery = aggQuery.concat([{$group: { _id: null, count: { $sum: 1 } }}]);

      earlyCollection.aggregate(aggCountQuery).toArray(function(error, result) {

        if (error) {
          return callback(error, null);
        }

        if (result.length==1) {
          response.recordsTotal = result[0]['count'];
          response.recordsFiltered = result[0]['count'];
        } else {
          response.recordsTotal = 0;
          response.recordsFiltered = 0;
        }


        return callback(null);
      });

    } else {

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
    
    var collection = self.db.collection(collectionName);

    if (options.aggregateQuery) {

      var aggSortOrder = cols.buildAggregateQuerySortOrder(options);

      if (Object.keys(aggSortOrder['$sort']).length>0) {
        aggQuery.push(aggSortOrder);
      }

      if (parseInt(options.length) > 0) {
        aggQuery.push({
          '$skip': parseInt(options.start),
        });
        aggQuery.push({
          '$limit': parseInt(options.length),
        });
      }

      collection = collection.aggregate(aggQuery);

    } else {

      var sortOrder = cols.buildColumnSortOrder(options);
      
      collection = collection.find(searchCriteria, columns);
      if (parseInt(options.length) > 0) {
        collection = collection
          .skip(parseInt(options.start))
          .limit(parseInt(options.length));
      }

      forEach(sortOrder, function(order) {
        collection = collection.sort(order);
      });

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

  asyncjs.waterfall(tasks, returnData);
};

module.exports = MongoDataTable;
