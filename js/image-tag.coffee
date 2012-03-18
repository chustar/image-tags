$ = jQuery

$.fn.image_tag = (options) ->
	settings = $.extend({
	}, options)

	this.on('mousedown', 'img', placeMarker)

placeMarker = (e) ->
	parent = $(this).parent()
	marker = new Marker(parent, e.pageX, e.pageY)
	parent.on('mouseup', (e) ->
		text = new Text(this, e.pageX, e.pageY, marker)
		$(this).off('mouseup')
	)

class Marker
	constructor: (div, x, y) ->
		this.marker = $('<div class="marker" id="marker-' + x + '+' + y + '"></div>')
		this.marker.css({
			left: x + 'px',
			top: y + 'px'
		})

		div.append(this.marker)

class Text
	constructor: (div, x, y, marker) ->
		this.marker = marker
		this.text = $('<p class="text" id="text-' + x + '+' + y + '"></p>')
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
			console.log($(this).text())
			if($.trim($(this).text()) == '')
				$(this).remove()
				marker.marker.remove()
		)
		this.text.focus()
