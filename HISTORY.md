# Project History

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

### [1.1.1] - 2021-03-15

#### Added
* Example for mongodb native driver v3.6
* pass option { useUnifiedTopology: true } to the MongoClient constructor

#### Modified
* Updated lodash version
* Updated mongodb version


### [1.1.1] - 2018-05-20

#### Added
* Example for mongodb native driver v3

#### Modified
* Internal naming of reference to `async` module so that it would not conflict with `async` keyword.
* Using strict mode in MongoDataTable.js
* Updated lodash version

### [1.1.0] - 2017-09-15

#### Added
* Support for case insensitive search through `caseInsensitiveSearch` option.

### [1.0.1] - 2016-09-20

#### Modified
* Fixed left curly braces

### [1.0.0] - 2016-09-20

#### Modified
* Refactored validator and entry point.
* Only generate search query once.

### [0.4.1] - 2016-06-25

#### Modified
* Upgrade lodash to version 4.13.1. (See [#2](https://github.com/dycodedev/mongo-datatable/pull/2))

### [0.4.0] - 2015-10-20

#### Added
* Support for showing all rows using -1 page length configuration. See [length menu](https://datatables.net/examples/advanced_init/length_menu.html).

### [0.3.1] - 2015-10-20

#### Fixed
* jquery datatables now display error when showAlertOnError is true

### [0.3.0] - 2015-10-19

#### Added
* `customQuery` option.
* Specific column search in global search input element.


#### Changed
* `showAlert` option changed to `showAlertOnError`.
* Using lodash to process request data.
* Express-based example app is no longer using `bin/www` to start app.
* Express-based example app uses newly added feature.

#### Removed
* `emptyOnError` option as this module will always return empty data when error occurs.

### [0.2.1] - 2015-09-05

#### Changed
* Revised README.md

#### Fixed
* Treat numeric search value differently.

### [0.2.0] - 2015-07-13

#### Added
* Added `emptyOnError` and `showAlert` to `options`.

### [0.1.2] - 2015-07-11

#### Added
* Express-based app to test this module
* `.npmignore` to ignore that test app

#### Changed
* `.gitignore` ignores log files
* Revised README.md

#### Fixed
* Throws error if `db` object is undefined or null

### [0.1.1] - 2015-07-09

#### Changed
* Revised README.md
* Removed `console.log`

### 0.1.0 - 2015-07-09

#### Added
* README.md
* Multiple columns search
* Columns sorting
* Options validation
* Non alphanumeric string replacement

[1.1.1]: https://github.com/dycodedev/mongo-datatable/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/dycodedev/mongo-datatable/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/dycodedev/mongo-datatable/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/dycodedev/mongo-datatable/compare/0.4.1...1.0.0
[0.4.1]: https://github.com/dycodedev/mongo-datatable/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/dycodedev/mongo-datatable/compare/0.3.1...0.4.0
[0.3.1]: https://github.com/dycodedev/mongo-datatable/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/dycodedev/mongo-datatable/compare/0.2.1...0.3.0
[0.2.1]: https://github.com/dycodedev/mongo-datatable/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/dycodedev/mongo-datatable/compare/0.1.2...0.2.0
[0.1.2]: https://github.com/dycodedev/mongo-datatable/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/dycodedev/mongo-datatable/compare/0.1.0...0.1.1
