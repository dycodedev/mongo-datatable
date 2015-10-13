var _ = require('lodash');
var string = require('./string');

function buildSearchCriteria(options) {
  var globalSearchValue = string.escapeNonAlphanumeric(options.search.value);
  var searchCriteria = {};
  var searchAbleColumns = getSearchableColumns(options);
  var globallySearchedColumns = [];
  var currentColumn;
  var currentSearch;
  var currentSearchValue;
  var escapedSearchValue;

  _.forEach(searchAbleColumns, function(column) {
    if (column.search.value.length > 0) {
      escapedSearchValue = string.escapeNonAlphanumeric(currentSearchValue);

      if (!isNaN(Number(escapedSearchValue))) {
        currentSearch = Number(escapedSearchValue);
      }
      else {
        currentSearch = new RegExp(escapedSearchValue, 'g');
      }

      searchCriteria[column.data] = (currentSearch);
    }
    else {
      globallySearchedColumns.push(column);
    }
  });

  // If global search value is provided

  if (globalSearchValue.length > 0 && globallySearchedColumns.length > 0) {
    searchCriteria['$or'] = [];

    _.forEach(globallySearchedColumns, function(column) {
      currentSearch = {};

      if (!isNaN(Number(globalSearchValue))) {
        currentSearch[column.data] = Number(globalSearchValue);
      }
      else {
        currentSearch[currentColumn.data] = new RegExp(globalSearchValue, 'g');
      }

      searchCriteria['$or'].push(currentSearch);
    });
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

exports.buildSearchCriteria = buildSearchCriteria;
exports.buildColumnSortOrder = buildColumnSortOrder;
exports.extractColumns = extractColumns;
exports.getSearchableColumns = getSearchableColumns;
