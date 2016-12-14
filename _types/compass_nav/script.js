$(document).ready( initCompass );

// SectionAdded and PreviedAdded are Typesetter core events.
// CustomSection:updated is a plugin event.
$(document).on("SectionAdded CustomSection:updated", "div.GPAREA", initCompass);
$(document).on("PreviewAdded", "div.GPAREA", function(){
  setTimeout(initCompass,650); // required because of we need to wait for Section Preview slideDown animation to complete
});

function initCompass(){
  $(".compass-nav .north-link-wrapper a, .compass-nav .east-link-wrapper a, .compass-nav .west-link-wrapper a")
    .circleType({ fluid : true }); 
  $(".compass-nav .south-link-wrapper a")
    .circleType({ fluid : true, dir : -1 });

  $(".compass-nav-wrapper a")
    .on("mousemove click", function(e){
      var compass_wrapper = $(this).closest(".compass-nav-wrapper");
      var compass_center = {
        left  : compass_wrapper.offset().left + compass_wrapper.width()/2, 
        top   : compass_wrapper.offset().top + compass_wrapper.height()/2
      };
      var angle = Math.atan2( 
          e.pageX - compass_center.left, 
          -(e.pageY - compass_center.top)
        ) * (180 / Math.PI);
      var needle = compass_wrapper.find("img.compass-needle");
      needle.css({
        "-webkit-transform" : "rotate(" + angle + "deg)",
        "transform"         : "rotate(" + angle + "deg)" 
      });
    })
    .on("mouseleave", function(e){
      var compass_wrapper = $(this).closest(".compass-nav-wrapper");
      var needle = compass_wrapper.find("img.compass-needle");
      var angle = needle.attr("data-angle");
      needle.css({
        "-webkit-transform" : "rotate(" + angle + "deg)",
        "transform"         : "rotate(" + angle + "deg)" 
      });
    });

};
