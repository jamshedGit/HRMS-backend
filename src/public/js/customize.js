$(document).ready(function () {
  $('.dropify').dropify();

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.dropdown-more').length) {
      $('.dropdown-list.show').removeClass('show');
    }
  }).on('keydown', function (e) {
    if (e.keyCode === 27) {
      $('.dropdown-list.show').removeClass('show');
      $('.modal-wrapper.show').removeClass('show');
      $('body').removeClass('modal-open').removeAttr('style');
    }
  });

  $('.dropdown-toggle-btn').click(function () {
    $('.dropdown-list.show').removeClass('show');
    $(this).siblings('.dropdown-list').toggleClass('show');
  });

  $('.modal-wrapper').click(function (e) {
    if (e.target == this) {
      $(this).removeClass('show');
      $('body').removeClass('modal-open').removeAttr('style');
    }
  });

  pagination();
});

function pagination() {
  $('.page-item:not(.active, .page-prev, .page-next)').click(function (e) {
    var page = $(this).data('page');
    Page.goto(page);
  });

  $('.page-item.page-prev').click(function (e) {
    var firstPage = $(this).data('first-page');
    Page.goPrev(firstPage);
  });

  $('.page-item.page-next').click(function (e) {
    var lastPage = $(this).data('last-page');
    Page.goNext(lastPage);
  });

  var Page = {
    goto: function (page) {
      var queryObj = Query.toObject();
      queryObj.page = page;
      Query.set(queryObj);
    },
    goPrev: function (firstPage) {
      var queryObj = Query.toObject();
      if (queryObj.page > firstPage) {
        queryObj.page = +queryObj.page - 1;
        Query.set(queryObj);
      }
    },
    goNext: function (lastPage) {
      var queryObj = Query.toObject();
      if (queryObj.page < lastPage) {
        queryObj.page = +queryObj.page + 1;
        Query.set(queryObj);
      }
    },
  }
}

var Query = {
  toObject: function () {
    return location.search.indexOf('?') + 1 ? location.search.substr(1).split('&').reduce((obj, property) =>
      (Object.assign(obj, Object.fromEntries([property.split('=')]))), {}) : {};
  },
  toString: function (queryObj) {
    return Object.entries(queryObj).map(([key, value]) => `${key}=${value}`).join('&');
  },
  set: function (query) {
    if (typeof query !== 'string') {
      query = this.toString(query);
    }
    location.href = location.pathname + (query ? `?${query}` : ``);
  }
};
