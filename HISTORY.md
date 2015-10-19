# Project History

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).


### [Unreleased]

#### Added
* `customQuery` option.
* Specific column search in global search value.

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
[Unreleased]: https://github.com/dycodedev/mongo-datatable/compare/0.2.1...release-6
[0.2.1]: https://github.com/dycodedev/mongo-datatable/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/dycodedev/mongo-datatable/compare/0.1.2...0.2.0
[0.1.2]: https://github.com/dycodedev/mongo-datatable/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/dycodedev/mongo-datatable/compare/0.1.0...0.1.1