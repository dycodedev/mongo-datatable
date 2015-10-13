$(document).ready(function() {
  $('#zipcodes-table tfoot th').each(function() {
    var title = $('#zipcodes-table tfoot th').eq($(this).index()).text();
    $(this).html('<input type="text" placeholder="Search ' + title + '"/>');
  });

  var table = $('#zipcodes-table').DataTable({
    serverSide: true,
    processing: true,
    autoWidth: false,
    ajax: 'zipcodes.json',
    columns: [
      { data: '_id', searchable: false },
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

  table.columns().every(function() {
    var that = this;

    $('input', this.footer()).on('keyup change', function() {
      that
        .search(this.value)
        .draw();
    });
  });
});