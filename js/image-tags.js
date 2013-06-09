// Generated by CoffeeScript 1.6.3
(function() {
  var $, GUID, Line, Marker, Tag, addTag, focusedElement, placeTag, settings, tags;

  $ = jQuery;

  focusedElement = null;

  tags = {};

  settings = {};

  $.fn.image_tag = function(options) {
    var tag, _i, _len, _ref;
    settings = $.extend({
      'tags': {},
      'getter': function(tag) {
        return tag.rider;
      },
      'callback': function() {}
    }, options);
    _ref = settings.tags;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tag = _ref[_i];
      addTag(parseInt(tag.startX), parseInt(tag.startY), parseInt(tag.endX), parseInt(tag.endY), tag.text, settings.getter(tag));
    }
    return this.on('mousedown', 'img', placeTag);
  };

  addTag = function(startX, startY, endX, endY, text, rider) {
    var body, globalDiv, guid, line, marker, tag;
    body = $('body');
    guid = new GUID().guid();
    globalDiv = $('<div id="image-tag-' + guid + '"></div>');
    body.append(globalDiv);
    marker = new Marker(startX, startY);
    marker.update(endX);
    line = new Line(startX, startY, endX);
    globalDiv.append(line.line).append(marker.marker);
    return tag = new Tag(globalDiv, endX, endY, marker, line, guid, text, rider);
  };

  placeTag = function(e) {
    var body, globalDiv, guid, line, marker;
    body = $('body');
    guid = new GUID().guid();
    globalDiv = $('<div id="image-tag-' + guid + '"></div>');
    body.append(globalDiv);
    marker = new Marker(e.pageX, e.pageY);
    line = new Line(e.pageX, e.pageY);
    globalDiv.append(line.line).append(marker.marker);
    body.on('mousemove', function(e) {
      var css;
      css = {};
      return line.update(e.pageX, e.pageY);
    });
    return body.on('mouseup', function(e) {
      var text;
      marker.update(e.pageX);
      text = new Tag(globalDiv, e.pageX, marker.y, marker, line, guid);
      body.off('mouseup');
      return body.off('mousemove');
    });
  };

  Marker = (function() {
    function Marker(x, y) {
      this.marker = $('<div class="image-tag-marker" id="image-tag-marker-' + x + '+' + y + '"></div>');
      this.x = x;
      this.y = y;
      this.marker.css({
        left: x + 'px',
        top: y + 'px'
      });
    }

    Marker.prototype.update = function(endX) {
      if (this.x > endX) {
        return this.marker.css({
          left: '',
          right: $(document).width() - this.x - 9 + 'px'
        });
      }
    };

    return Marker;

  })();

  Line = (function() {
    function Line(x, y, endX) {
      this.line = $('<div class="image-tag-line" id="image-tag-line-' + x + '+' + y + '"></div>');
      this.x = x;
      this.y = y;
      this.line.css('top', (parseInt(y) + 2) + 'px');
      if (endX != null) {
        this.update(endX);
      }
    }

    Line.prototype.update = function(x) {
      var css;
      css = {};
      if (Math.abs(x - this.x) < 4) {

      } else if (x <= this.x + 4) {
        css.left = '';
        css.right = $(document).width() - this.x - 1;
        css.width = Math.abs(x - this.x - 2);
      } else {
        css.right = '';
        css.left = this.x + 8;
        css.width = Math.abs(this.x - x + 7);
      }
      return this.line.css(css);
    };

    return Line;

  })();

  Tag = (function() {
    function Tag(div, x, y, marker, line, guid, text, rider) {
      var that;
      if (text == null) {
        text = '';
      }
      if (rider == null) {
        rider = '';
      }
      that = this;
      that.args = {
        startX: marker.x,
        startY: marker.y,
        endX: x,
        endY: y,
        text: text,
        rider: rider,
        guid: guid
      };
      that.guid = guid;
      that.tagId = 'image-tag-text-' + that.guid;
      that.marker = marker;
      that.line = line;
      that.textblock = $('<p class="image-tag-text-wrapper" id="image-tag-text-' + that.guid + '"></p>');
      that.textbox = $('<p class="image-tag-text">' + text + '</p>');
      that.riderbox = $('<p class="image-tag-rider">' + rider + '</p>');
      that.textblock.css('top', y + 'px');
      if (marker.x > x) {
        that.textblock.css('right', $(document).width() - x + 'px');
        that.textbox.css('text-align', 'right');
      } else {
        that.textblock.css('left', x + 'px');
        that.textbox.css('text-align', 'left');
      }
      that.textblock.append(that.textbox);
      that.textblock.append(that.riderbox);
      $(div).append(that.textblock);
      if (text === '') {
        that.textbox.prop('contentEditable', true);
        that.textbox.on('keypress', function(e) {
          if (e.keyCode === 13) {
            return $(this).blur();
          }
        });
        that.textbox.on('blur', function(e) {
          if ($.trim($(this).text()) === '') {
            return that.remove();
          } else {
            $(this).prop('contentEditable', false);
            return that.done();
          }
        });
        that.textbox.focus();
      }
      that.textbox.on('click', function(e) {
        return that.select();
      });
      tags[that.guid] = that;
    }

    Tag.prototype.done = function() {
      this.args.text = $(this.textbox).text();
      settings.callback(this);
      return this.select();
    };

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
      return tags.splice(this.guid, 1);
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
