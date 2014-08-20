(function ($) {
    // register namespace
    $.extend(true, window, {
        "ListView": {
            "Formatters": {
                "SpanDisplay": SpanDisplayFormatter
            }
        }
    });

    function SpanDisplayFormatter(value) {
        return value ? "<span>" : "";
    }
    
    function YesNoFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "Yes" : "No";
    }

    function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
        return value ? "<img src='../common/images/ui/tick.png'>" : "";
    }
})(jQuery);