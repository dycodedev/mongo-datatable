# Mongo DataTable

Node.js module for server-side processing using jQuery datatables and MongoDB native driver.

Supports:

* jQuery Datatables v1.10
* mongodb native driver v2.0 and later
* MongoDB database server v2.4 and later

## Install

```bash
npm install mongo-datatable
```

## Documentation
This module returns `MongoDataTable` constructor when loaded using `require`.

### MongoDataTable(db)

This constructor takes one argument and must be instantiated using `new` keyword.

__Argument:__

* `db` - An instance of `Db` from `mongodb` module.

### MongoDataTable.prototype.get(collection, options, callback)

This method validates the `options` argument and checks the connection to database. If the `options` is invalid or there is no connection made to database, the callback will be called immediately with error. If everything is ok, the callback will be called with `result`.

__Arguments:__

* `collection` (*String*) - A string represents name of a collection in your database.
* `options` (*Object*) - An object identic to [sent parameter](https://www.datatables.net/manual/server-side#Sent-parameters) by jquery datatables.
* `callback(error, result)` (*Function*) - The `result` parameter is an object identic to  [returned data](https://www.datatables.net/manual/server-side#Returned-data) to jquery datatables.

__Extra Options:__

* `showAlertOnError` (*Boolean*) - If this field is set to `true` and `callback` is called with `error`, the error message will be displayed to the user by the datatables. The default value is `false`.
* `customQuery` (*Object*) - Add custom query. Suppose you have a user collection with each user has either admin or user role and you want to display only users with admin role. You can add something like `{ role: 'admin' }` to this field. This query has higher precedence over constructed query.
* `aggregateQuery` (*Array*) - Run custom aggregate query (pipeline). Be sure to manually select which data fields will be returned using projection stage and name those fields according to jquery datatable column names. Filtering (comming from front-end jquery datatable), sorting, and pagination will be automatically executed as final stages of the aggregate pipeline.
* `caseInsensitiveSearch` (*Boolean*) - To enable case insensitive search, set this option value to `true`. It is case sensitive by default.

#### Search Operation

* If both individual column and global search value are not given, then the search query will be an empty object. Therefore this method will fetch all documents inside the collection.

* If there is no individual column search value is given and global search value is given, then the global search value will be used as each column's search value. Then, the search query will be like `{ $or: [{ column_0: value }, ... , { column_n: value }] }`.

* If there is one or more individual column search value is given and the global search value is not given, then the search query will be like `{ column_0: value_0, ... , column_n: value_n }`.

* If both individual column and global search value are given, then the search query will be like `{ column_0: value_0, column_1: value_1, $or: [{ column_2 : value }, ... , { column_n: value }] }`.

__There's More:__
You can search data in a specific column using global search input element with `column_name:value` format. This will be useful if you want to search data in a specific column or field but you don't want to display search input element for that column.

Note that this will work only if you specify `name` in `columns` configuration. See [columns.name configuration](https://datatables.net/reference/option/columns.name).


## Usage

These examples assume that you are using Express v4

* Using `MongoClient`

```js
var express = require('express');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var MongoClient = mongodb.MongoClient;
var router = express.Router();

router.get('/data.json', function(req, res, next) {
  var options = req.query;
  options.showAlertOnError = true;

  /**
   * Using customQuery for specific needs such as
   * filtering data which has `role` property set to user
   */
  options.customQuery = {
    role: 'user'
  };

  /* uncomment the line below to enable case insensitive search */
  // options.caseInsensitiveSearch = true;

  MongoClient.connect('mongodb://localhost/database', function(err, db) {
    new MongoDataTable(db).get('collection', options, function(err, result) {
      if (err) {
        // handle the error
      }

      res.json(result);
    });
  });
});
...
```

* With MongoDB native driver v3

```js
var express = require('express');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var MongoClient = mongodb.MongoClient;
var router = express.Router();

router.get('/data.json', function(req, res, next) {
  var options = req.query;
  options.showAlertOnError = true;

  /**
   * Using customQuery for specific needs such as
   * filtering data which has `role` property set to user
   */
  options.customQuery = {
    role: 'user'
  };

  // uncomment the line below to enable case insensitive search
  // options.caseInsensitiveSearch = true;


   /**
    * MongoDB native driver v3, MongoClient.connect no longer yields instance of Db.
    * It yields the instance of MongoClient instead.
    * To get Db instance, you can call `db` method of client with the database name as the argument
    */
  
  MongoClient.connect('mongodb://localhost/database', function(err, client) {
    var db = client.db('database');
    new MongoDataTable(db).get('collection', options, function(err, result) {
      if (err) {
        // handle the error
      }

      res.json(result);
    });
  });
});
...
```

* Using `Db` and `Server`

```js
var express = require('express');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var Db = mongodb.Db;
var Server = mongodb.Server;
var router = express.Router();

router.get('/data.json', function(req, res, next) {
  var options = req.query;
  var db = new Db('database', new Server('localhost', 27017));

  options.showAlertOnError = true;

  /**
   * Using customQuery for specific needs such as
   * filtering data which has `role` property set to user
   */
  options.customQuery = {
    role: 'user'
  };

  // uncomment the line below to enable case insensitive search
  // options.caseInsensitiveSearch = true;

  db.open(function(error, db) {
    new MongoDataTable(db).get('collection', options, function(err, result) {
      if (err) {
        // handle the error
      }

      res.json(result);
    });
  });
});
...
```

* Using custom `aggregateQuery` option. Front-end jquery datatable has two columns: `role` and `count`

```js
var express = require('express');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var MongoClient = mongodb.MongoClient;
var router = express.Router();

router.get('/data.json', function(req, res, next) {
  var options = req.query; //query comming from front-end jquery datatable
  options.showAlertOnError = true;
  
  options.aggregateQuery = [
    {$group: {
      _id: '$role',
      role: {$last: '$role'}
      count: {$sum: '1'}
    }},
    {$project: { 
      role: 1,
      count: 1
    }}
  ];

  MongoClient.connect('mongodb://localhost/database', function(err, db) {
    new MongoDataTable(db).get('collection', options, function(err, result) {
      res.json(result);
    });
  });
});
...
```