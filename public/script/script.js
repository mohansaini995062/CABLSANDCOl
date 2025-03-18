$("#menu_icon").click(function () {
  $("#mobile_nav").fadeIn(); // fadeIn will also ensure the element becomes visible
});

$("#close_icon").click(function () {
  $("#mobile_nav").fadeOut(); // fadeOut hides the element after fading
});

let temp;
function resizeEnd() {
  smallScreenMenu();
}

$(window).resize(function () {
  clearTimeout(temp);
  temp = setTimeout(resizeEnd, 100);
  resetMenu();
});

const subMenus = $(".sub-menu");
const menuLinks = $(".menu-link");

function smallScreenMenu() {
  if ($(window).innerWidth() <= 992) {
    menuLinks.each(function (item) {
      $(this).click(function () {
        $(this).next().slideToggle();
      });
    });
  } else {
    menuLinks.each(function (item) {
      $(this).off("click");
    });
  }
}

function resetMenu() {
  if ($(window).innerWidth() > 992) {
    subMenus.each(function (item) {
      $(this).css("display", "none");
    });
  }
}


