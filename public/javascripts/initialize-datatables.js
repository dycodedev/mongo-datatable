$(document).ready(function() {
  $('#subscriptions-table tfoot th').each(function() {
    var title = $('#subscriptions-table thead th').eq($(this).index()).text();
    $(this).html('<input type="text" placeholder="Search ' + title + '" />');
  });

  var table = $('#subscriptions-table').DataTable({
    serverSide: true,
    autoWidth: false,
    processing: true,
    ajax: 'subscriptions',
    columns: [
      { 'data': '_id', 'name': '_id', 'searchable': false },
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

  table.columns().every(function() {
    var that = this;
    console.log(that);

    $('input', this.footer()).on('keyup change', function() {
      that
        .search(this.value)
        .draw();
    });
  });
});