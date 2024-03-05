
$(document).ready(function() {
$('.filter-form').submit(function(e) {
    e.preventDefault();
    var universityQuery = $(this).find('[name="university"]:selected').val();
    var queryObj = {};
    universityQuery && (queryObj.university = universityQuery);
    queryObj.page = 1;
    Query.set(queryObj);
  });

});
