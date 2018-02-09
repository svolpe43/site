

$(document).click(function (event) {
    var clickover = $(event.target);
    var $navbar = $(".collapse");               
    var _opened = $navbar.hasClass("in");

    if (_opened === true && !clickover.hasClass("collapse")) {      
        $navbar.collapse('hide');
    }
});