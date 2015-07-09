var express = require('express');
var MongoDataTable = require('mongo-datatable');
var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var router = express.Router();
var config = require('../config/dev.dycode');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'DataTables with NodeJS & MongoDB' });
});

router.get('/subscriptions', function(req, res, next) {
  var server = new Server(config.mongodb.host, config.mongodb.port);
  var db = new Db(config.mongodb.dbname, server);

  db.open(function(error, db) {
    new MongoDataTable(db).get('subscriptions', req.query, function(error, result) {
      if (error) {
        console.error(error);
      }

      res.json(result);
    });
  });
});

module.exports = router;
