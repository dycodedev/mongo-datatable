var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var MongoDataTable = require('../../index');
var config = require('../config/dycode');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('subs', { title: 'MongoDB DataTable' });
});

router.get('/subs.json', function(req, res) {
  var emptyResponse = {
    draw: 0,
    totalRecords: 0,
    totalRecordsFiltered: 0,
    data: []
  };

  MongoClient.connect(config.mongodb.connectionUri, function(mongoError, db) {
    if (mongoError) {
      console.error(mongoError);
      res.json(emptyResponse);
      return;
    }

    new MongoDataTable(db).get('subscriptions', req.query, function(error, result) {
      if (error) {
        console.error(error);
        res.json(emptyResponse);
        return;
      }

      res.json(result);
    });
  });
});

module.exports = router;