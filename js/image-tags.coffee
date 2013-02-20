$ = jQuery

focusedElement = null

tags = {}
settings = {}

$.fn.image_tag = (options) ->
	settings = $.extend({
		'tags': {},
		'callback': ->
	}, options)
	
	addTag(tag.startX, tag.startY, tag.endX, tag.endY, tag.text, tag.rider) for tag in settings.tags

	this.on('mousedown', 'img', placeTag)

addTag = (startX, startY, endX, endY, text, rider) ->
	body = $('body')
	guid = new GUID().guid()
	globalDiv = $('<div id="image-tag-' + guid + '"></div>')
	body.append(globalDiv)

	marker = new Marker(startX, startY)
	marker.update(endX)
	line = new Line(startX, startY, endX)
	globalDiv.append(line.line).append(marker.marker)

	tag = new Tag(globalDiv, endX, endY, marker, line, guid, text, rider)

placeTag = (e) ->
	body = $('body')
	guid = new GUID().guid()
	globalDiv = $('<div id="image-tag-' + guid + '"></div>')
	body.append(globalDiv)

	marker = new Marker(e.pageX, e.pageY)
	line = new Line(e.pageX, e.pageY)
	globalDiv.append(line.line).append(marker.marker)
	
	body.on('mousemove', (e) ->
		css = {}
		line.update(e.pageX, e.pageY)
	)

	body.on('mouseup', (e) ->
		marker.update(e.pageX)
		text = new Tag(globalDiv, e.pageX, marker.y, marker, line, guid)

		body.off('mouseup')
		body.off('mousemove')
	)

class Marker
	constructor: (x, y) ->
		this.marker = $('<div class="image-tag-marker" id="image-tag-marker-' + x + '+' + y + '"></div>')
		this.x = x
		this.y = y
		this.marker.css({
			left: x + 'px',
			top: y + 'px'
		})

	update: (endX) ->
		if (this.x > endX)
			this.marker.css({
				left: '',
				right: $(document).width() - this.x - 9 + 'px',
			})

class Line
	constructor: (x, y, endX) ->
		this.line = $('<div class="image-tag-line" id="image-tag-line-' + x + '+' + y + '"></div>')
		this.x = x
		this.line.css('top', y + 2 + 'px')
		this.update(endX) if endX?

	update: (x) ->
		css = {}
		# I set css.left|right = '' to clear its setting.
		if (Math.abs(x - this.x) < 4)
			#do nothing. its inside the marker
		else if(x <= this.x + 4)
			css.left = ''
			# -1 allows the line to overlap the marker
			# -2 allows it to overlap the text
			css.right = $(document).width() - this.x - 1
			css.width = Math.abs(x - this.x - 2)
		else
			css.right = ''
			css.left = this.x + 8
			# +1 allows it to overlap the marker. 
			css.width = Math.abs(this.x - x + 7)

		this.line.css(css)

class Tag
	constructor: (div, x, y, marker, line, guid, text = '', rider = '') ->
		that = this
		that.args = {
			startX: marker.x,
			startY: marker.y,
			endX: x,
			endY: y,
			text: text,
			rider: rider
		}

		that.guid = guid
		that.tagId = 'image-tag-text-' + that.guid
		that.marker = marker
		that.line = line
		that.textblock = $('<p class="image-tag-text-wrapper" id="image-tag-text-' + that.guid + '"></p>')
		that.textbox = $('<p class="image-tag-text">' + text + '</p>')
		that.riderbox = $('<p class="image-tag-rider">' + rider + '</p>')
		
		that.textblock.css('top', y + 'px')
		if (marker.x > x)
			that.textblock.css('right', $(document).width() - x + 'px')
			that.textbox.css('text-align', 'right')
		else
			that.textblock.css('left', x + 'px')
			that.textbox.css('text-align', 'left')

		that.textblock.append(that.textbox)
		that.textblock.append(that.riderbox)
		$(div).append(that.textblock)
		
		if (text == '')
			that.textbox.prop('contentEditable', true)
			that.textbox.on('keypress', (e) ->
				if(e.keyCode == 13)
					$(this).blur()
			)

			that.textbox.on('blur', (e) ->
				if($.trim($(this).text()) == '')
					that.remove()
				else
					$(this).prop('contentEditable', false)
					that.done()
			)
			that.textbox.focus()
		
		that.textbox.on('click', (e) ->
			that.select()
		)

		tags[that.guid] = that


	done: ->
		settings.callback(this)
		this.args.text = $(this.textbox).text()
		this.args.rider = $(this.riderbox).text()
		this.select()
		console.log(JSON.stringify(this.args))

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

class GUID
	s4: ->
		Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
			 
	guid: ->
		this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4()

