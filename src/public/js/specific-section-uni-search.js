$(document).ready(function() {
    $('.filter-form').submit(function(e) {
        e.preventDefault();
        var universityQuery = $(this).find('[name="university"]:selected').val();
        var SpecificSectionQuery = $(this).find('[name="SpecificSection"]:selected').val();
        var queryObj = {};
        universityQuery && (queryObj.university = universityQuery);
        SpecificSectionQuery && (queryObj.SpecificSection = SpecificSectionQuery);
        queryObj.page = 1;
        Query.set(queryObj);
      });
    
    });