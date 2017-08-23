$(function(){

  $("form.cs-get-my-ip").each( function(){
    var form = $(this);
    var form_id = form.attr("id");
    form.on("submit", function(e){
      e.preventDefault();
      var href = window.location.href;
      var data = 'cmd=custom_sections_cmd' // MANDATORY!
                  + '&type=run_custom_scripts'  // MANDATORY! Specify name of your custom section type
                  + '&form_id=' + form_id
                  // + possible additional parameters
                  ;
      loading();
      $gp.postC(href,data);
    });
  });

});
