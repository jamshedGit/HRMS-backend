$(document).ready(function() {
            $('.photo-btn').click(function(e) {
                        e.preventDefault();
                        var photos = $(this).attr('href').split(',');
                        $('.modal-wrapper_photo .slider-wrapper').html(
                                photos.map(function(photo, index) {
                                        return `
          <figure ${!index ? `class="active"` : ``}>
            <img src="${photo}" alt="">
          </figure>
        `;
      }).join('')
    );
    $('body').addClass('modal-open').css('padding-right', '17px');
    $('.modal-wrapper_photo').addClass('show');
  });

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
    var schoolQuery = $(this).find(`[name="school"]`).val().trim();
    var courseQuery = $(this).find(`[name="course"]`).val().trim();
    var sectionQuery = $(this).find(`[name="section"]`).val().trim();
    var postQuery = $(this).find(`[name="post"]`).val().trim();
    var postType = $(this).find('[name="options"]:checked').val();
    var queryObj = {};
    schoolQuery && (queryObj.school = schoolQuery);
    courseQuery && (queryObj.course = courseQuery);
    sectionQuery && (queryObj.section = sectionQuery);
    postQuery && (queryObj.post = postQuery);
    queryObj.type = postType;
    queryObj.page = 1;
    Query.set(queryObj);
  });

  $('.filter-form .post-filter-type input[name="options"]').focus(function() {
    $('.filter-form').trigger('submit');
  });

  photoSlider();
});

function photoSlider() {
  $('.modal-container_photo .slider-arrow-prev').click(function() {
    var sliderCount = $('.modal-container_photo .slider-wrapper figure').length;
    var sliderIndex = $('.modal-container_photo .active').index();
    var sliderPrevIndex = sliderIndex ? sliderIndex - 1 : sliderCount - 1;
    $('.modal-container_photo .active').removeClass('active');
    $('.modal-container_photo figure').eq(sliderPrevIndex).addClass('active');
  });
  $('.modal-container_photo .slider-arrow-next').click(function() {
    var sliderCount = $('.modal-container_photo .slider-wrapper figure').length;
    var sliderIndex = $('.modal-container_photo .active').index();
    var sliderNextIndex = (sliderIndex + 1) % sliderCount;
    $('.modal-container_photo .active').removeClass('active');
    $('.modal-container_photo figure').eq(sliderNextIndex).addClass('active');
  });
}