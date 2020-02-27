/**
 * Runtime JavaScript for Custom Section type 'Masonry Item'
 * for Typesetter CMS developer plugin 'Custom Sections'
 *
 */

$(function(){

  $('.masonry-item-thumbnail-wrapper').colorbox(
    $gp.cboxSettings({
      resize  : true,
      rel     : 'masonry',
      title   : function(){
        var $inner_wrapper = $(this).closest('div');
        var caption =
            $inner_wrapper.find('.masonry-item-title').text() + ' | '
          + $inner_wrapper.find('.masonry-item-text').text() + ' | '
          + $inner_wrapper.find('.masonry-item-price').text()
        return caption;
      }
    })
  );

});
