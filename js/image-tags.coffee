$ = jQuery

focusedElement = null

tags = {}

$.fn.image_tag = (options) ->
	settings = $.extend({
		
	}, options)

	this.on('mousedown', 'img', placeTag)

# 8 and 2 are the offsets for the marker. Allows the line to be 
# in the middle of the marker
addTag = (markerX, markerY, lineWidth, textX, textY, textAlign, text) ->
	body = $('body')
	guid = new GUID().guid()
	globalDiv = $('<div id="image-tag-' + guid + '"></div>')

	marker = new Marker(globalDiv, markerX, markerY)
	line = new Line(globalDiv, markerX + 8, markerY + 2, lineWidth)
	tag = new Tag(globalDiv, textX, textY, guid, text)

placeTag = (e) ->
	body = $('body')
	guid = new GUID().guid()
	globalDiv = $('<div id="image-tag-' + guid + '"></div>')
	marker = new Marker(globalDiv, e.pageX, e.pageY)
	line = new Line(globalDiv, e.pageX + 8, e.pageY + 2)
	body.append(globalDiv)
	
	body.on('mousemove', (e) ->
		css = {}
		# I set css.left|right = '' to clear its setting.
		if(e.pageX < marker.x)
			css.left = ''
			# -1 allows the line to overlap the marker
			# -2 allows it to overlap the text
			css.right = $(document).width() - marker.x - 1
			css.width = Math.abs(e.pageX - marker.x - 2)
		else
			css.right = ''
			css.left = line.x
			# +1 allows it to overlap the marker. 
			css.width = Math.abs(e.pageX - line.x + 1)

		line.line.css(css)
	)
	body.on('mouseup', (e) ->
		text = {}
		if(e.pageX < marker.x)
			text = new Tag(globalDiv, $(document).width() - e.pageX, marker.y, marker, line, guid, 'right')
			# -9 is the width of the marker + 1
			# this allows the line to go across the marker and then overlap it.
			# flipping the markers positioning so it stays with its
			#   line and tag when page is zoomed or resized.
			marker.x = $(document).width() - marker.x - 9
			marker.marker.css('left', '')
			marker.marker.css('right', marker.x)
		else
			text = new Tag(globalDiv, e.pageX, marker.y, marker, line, guid, 'left')

		body.off('mouseup')
		body.off('mousemove')
	)

class Marker
	constructor: (div, x, y) ->
		this.marker = $('<div class="image-tag-marker" id="image-tag-marker-' + x + '+' + y + '"></div>')
		this.x = x
		this.y = y
		this.marker.css({
			left: x + 'px',
			top: y + 'px'
		})

		div.append(this.marker)

class Line
	constructor: (div, x, y, width) ->
		this.line = $('<div class="image-tag-line" id="image-tag-line-' + x + '+' + y + '"></div>')
		this.x = x
		this.y = y
		this.line.css('left', x + 'px')
		this.line.css('top', y + 'px')
		this.line.css('width', width) if width?
		div.append(this.line)

class Tag
	constructor: (div, x, y, marker, line, guid, textAlign = 'left', text = '', rider = '') ->
		that = this
		if (focusedElement != null)
			$(focusedElement).removeClass('image-tag-focused')

		that.guid = guid
		console.log(guid)
		that.tagId = 'image-tag-text-' + that.guid
		that.marker = marker
		that.line = line
		that.textblock = $('<p class="image-tag-text-wrapper" id="image-tag-text-' + that.guid + '"></p>')
		that.text = $('<p class="image-tag-text">' + text + '</p>')
		that.rider = $('<p class="image-tag-rider">' + rider + '</p>')
		that.textblock.css(textAlign, x + 'px')
		that.textblock.css('top', y + 'px')
		
		that.text.css('text-align', textAlign)

		that.textblock.append(that.text)
		that.textblock.append(that.rider)
		$(div).append(that.textblock)
		
		if (text == '')
			that.text.prop('contentEditable', true)
			that.text.on('keypress', (e) ->
				if(e.keyCode == 13)
					$(this).blur()
			)

			that.text.on('blur', (e) ->
				if($.trim($(this).text()) == '')
					that.remove()
				else
					$(this).prop('contentEditable', false)
					that.select()
			)
			that.text.focus()
		
		that.text.on('click', (e) ->
			that.select()
		)

		tags[that.guid] = that

	select: ->
		if (focusedElement != null && focusedElement != this)
			$('#image-tag-' + focusedElement.guid + '> div').removeClass('image-tag-focused')
			$('#image-tag-text-' + focusedElement.guid + '> p').removeClass('image-tag-focused')

		$('#image-tag-' + this.guid + '> div').addClass('image-tag-focused')
		$('#image-tag-text-' + this.guid + '> p').addClass('image-tag-focused')
		focusedElement = this

	remove: ->
		this.text.remove()
		this.line.line.remove()
		this.marker.marker.remove()

		tags.splice(this.guid, 1)
		console.log(tags)

class GUID
	s4: ->
		Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
			 
	guid: ->
		this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()

