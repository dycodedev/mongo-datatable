$(function() {
  $('#subscriptions-table').DataTable({
    bServerSide: true,
    sAjaxSource: "http://127.0.0.1:3000/subscriptions",
    aoColumns: [
      { 'mData': '_id', 'sTitle': 'Id' },
      { 'mData': 'subs_name', 'sTitle': 'Name' },
      { 'mData': 'subs_screen_name', 'sTitle': 'Screen Name' },
      { 
        'mData': 'services', 
        'mRender': function (data) {
          return data.join(',');
        }
      },
      { 'mData': 'state'}
    ]
  });
});