var express = require('express');
var router = express.Router();
var initDataTables = require('../lib/init-datatables');
var config = require('../config/dev.local');


router.get('/', function(req, res, next) {
  res.render('zipcodes', { title: 'MongoDB & DataTables' });
});

router.get('/zipcodes.json', 
  initDataTables(config.mongodb.connectionUri, 'zipcodes')
);

module.exports = router;