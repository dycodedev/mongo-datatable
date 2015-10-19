var _ = require('lodash');
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


  _.forEach(searchAbleColumns, function(column) {
    if (column.search.value.length > 0) {
      currentSearchValue = column.search.value;

      escapedSearchValue = string.escapeNonAlphanumeric(currentSearchValue);
      currentSearch = parseSearchValue(escapedSearchValue);

      searchCriteria[column.data] = (currentSearch);
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
      var matchingColumn = _.filter(searchAbleColumns, function(column) {
        return column.name.toLowerCase() === splitted[0].toLowerCase();
      })[0];

      // Column name and search data match.
      if (matchingColumn) {
        currentSearch = {};
        currentSearch[matchingColumn.data] = parseSearchValue(splitted[1]);
        searchCriteria['$or'].push(currentSearch);
      }
    }
    else {
      globalSearchValue = string.escapeNonAlphanumeric(globalSearchValue);

      _.forEach(globallySearchedColumns, function(column) {
        currentSearch = {};
        currentSearch[column.data] = parseSearchValue(globalSearchValue);

        searchCriteria['$or'].push(currentSearch);
      });
    }
  }

  if (Object.keys(searchCriteria).length < 1) {
    searchCriteria = {};
  }

  if (options.customQuery) {
    searchCriteria = _.merge(searchCriteria, options.customQuery);
  }

  return searchCriteria;
}

function buildColumnSortOrder(options) {
  var sortOrder = [];
  var columns = options.columns;
  var currentOrder;
  var currentColumn;

  _.forEach(options.order, function(order) {
    currentColumn = columns[order.column];

    if (currentColumn.orderable === 'true') {
      currentOrder = {};
      currentOrder[currentColumn.data] = (order.dir === 'asc') ? 1 : -1;

      sortOrder.push(currentOrder);
    }
  });

  return sortOrder;
}

function extractColumns(options) {
  var columns = {};

  _.forEach(options.columns, function(column){
     columns[column.data] = 1;
  });

  return columns;
}

function getSearchableColumns(options) {
  return _.filter(options.columns, function(column) {
    return column.searchable === 'true';
  });
}

function parseSearchValue(value) {
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  return new RegExp(value, 'g');
}

exports.buildSearchCriteria = buildSearchCriteria;
exports.buildColumnSortOrder = buildColumnSortOrder;
exports.extractColumns = extractColumns;
exports.getSearchableColumns = getSearchableColumns;
