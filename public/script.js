jQuery(document).ready(function() {
    jQuery("#myNavbar").load("/navbar.html");
});

$("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();

    $("table tr").each(function(index) {
        if (index !== 0) {

            $row = $(this);

            var id = $row.find("td:first").text().toLowerCase();

            if (id.indexOf(value) !== 0) {
                $row.hide();
            } else {
                $row.show();
            }
        }
    });
});
