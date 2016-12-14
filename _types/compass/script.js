$(document).ready( function(){

  $(".compass-wrapper")
    .on("mousemove click", function(e){
      var compass_center = {
        left  : $(this).offset().left + $(this).width()/2, 
        top   : $(this).offset().top + $(this).height()/2
      };
      var angle = Math.atan2( 
          e.pageX - compass_center.left, 
          -(e.pageY - compass_center.top)
        ) * (180 / Math.PI);
      var needle = $(this).find("img.compass-needle");
      needle.css({
        "-webkit-transform" : "rotate(" + angle + "deg)",
        "transform"         : "rotate(" + angle + "deg)" 
      });
    })
    .on("mouseleave", function(e){
      var needle = $(this).find("img.compass-needle");
      var angle = needle.attr("data-angle");
      needle.css({
        "-webkit-transform" : "rotate(" + angle + "deg)",
        "transform"         : "rotate(" + angle + "deg)" 
      });
    });

});