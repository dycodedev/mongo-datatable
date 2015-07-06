$(function() {
  $('#subscriptions-table').DataTable({
    serverSide: true,
    pocessing: true,
    autoWidth: false,
    ajax: 'subscriptions',
    aoColumns: [
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
});