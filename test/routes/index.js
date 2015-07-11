var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// does not require mongo-datatable from npm.
// Uses locally developed version instead
var MongoDataTable = require('../../index');
var config = require('../config/local');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'MongoDB Datatable' });
});

router.get('/zipcodes.json', function(req, res) { 
  var emptyResponse = {
    draw: 0,
    totalRecords: 0,
    totalRecordsFitlered: 0,
    data: []
  };

  MongoClient.connect(config.mongodb.connectionUri, function(err, db) {
    if (err) {
      console.error(err);
      res.json(emptyResponse);
      return;
    }

    new MongoDataTable(db).get('zipcodes', req.query, function(err, result) {
      if (err) {
        console.error(err);
        res.json(emptyResponse);
        return;
      }

      res.json(result);
    });
  });
});

module.exports = router;
