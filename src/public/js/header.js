$(document).ready(function () {
  $('.logout').click(function (e) {
    $.ajax({
      method: 'POST',
      url: '/admins/logout',
      success: function (responseData, textStatus, jqXHR) {
        console.log('responseData:', responseData);
        var result = responseData.success;
        if (result === true) {
          window.location.href = '/admins/login';
        }
      },
      error: function (XHR, textStatus, errorThrown) {
        console.log('errorThrown:', errorThrown);
        if (XHR.status === 401) {
          alert('Email/password is incorrect');
        } else {
          alert('Server problem');
        }
      }
    });
  });
});


