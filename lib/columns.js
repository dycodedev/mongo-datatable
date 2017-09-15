var filter = require('lodash/filter');
var forEach = require('lodash/forEach');
var merge = require('lodash/merge');
var string = require('./string');

function buildSearchCriteria(options) {
  var globalSearchValue = options.search.value;
  var searchCriteria = {};
  var searchAbleColumns = getSearchableColumns(options);
  var globallySearchedColumns = [];
  var currentColumn;
  var currentSearch;
  var currentSearchValue;
  var escapedSearchValue;

  var shouldCaseInsensitive = typeof options.caseInsensitiveSearch !== 'undefined'
    ? string.stringToBoolean(options.caseInsensitiveSearch)
    : false;

  forEach(searchAbleColumns, function(column) {
    if (column.search.value.length > 0) {
      currentSearchValue = column.search.value;

      escapedSearchValue = string.escapeNonAlphanumeric(currentSearchValue);
      currentSearch = parseSearchValue(escapedSearchValue, shouldCaseInsensitive);

      searchCriteria[column.data] = currentSearch;
    }
    else {
      globallySearchedColumns.push(column);
    }
  });

  // If global search value is provided

  if (globalSearchValue.length > 0 && globallySearchedColumns.length > 0) {
    searchCriteria['$or'] = [];

    if (globalSearchValue.indexOf(':') > 0) {
      var splitted = globalSearchValue.split(':');
      var matchingColumn = filter(searchAbleColumns, function(column) {
        return column.name.toLowerCase() === splitted[0].toLowerCase();
      })[0];

      // Column name and search data match.
      if (matchingColumn) {
        currentSearch = {};
        currentSearch[matchingColumn.data] = parseSearchValue(splitted[1], shouldCaseInsensitive);
        searchCriteria['$or'].push(currentSearch);
      }
    }
    else {
      globalSearchValue = string.escapeNonAlphanumeric(globalSearchValue);

      forEach(globallySearchedColumns, function(column) {
        currentSearch = {};
        currentSearch[column.data] = parseSearchValue(globalSearchValue, shouldCaseInsensitive);

        searchCriteria['$or'].push(currentSearch);
      });
    }
  }

  if (Object.keys(searchCriteria).length < 1)
    searchCriteria = {};

  if (options.customQuery)
    searchCriteria = merge(searchCriteria, options.customQuery);

  return searchCriteria;
}

function buildColumnSortOrder(options) {
  var sortOrder = [];
  var columns = options.columns;
  var currentOrder;
  var currentColumn;

  forEach(options.order, function(order) {
    currentColumn = columns[order.column];

    if (currentColumn.orderable === 'true' || currentColumn.orderable === true) {
      currentOrder = {};
      currentOrder[currentColumn.data] = (order.dir === 'asc') ? 1 : -1;

      sortOrder.push(currentOrder);
    }
  });

  return sortOrder;
}

function extractColumns(options) {
  var columns = {};

  forEach(options.columns, function(column){
     columns[column.data] = 1;
  });

  return columns;
}

function getSearchableColumns(options) {
  return filter(options.columns, function(column) {
    return column.searchable === 'true' || column.searchable === true;
  });
}

function parseSearchValue(value, caseInsensitive) {
  if (!isNaN(Number(value)))
    return Number(value);
  
  // default to case sensitive
  var shouldCaseInsensitive = typeof caseInsensitive === 'undefined'
   ? false
   : caseInsensitive;

  return shouldCaseInsensitive === true
   ? new RegExp(value, 'ig')
   : new RegExp(value, 'g');
}

exports.buildSearchCriteria = buildSearchCriteria;
exports.buildColumnSortOrder = buildColumnSortOrder;
exports.extractColumns = extractColumns;
exports.getSearchableColumns = getSearchableColumns;
