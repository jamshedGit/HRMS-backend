$(document).ready(function() {
    $('.filter-form').submit(function(e) {
        e.preventDefault();
        var universityQuery = $(this).find('[name="university"]:selected').val();
        var campusgroupQuery = $(this).find('[name="campusgroup"]:selected').val();
        var queryObj = {};
        universityQuery && (queryObj.university = universityQuery);
        campusgroupQuery && (queryObj.campusgroup = campusgroupQuery);
        queryObj.page = 1;
        Query.set(queryObj);
      });
    
    });