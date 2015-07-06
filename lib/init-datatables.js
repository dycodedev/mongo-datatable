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
        callback(new Error('Columns are not provided'), null);
        return;
      }

      var collection = db.collection(collectionName);
      var fields = {};

      for (index in extractedColumnNames) {
        fields[extractedColumnNames[index]] = 1;
      }

      collection = collection.find({}, fields);
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

        console.log(sortObject);
      }

      cursor.toArray(callback);
    }

    function paginateData(docs, callback) {

      if (docs.length < 1) {
        callback(new Error('There\'s no data in database'), null);
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
        response.error = error;
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