$(document).ready(function () {
  $('.login-form').submit(function (e) {
    e.preventDefault();
    var formData = $(this).serialize();
    var url = $(this).attr('action');
    var method = $(this).attr('method');
    console.log('formData:', formData, 'url:', url, 'method:', method);
    console.log(document.cookie);
    $.ajax({
      method: method,
      url: url,
      data: formData,
      // contentType: `'application/x-www-form-urlencoded`,
      success: function (responseData, textStatus, jqXHR) {
        console.log('responseData:', responseData);
        var result = responseData;
        if(result.code === 200){
          // console.log(result.code)
        
          Swal.fire("Try Again", result.message, "error");
        }
        else if(result.code === 201){
          window.location.href = '/dashboard'
          // token = result.data.tokens.access.token;
          // console.log(token);
          // setCookie('token1', token, 30000);
          // window.location.href = '/admins';
        }
      },
      error: function (XHR, textStatus, errorThrown) {
        console.log('errorThrown:', errorThrown);
        if(XHR.status === 401) {
            Swal.fire("Try Again!", "Authentication problem!", "error");
        } else {
          Swal.fire("Try Again!", "Server problem!", "error");
        }
      }
    });
  });
});


