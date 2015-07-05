var express = require('express');
var router = express.Router();
var initDataTables = require('../lib/init-datatables');


router.get('/', function(req, res, next) {
  res.render('zipcodes', { title: 'MongoDB & DataTables' });
});

router.get('/zipcodes.json', initDataTables('zipcodes'));

module.exports = router;