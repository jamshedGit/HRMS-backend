$(document).ready(function() {
    $('.filter-form').submit(function(e) {
        e.preventDefault();
        var SpecificSectionQuery = $(this).find('[name="SpecificSection"]:selected').val();
        var queryObj = {};
        SpecificSectionQuery && (queryObj.SpecificSection = SpecificSectionQuery);
        queryObj.page = 1;
        Query.set(queryObj);
      });
    
    });