'use strict';

const asyncjs = require('async');
const forEach = require('lodash/forEach');
const cols = require('./columns');
const validator = require('./validator');

function MongoDataTable(dbObject) {
  this.db = dbObject;
}

MongoDataTable.prototype.get = function get(collectionName, options, onDataReady) {
  const self = this;
  const columns = cols.extractColumns(options);
  const response = {
    draw: 0,
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
    error: null
  };

  const searchCriteria = cols.buildSearchCriteria(options);

  function getCollectionLength(callback) {
    if (self.db === null || typeof self.db === 'undefined') {
      return callback(new Error('You are not connected to any database server'));
    }

    const earlyCollection = self.db.collection(collectionName);
    response.draw = parseInt(options.draw, 10);

    earlyCollection
      .find(searchCriteria, columns)
      .count((error, result) => {

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
    const showAlertOnError = options.showAlertOnError;

    if (!showAlertOnError) {
      options.showAlertOnError = false;
    }

    return callback(null);
  }

  function getAndSortData(callback) {
    const sortOrder = cols.buildColumnSortOrder(options);
    let collection = self.db.collection(collectionName);

    collection = collection.find(searchCriteria, columns);

    if (parseInt(options.length) > 0) {
      collection = collection
        .skip(parseInt(options.start))
        .limit(parseInt(options.length));
    }

    forEach(sortOrder, (order) => {
      collection = collection.sort(order);
    });

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

  const tasks = [
    validateOptions,
    buildDefaultValue,
    getCollectionLength,
    getAndSortData
  ];

  asyncjs.waterfall(tasks, returnData);
};

module.exports = MongoDataTable;
