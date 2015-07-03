var express = require('express');
var async = require('async');

var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var config = require('../config/dev.local');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'DataTables with NodeJS & MongoDB' });
});

router.get('/subscriptions', function(req, res, next) {
  var arrayOfColumn = [
    '_id',
    'subs_name',
    'subs_screen_name',
    'services',
    'state'
  ];

  var response = {
    iTotalRecords: 0,
    iTotalDisplayRecords: 0,
    sEcho: parseInt(req.query.sEcho, 10),
    aaData: []
  }

  function initConnection(onConnected) {
    MongoClient.connect(config.mongodb.connectionUri, onConnected);
  }

  function getDocuments(db, processDocuments) {
    var collection = db.collection('subscriptions');
    var processing = collection.find();

    // decide which field to sort documents by
    for (var i = 0; i < arrayOfColumn.length; i++) {
      if (!!req.query['iSortCol_' + i]) {
        var sortColumn = parseInt(req.query['iSortCol_' + i]);
        sortColumn = arrayOfColumn[sortColumn];
        var sortDirection = (req.query['sSortDir_' + i] === 'asc')
          ? 1
          : -1;

        var sortObject = {};
        sortObject[sortColumn] = sortDirection;
        processing = processing.sort(sortObject);

        console.log(sortObject);
      }
    }

    // return as an array of documents
    processing.toArray(processDocuments);
  }

  function processDocuments(documents, returnToUser) {
    if (documents.length < 1) {
      returnToUser(new Error('There\'s no data in database'), null);
      return;
    }
    var startPosition = parseInt(req.query.iDisplayStart, 10);
    var displayLength = parseInt(req.query.iDisplayLength, 10);
    var newdocuments = documents.slice(startPosition, displayLength);
    response.iTotalRecords = documents.length;

    returnToUser(null, newdocuments);
  }

  function returnToUser(error, documents) {
    if (!error) {
      response.aaData = documents;
      response.iTotalDisplayRecords = documents.length;
    }

    console.log(req.query);
    res.json(response);
  }

  async.waterfall(
    [initConnection, getDocuments, processDocuments],
    returnToUser
  );

});

module.exports = router;
