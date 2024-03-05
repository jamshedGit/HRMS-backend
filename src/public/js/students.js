$(document).ready(function () {

  $('.dropdown-list a').click(function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    var blockStatus = $(this).data('block');
    $.ajax({
      method: 'PATCH',
      url: url,
      data: {
        status: blockStatus
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

  $('.filter-form').submit(function (e) {
    e.preventDefault();
    var schoolQuery = $(this).find(`[name="school"]`).val().trim();
    var courseQuery = $(this).find(`[name="course"]`).val().trim();
    var sectionQuery = $(this).find(`[name="section"]`).val().trim();
    var studentQuery = $(this).find(`[name="student"]`).val().trim();
    var queryObj = {};
    schoolQuery && (queryObj.school = schoolQuery);
    courseQuery && (queryObj.course = courseQuery);
    sectionQuery && (queryObj.section = sectionQuery);
    studentQuery && (queryObj.student = studentQuery);
    queryObj.page = 1;
    Query.set(queryObj);
  });

  $('#export-csv').click(function(e) {
    location.href = location.origin + location.pathname + '/export' + location.search;
  });

});





