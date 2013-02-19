// Generated by CoffeeScript 1.4.0
(function() {
  var $, GUID, Line, Marker, Tag, addTag, focusedElement, placeTag, tags;

  $ = jQuery;

  focusedElement = null;

  tags = {};

  $.fn.image_tag = function(options) {
    var settings;
    settings = $.extend({}, options);
    return this.on('mousedown', 'img', placeTag);
  };

  addTag = function(markerX, markerY, lineWidth, textX, textY, textAlign, text) {
    var body, globalDiv, guid, line, marker, tag;
    body = $('body');
    guid = new GUID().guid();
    globalDiv = $('<div id="image-tag-' + guid + '"></div>');
    marker = new Marker(globalDiv, markerX, markerY);
    line = new Line(globalDiv, markerX + 8, markerY + 2, lineWidth);
    return tag = new Tag(globalDiv, textX, textY, guid, text);
  };

  placeTag = function(e) {
    var body, globalDiv, guid, line, marker;
    body = $('body');
    guid = new GUID().guid();
    globalDiv = $('<div id="image-tag-' + guid + '"></div>');
    marker = new Marker(globalDiv, e.pageX, e.pageY);
    line = new Line(globalDiv, e.pageX + 8, e.pageY + 2);
    body.append(globalDiv);
    body.on('mousemove', function(e) {
      var css;
      css = {};
      if (e.pageX < marker.x) {
        css.left = '';
        css.right = $(document).width() - marker.x - 1;
        css.width = Math.abs(e.pageX - marker.x - 2);
      } else {
        css.right = '';
        css.left = line.x;
        css.width = Math.abs(e.pageX - line.x + 1);
      }
      return line.line.css(css);
    });
    return body.on('mouseup', function(e) {
      var text;
      text = {};
      if (e.pageX < marker.x) {
        text = new Tag(globalDiv, $(document).width() - e.pageX, marker.y, marker, line, guid, 'right');
        marker.x = $(document).width() - marker.x - 9;
        marker.marker.css('left', '');
        marker.marker.css('right', marker.x);
      } else {
        text = new Tag(globalDiv, e.pageX, marker.y, marker, line, guid, 'left');
      }
      body.off('mouseup');
      return body.off('mousemove');
    });
  };

  Marker = (function() {

    function Marker(div, x, y) {
      this.marker = $('<div class="image-tag-marker" id="image-tag-marker-' + x + '+' + y + '"></div>');
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

  Line = (function() {

    function Line(div, x, y, width) {
      this.line = $('<div class="image-tag-line" id="image-tag-line-' + x + '+' + y + '"></div>');
      this.x = x;
      this.y = y;
      this.line.css('left', x + 'px');
      this.line.css('top', y + 'px');
      if (width != null) {
        this.line.css('width', width);
      }
      div.append(this.line);
    }

    return Line;

  })();

  Tag = (function() {

    function Tag(div, x, y, marker, line, guid, textAlign, text, rider) {
      var that;
      if (textAlign == null) {
        textAlign = 'left';
      }
      if (text == null) {
        text = '';
      }
      if (rider == null) {
        rider = '';
      }
      that = this;
      if (focusedElement !== null) {
        $(focusedElement).removeClass('image-tag-focused');
      }
      that.guid = guid;
      console.log(guid);
      that.tagId = 'image-tag-text-' + that.guid;
      that.marker = marker;
      that.line = line;
      that.textblock = $('<p class="image-tag-text-wrapper" id="image-tag-text-' + that.guid + '"></p>');
      that.text = $('<p class="image-tag-text">' + text + '</p>');
      that.rider = $('<p class="image-tag-rider">' + rider + '</p>');
      that.textblock.css(textAlign, x + 'px');
      that.textblock.css('top', y + 'px');
      that.text.css('text-align', textAlign);
      that.textblock.append(that.text);
      that.textblock.append(that.rider);
      $(div).append(that.textblock);
      if (text === '') {
        that.text.prop('contentEditable', true);
        that.text.on('keypress', function(e) {
          if (e.keyCode === 13) {
            return $(this).blur();
          }
        });
        that.text.on('blur', function(e) {
          if ($.trim($(this).text()) === '') {
            return that.remove();
          } else {
            $(this).prop('contentEditable', false);
            return that.select();
          }
        });
        that.text.focus();
      }
      that.text.on('click', function(e) {
        return that.select();
      });
      tags[that.guid] = that;
    }

    Tag.prototype.select = function() {
      if (focusedElement !== null && focusedElement !== this) {
        $('#image-tag-' + focusedElement.guid + '> div').removeClass('image-tag-focused');
        $('#image-tag-text-' + focusedElement.guid + '> p').removeClass('image-tag-focused');
      }
      $('#image-tag-' + this.guid + '> div').addClass('image-tag-focused');
      $('#image-tag-text-' + this.guid + '> p').addClass('image-tag-focused');
      return focusedElement = this;
    };

    Tag.prototype.remove = function() {
      this.text.remove();
      this.line.line.remove();
      this.marker.marker.remove();
      tags.splice(this.guid, 1);
      return console.log(tags);
    };

    return Tag;

  })();

  GUID = (function() {

    function GUID() {}

    GUID.prototype.s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    GUID.prototype.guid = function() {
      return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };

    return GUID;

  })();

}).call(this);
