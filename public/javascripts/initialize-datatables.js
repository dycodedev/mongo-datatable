$(document).ready(function() {
  $('#subscriptions-table').DataTable({
    serverSide: true,
    autoWidth: false,
    processing: true,
    ajax: 'subscriptions',
    columns: [
      { 'data': '_id', 'name': '_id' },
      { 'data': 'subs_name', 'name': 'subs_name' },
      { 'data': 'subs_screen_name', 'name': 'subs_screen_name' },
      { 
        'data': 'services', 
        'name': 'services',
        'render': function (data) {
          return data.join(',');
        }
      },
      { 'data': 'state', 'name': 'state'}
    ]
  });

  $('#subscriptions-table')
    .removeClass('display')
    .addClass('table table-bordered table-stripped');
});