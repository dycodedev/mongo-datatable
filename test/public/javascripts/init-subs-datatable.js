$(document).ready(function() {
  $('#subs-table').DataTable({
    serverSide: true,
    processing: true,
    autoWidth: false,
    ajax: 'subs/subs.json',
    columns: [
      { data: '_id' },
      { data: 'subs_name' },
      { data: 'subs_screen_name' },
      { 
        data: 'services',
        render: function(data) {
          return data.join(', ');
        }
      },
      { data: 'state' }
    ]
  });

  $('#subs-table')
    .removeClass('display')
    .addClass('table table-stripped table-bordered');
});