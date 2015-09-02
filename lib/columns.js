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

  for (index in searchAbleColumns) {
    currentColumn = searchAbleColumns[index];

    // If individual search value is provided

    if(currentColumn.search.value.length > 0) {
      currentSearchValue = currentColumn.search.value;
      escapedSearchValue = string.escapeNonAlphanumeric(currentSearchValue);

      // Check if it's a number
      if (!isNaN(Number(escapedSearchValue))) {
        currentSearch = Number(escapedSearchValue);
      }
      else {
        currentSearch = new RegExp(escapedSearchValue, 'g');
      }

      searchCriteria[currentColumn.data] = (currentSearch);
    }
    else {
      globallySearchedColumns.push(currentColumn);
    }
  }

  // If global search value is provided

  if (globalSearchValue.length > 0 && globallySearchedColumns.length > 0) {
    searchCriteria['$or'] = [];

    for (index in globallySearchedColumns) {
      currentColumn = globallySearchedColumns[index];
      currentSearch = {};

      // Check if it's a number
      if (!isNaN(Number(globalSearchValue))) {
        currentSearch[currentColumn.data] = Number(globalSearchValue);
      }
      else {
        currentSearch[currentColumn.data] = new RegExp(globalSearchValue, 'g');
      }

      searchCriteria['$or'].push(currentSearch);
    }
  }

  if (Object.keys(searchCriteria).length < 1) {
    searchCriteria = {};
  }

  return searchCriteria;
}

function buildColumnSortOrder(options) {
  var sortOrder = [];
  var columns = options.columns;
  var currentOrder;
  var currentColumn;

  for (index in options.order) {
    currentColumn = columns[options.order[index].column];
    if (currentColumn.orderable === 'true') {
      currentOrder = {};
      currentOrder[currentColumn.data] = (options.order[index].dir === 'asc')
        ? 1
        : -1;

      sortOrder.push(currentOrder);
    }
  }

  return sortOrder;
}

function extractColumns(options) {
  var columns = {};

  for (index in options.columns) {
    columns[options.columns[index].data] = 1;
  }

  return columns;
}

function getSearchableColumns(options) {
  var columns = [];

  for (index in options.columns) {
    if (options.columns[index].searchable === 'true') {
      columns.push(options.columns[index]);
    }
  }

  return columns;
}

exports.buildSearchCriteria = buildSearchCriteria;
exports.buildColumnSortOrder = buildColumnSortOrder;
exports.extractColumns = extractColumns;
exports.getSearchableColumns = getSearchableColumns;