$(document).ready(function() {
  $('#zipcodes-table').DataTable({
    serverSide: true,
    processing: true,
    autoWidth: false,
    ajax: "zipcodes/zipcodes.json",
    columns: [
      { 'data': '_id', 'name': '_id' },
      { 'data': 'city', 'name': 'city' },
      { 'data': 'state', 'name': 'state' },
      { 'data': 'pop', 'name': 'pop' },
      { 
        'data': 'loc',
        'name': 'loc',
        'render': function (data) {
          return data.join(', ');
        }
      },
    ]
  });

  $('#zipcodes-table')
    .removeClass('display')
    .addClass('table table-stripped table-bordered');
});