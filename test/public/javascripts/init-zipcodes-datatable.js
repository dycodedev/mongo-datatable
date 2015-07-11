$(document).ready(function() {
  $('#zipcodes-table').DataTable({
    serverSide: true,
    processing: true,
    autoWidth: false,
    ajax: 'zipcodes.json',
    columns: [
      { data: '_id' },
      { data: 'city' },
      { data: 'state' },
      { data: 'pop' },
      { 
        data: 'loc',
        render: function(data) {
          return data.join(', ');
        }
      }
    ]
  });

  $('#zipcodes-table')
    .removeClass('display')
    .addClass('table table-stripped table-bordered');
});