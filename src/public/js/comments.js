$(document).ready(function() {
  $('.status-reported').click(function (e) {
    e.preventDefault();
    const list = $(this).data('reports').split(',').map(function(reason) {
      const key = reason.split(':')[0];
      const value = reason.split(':')[1];
      return `
        <li>
          ${key}
          <span class="badge badge-pill badge-light">${value}</span>
        </li>
      `;
    }).join('');
    $('.modal-wrapper_reports ul').html(list);
    $('body').addClass('modal-open').css('padding-right', '17px');
    $('.modal-wrapper_reports').addClass('show');
  });

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
    var commentType = $(this).find('[name="options"]:checked').val();
    var queryObj = {};
    queryObj.type = commentType;
    queryObj.page = 1;
    Query.set(queryObj);
  });

  $('.filter-form .comment-filter-type input[name="options"]').focus(function() {
    $('.filter-form').trigger('submit');
  });
});
