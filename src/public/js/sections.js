$(document).ready(function() {
  $('.filter-form').submit(function(e) {
    e.preventDefault();
    var schoolQuery = $(this).find(`[name="school"]`).val().trim();
    var courseQuery = $(this).find(`[name="course"]`).val().trim();
    var sectionQuery = $(this).find(`[name="section"]`).val().trim();
    var queryObj = {};
    schoolQuery && (queryObj.school = schoolQuery);
    courseQuery && (queryObj.course = courseQuery);
    sectionQuery && (queryObj.section = sectionQuery);
    queryObj.page = 1;
    Query.set(queryObj);
  });
});
