(function() {
  var $, Marker, Text, placeMarker;

  $ = jQuery;

  $.fn.image_tag = function(options) {
    var settings;
    settings = $.extend({}, options);
    return this.on('mousedown', 'img', placeMarker);
  };

  placeMarker = function(e) {
    var marker, parent;
    parent = $(this).parent();
    marker = new Marker(parent, e.pageX, e.pageY);
    return parent.on('mouseup', function(e) {
      var text;
      text = new Text(this, e.pageX, e.pageY, marker);
      return $(this).off('mouseup');
    });
  };

  Marker = (function() {

    function Marker(div, x, y) {
      this.marker = $('<div class="marker" id="marker-' + x + '+' + y + '"></div>');
      this.marker.css({
        left: x + 'px',
        top: y + 'px'
      });
      div.append(this.marker);
    }

    return Marker;

  })();

  Text = (function() {

    function Text(div, x, y, marker) {
      this.marker = marker;
      this.text = $('<p class="text" id="text-' + x + '+' + y + '"></p>');
      this.text.css({
        left: x + 'px',
        top: y + 'px'
      });
      $(div).append(this.text);
      this.text.prop('contentEditable', true);
      this.text.on('keypress', function(e) {
        if (e.keyCode === 13) {
          $(this).prop('contentEditable', false);
          return $(this).blur();
        }
      });
      this.text.on('blur', function(e) {
        console.log($(this).text());
        if ($.trim($(this).text()) === '') {
          $(this).remove();
          return marker.marker.remove();
        }
      });
      this.text.focus();
    }

    return Text;

  })();

}).call(this);
