var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var async = require('async');

function populateColumnNames(req) {
  var columnLength = req.query.columns.length;
  var extractedColumnNames = [];
  
  for (var i = 0; i < columnLength; i++) {
    extractedColumnNames.push(req.query.columns[i].name);
  }

  return extractedColumnNames;
}

function initializeMongoDataTables(connectionUri, collectionName) {
  function handleRequest(req, res, next) {
    var response = {
      draw: parseInt(req.query.draw, 10),
      recordsTotal: 0,
      recordsFiltered: 0,
      data: [],
      error: null
    };

    function initializeConnection(callback) {
      MongoClient.connect(connectionUri, callback);
    }

    function queryData(db, callback) {
      var extractedColumnNames = populateColumnNames(req);

      if (extractedColumnNames.length < 1) {
        callback(new Error('Columns data are not provided'), null);
        return;
      }

      var collection = db.collection(collectionName);
      var fields = {};
      var searchCriteria = { $or: [] };
      var fieldValuePair = {};
      var columnName;
      var searchValue = req.query.search.value.replace(/[\W\s]/g, '\\$&');

      for (index in extractedColumnNames) {
        columnName = extractedColumnNames[index];
        fields[columnName] = 1;
        fieldValuePair = {};

        if (!!searchValue) {
          fieldValuePair[columnName] = new RegExp(searchValue);
          searchCriteria['$or'].push(fieldValuePair);
        }
      }

      if (searchCriteria['$or'].length < 1) {
        searchCriteria = {};
      }

      collection = collection.find(searchCriteria, fields);
      callback(null, collection);
    }

    function sortData(cursor, callback) {
      var extractedColumnNames = populateColumnNames(req);
      var orders = req.query.order;
      var sortObject = {}
      var columnIndex;
      var orderedColumn;
      var orderDirection;

      for (index in orders) {
        columnIndex = parseInt(orders[index].column, 10);
        orderedColumn = extractedColumnNames[columnIndex];
        orderDirection = (orders[index].dir === 'asc')
          ? 1
          : -1;
        sortObject[orderedColumn] = orderDirection;
        cursor = cursor.sort(sortObject)
      }

      cursor.toArray(callback);
    }

    function paginateData(docs, callback) {
      if (docs.length < 1) {
        callback(null, []);
        return;
      }

      var start = parseInt(req.query.start, 10);
      var length = parseInt(req.query.length, 10);
      var newDocs = docs.slice(start, length + start);
      response.recordsTotal = docs.length;
      response.recordsFiltered = response.recordsTotal;

      callback(null, newDocs);
    }

    function sendData(error, result) {
      if (error) {
        console.error(error);
        response.error = error.message;
      }

      response.data = result;
      res.json(response);
    }

    async.waterfall(
      [initializeConnection, queryData, sortData, paginateData],
      sendData
    );
  }

  return handleRequest;
}

module.exports = initializeMongoDataTables;