$ = jQuery

$.fn.image_tag = (options) ->
	settings = $.extend({
	}, options)

	this.on('mousedown', 'img', placeMarker)

placeMarker = (e) ->
	console.log(e)
	body = $('body')
	globalDiv = $('<div></div>')
	console.log(globalDiv)
	marker = new Marker(globalDiv, e.pageX, e.pageY)
	line = new Line(globalDiv, e.pageX + 8, e.pageY + 3)
	body.append(globalDiv)
	
	body.on('mousemove', (e) ->
		css = {}
		css.width = Math.abs(e.pageX - line.x + 1)
		if(e.pageX + 8 < line.x)
			css.left = e.pageX
			css.width = Math.abs(e.pageX - line.x) - 7

		line.line.css(css)
	)

	body.on('mouseup', (e) ->
		text = {}
		if(e.pageX < marker.x)
			text = new Text(globalDiv, e.pageX - 100 - 9, marker.y, marker, line)
		else
			text = new Text(globalDiv, e.pageX, marker.y, marker, line)

		body.off('mouseup')
		body.off('mousemove')
	)

class Line
	constructor: (div, x, y) ->
		this.line = $('<div class="image-tag-line" id="image-tag-line-' + x + '+' + y + '"></div>')
		this.x = x
		this.y = y
		this.line.css({
			left: x + 'px',
			top: y + 'px'
		})
		
		div.append(this.line)

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

class Text
	constructor: (div, x, y, marker, line) ->
		this.line = line
		this.marker = marker
		this.text = $('<p class="image-tag-text" id="image-tag-text-' + x + '+' + y + '"></p>')
		this.text.css({
			left: x + 'px',
			top: y + 'px'
		})

		$(div).append(this.text)
		this.text.prop('contentEditable', true)
		this.text.on('keypress', (e) ->
			
			if(e.keyCode == 13)
				$(this).prop('contentEditable', false)
				$(this).blur()
		)

		this.text.on('blur', (e) ->
			if($.trim($(this).text()) == '')
				$(this).remove()
				line.line.remove()
				marker.marker.remove()
		)
		this.text.focus()
