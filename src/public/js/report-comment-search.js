$(document).ready(function() {

    $('.dropdown-list a').click(function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        var reportStatus = $(this).data('reportdata');
        $.ajax({
          method: 'PATCH',
          url: url,
          data: {
            status: reportStatus
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
          var universityQuery = $(this).find('[name="university"]:selected').val();
          var reportComment_Type = $(this).find('[name="reportComment_Type"]:selected').val();
        //   var SpecificSectionQuery = $(this).find('[name="SpecificSection"]:selected').val();
          var queryObj = {};
          universityQuery && (queryObj.university = universityQuery);
          queryObj.type = reportComment_Type;
        //   SpecificSectionQuery && (queryObj.SpecificSection = SpecificSectionQuery);
        //   postQuery && (queryObj.post = postQuery);
          queryObj.page = 1;
          Query.set(queryObj);
        });
      });