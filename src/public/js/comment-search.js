$(document).ready(function() {
$('.remove-btn').click(function (e) {
  e.preventDefault();
  var url = $(this).attr('href');
  var postId = $(this).closest('.list-row').data('post');
  $.ajax({
    method: 'PATCH',
    url: url,
    data: {
      postId: postId
    },
    success: function (responseData, textStatus, jqXHR) {
      console.log('responseData:', responseData);
      location.reload();
    },
    error: function (XHR, textStatus, errorThrown) {
      console.log('errorThrown:', errorThrown);
      if (XHR.status === 401) {
        alert('authentication problem');
      } else {
        alert('Server problem');
      }
    }
  });
});

$('.filter-form').submit(function(e) {
    e.preventDefault();
    var commentTypeQuery = $(this).find('[name="comment_Type"]:selected').val();
    var commentStatusQuery = $(this).find('[name="comment_Status"]:selected').val();
    var queryObj = {};
    queryObj.type = commentTypeQuery;
    queryObj.type = commentStatusQuery;
    queryObj.page = 1;
    Query.set(queryObj);
  });

});