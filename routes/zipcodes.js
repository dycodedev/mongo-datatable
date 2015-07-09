var express = require('express');
var router = express.Router();
var config = require('../config/dev.local');
var MongoDataTable = require('mongo-datatable');
var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
  res.render('zipcodes', { title: 'MongoDB & DataTables' });
});

router.get('/zipcodes.json', function(req, res, next) {
  MongoClient.connect(config.mongodb.connectionUri, function(error, db) {
    var mongodt = new MongoDataTable(db);
    mongodt.get('zipcodes', req.query, returnData);

    function returnData(error, result) {
      if (error) {
        console.error(error);
        return;
      }

      res.json(result);
    }
  });
});

module.exports = router;