$(document).ready(function() {

  $('.remove-btn').click(function (e) {
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
      method: 'PATCH',
      url: url,
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
        var universityQuery = $(this).find('[name="university"]:selected').val();
        var SpecificSectionQuery = $(this).find('[name="SpecificSection"]:selected').val();
        var postQuery = $(this).find(`[name="post"]`).val().trim();
        var postTypeQuery = $(this).find('[name="post_Type"]:selected').val();
        var queryObj = {};
        universityQuery && (queryObj.university = universityQuery);
        SpecificSectionQuery && (queryObj.SpecificSection = SpecificSectionQuery);
        postQuery && (queryObj.post = postQuery);
        queryObj.type = postTypeQuery;
        queryObj.page = 1;
        Query.set(queryObj);
      });
    
    });