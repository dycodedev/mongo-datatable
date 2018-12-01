'use strict';

const filter = require('lodash/filter');
const forEach = require('lodash/forEach');
const merge = require('lodash/merge');
const string = require('./string');

function buildSearchCriteria(options) {
  const globalSearchValue = options.search.value;
  const searchCriteria = {};
  const searchAbleColumns = getSearchableColumns(options);
  const globallySearchedColumns = [];

  const shouldCaseInsensitive = typeof options.caseInsensitiveSearch !== 'undefined'
    ? string.stringToBoolean(options.caseInsensitiveSearch)
    : false;

  forEach(searchAbleColumns, (column) => {
    if (column.search.value.length > 0) {
      const currentSearchValue = column.search.value;
      const escapedSearchValue = string.escapeNonAlphanumeric(currentSearchValue);
      const currentSearch = parseSearchValue(escapedSearchValue, shouldCaseInsensitive);

      searchCriteria[column.data] = currentSearch;
    } else {
      globallySearchedColumns.push(column);
    }
  });

  // If global search value is provided

  if (globalSearchValue.length > 0 && globallySearchedColumns.length > 0) {
    searchCriteria['$or'] = [];

    if (globalSearchValue.indexOf(':') > 0) {
      const splitted = globalSearchValue.split(':');
      const matchingColumn = filter(searchAbleColumns, (column) => {
        return column.name.toLowerCase() === splitted[0].toLowerCase();
      })[0];

      // Column name and search data match.
      if (matchingColumn) {
        const currentSearch = {};
        currentSearch[matchingColumn.data] = parseSearchValue(splitted[1], shouldCaseInsensitive);
        searchCriteria['$or'].push(currentSearch);
      }
    }
    else {
      const escapedGlobalSearchValue = string.escapeNonAlphanumeric(globalSearchValue);

      forEach(globallySearchedColumns, (column) => {
        const currentSearch = {};
        currentSearch[column.data] = parseSearchValue(escapedGlobalSearchValue, shouldCaseInsensitive);

        searchCriteria['$or'].push(currentSearch);
      });
    }
  }

  if (Object.keys(searchCriteria).length < 1) {
    return {};
  }

  if (options.customQuery) {
    return merge(searchCriteria, options.customQuery);
  }

  return searchCriteria;
}

function buildColumnSortOrder(options) {
  const sortOrder = [];
  const columns = options.columns;

  forEach(options.order, function(order) {
    const currentColumn = columns[order.column];

    if (currentColumn.orderable === 'true' || currentColumn.orderable === true) {
      const currentOrder = {};
      currentOrder[currentColumn.data] = (order.dir === 'asc') ? 1 : -1;

      sortOrder.push(currentOrder);
    }
  });

  return sortOrder;
}

function extractColumns(options) {
  const columns = {};

  forEach(options.columns, (column) => {
     columns[column.data] = 1;
  });

  return columns;
}

function getSearchableColumns(options) {
  return filter(options.columns, (column) =>
    column.searchable === 'true' || column.searchable === true
  );
}

function parseSearchValue(value, caseInsensitive) {
  if (!isNaN(Number(value))) {
    return Number(value);
  }
  
  // default to case sensitive
  const shouldCaseInsensitive = typeof caseInsensitive === 'undefined'
   ? false
   : caseInsensitive;

  return shouldCaseInsensitive === true
   ? new RegExp(value, 'ig')
   : new RegExp(value, 'g');
}

module.exports = {
  buildSearchCriteria,
  buildColumnSortOrder,
  extractColumns,
  getSearchableColumns,
};
