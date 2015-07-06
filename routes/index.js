var express = require('express');
var router = express.Router();
var initDataTables = require('../lib/init-datatables');
var config = require('../config/dev.dycode');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'DataTables with NodeJS & MongoDB' });
});

router.get('/subscriptions', 
  initDataTables(config.mongodb.connectionUri,'subscriptions')
);

module.exports = router;
