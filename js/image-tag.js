(function() {
  var $, Line, Marker, Text, placeMarker;

  $ = jQuery;

  $.fn.image_tag = function(options) {
    var settings;
    settings = $.extend({}, options);
    return this.on('mousedown', 'img', placeMarker);
  };

  placeMarker = function(e) {
    var line, marker, parent;
    parent = $(this).parent();
    marker = new Marker(parent, e.pageX, e.pageY);
    line = new Line(parent, e.pageX + 8, e.pageY + 3);
    parent.on('mousemove', function(e) {
      var css;
      css = {};
      css.width = Math.abs(e.pageX - line.x + 1);
      if (e.pageX + 8 < line.x) {
        css.left = e.pageX;
        css.width = Math.abs(e.pageX - line.x) - 7;
      }
      return line.line.css(css);
    });
    return parent.on('mouseup', function(e) {
      var text;
      text = {};
      if (e.pageX < marker.x) {
        text = new Text(this, e.pageX - 100 - 9, marker.y, marker, line);
      } else {
        text = new Text(this, e.pageX, marker.y, marker, line);
      }
      $(this).off('mouseup');
      return $(this).off('mousemove');
    });
  };

  Line = (function() {

    function Line(div, x, y) {
      this.line = $('<div class="line" id="line-' + x + '+' + y + '"></div>');
      this.x = x;
      this.y = y;
      this.line.css({
        left: x + 'px',
        top: y + 'px'
      });
      div.append(this.line);
    }

    return Line;

  })();

  Marker = (function() {

    function Marker(div, x, y) {
      this.marker = $('<div class="marker" id="marker-' + x + '+' + y + '"></div>');
      this.x = x;
      this.y = y;
      this.marker.css({
        left: x + 'px',
        top: y + 'px'
      });
      div.append(this.marker);
    }

    return Marker;

  })();

  Text = (function() {

    function Text(div, x, y, marker, line) {
      this.line = line;
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
        if ($.trim($(this).text()) === '') {
          $(this).remove();
          line.line.remove();
          return marker.marker.remove();
        }
      });
      this.text.focus();
    }

    return Text;

  })();

}).call(this);
