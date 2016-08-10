const iconv = require( 'iconv-lite' );
const cmds = require( './commands' );

/**
 * Creates a new Printjob object that can process escpos commands
 * which can then be printed with an attached USB escpos printer.
 *
 * @class
 */
class Printjob {

	constructor() {
		this._queue = [];

		return this;
	}

	/**
	 * Add a string of text to the printjob.
	 *
	 * @param {string} text Text string to be added to the current printjob.
	 */
	text( text ) {
		this._queue.push( iconv.encode( text, 'cp437' ) );

		return this;
	}

	/**
	 * Add new line(s) to the printjob.
	 *
	 * @param {number} [count=1] Number of new lines to be added to the current printjob.
	 */
	newLine( count = 1 ) {
		const buf = new Buffer( cmds.feed.CRLF );
		for ( let i = 0; i < count; i++ ) {
			this._queue.push( buf );
		}

		return this;
	}

	/**
	 * Add blank lines to the printjob.
	 *
	 * @param {number} [count=1] The amount of padding to be added to the current printjob.
	 */
	pad( count = 1 ) {
		const buf = new Buffer( cmds.feed.VT );
		for ( let i = 0; i < count; i++ ) {
			this._queue.push( buf );
		}

		return this;
	}

	/**
	 * Set text alignment for the current printjob.
	 *
	 * @param {string} [count='left'] Text alignment (one of: 'left', 'center', 'right')
	 */
	setTextAlignment( align = 'center' ) {
		align = align.toUpperCase();

		const cmd = cmds.text.alignment[ align ];

		if ( cmd ) {
			const buf = new Buffer( cmd );
			this._queue.push( buf );
		} else {
			throw new Error( 'Text alignment must be one of: ', Object.keys( cmds.text.alignment ).join( ', ' ).toLowerCase() );
		}

		return this;
	}

	/**
	 * Set text size for the current printjob.
	 *
	 * @param {string} [preset='large'] Text size preset (one of: 'tall', 'wide', 'large', 'custom')
	 * @param {number} [height=1] Height multiplier when preset is 'custom'. Can be 0-7
	 * @param {number} [width=1] Width multiplier when preset is 'custom'. Can be 0-7
	 */
	setTextSize( preset = 'large', height = 1, width = 1 ) {
		let cmd;
		if ( preset === 'tall' ) {
			cmd = cmds.text.size.DBL_HEIGHT;
		} else if ( preset === 'wide' ) {
			cmd = cmds.text.size.DBL_WIDTH;
		} else if ( preset === 'large' ) {
			cmd = cmds.text.size.QUAD;
		} else if ( preset === 'custom' ) {
			cmd = cmds.text.size.SET_CUSTOM( height, width );
		} else {
			throw new Error( 'Text size preset must be one of: tall, wide, large, custom' );
		}

		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set underline for the current printjob.
	 *
	 * @param {boolean} [underline=false] Enables/disables underlined text
	 */
	setUnderline( underline = false ) {
		if ( typeof underline !== 'boolean' ) {
			underline = false;
		}

		const cmd = cmds.text.font[ underline ? 'UNDERLINE_ON' : 'UNDERLINE_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set left margin for the current printjob.
	 * @todo doesn't work!
	 * @param {number} [indent=0] Sets the indent for the left margin
	 */
	setLeftMargin( indent = 0 ) {
		if ( typeof indent !== 'number' ) {
			indent = 0;
		}

		const cmd = cmds.text.spacing.SET_LEFT_MARGIN( indent );
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set double underline for the current printjob.
	 *
	 * @param {boolean} [underline=false] Enables/disables double underlined text
	 */
	setDoubleUnderline( underline = false ) {
		if ( typeof underline !== 'boolean' ) {
			underline = false;
		}

		const cmd = cmds.text.font[ underline ? 'DBL_UNDERLINE_ON' : 'UNDERLINE_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text bold for the current printjob.
	 *
	 * @param {boolean} [bold=false] Enables/disables bold text
	 */
	setBold( bold = false ) {
		if ( typeof bold !== 'boolean' ) {
			bold = false;
		}

		const cmd = cmds.text.font[ bold ? 'BOLD_ON' : 'BOLD_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text strikethrough for the current printjob.
	 * @todo: Doesn't work!
	 * @param {boolean} [strikethrough=false] Enables/disables strikethrough
	 */
	setStrikethrough( strikethrough = false ) {
		if ( typeof strikethrough !== 'boolean' ) {
			strikethrough = false;
		}

		const cmd = cmds.text.font[ strikethrough ? 'DBL_STRIKE_ON' : 'DBL_STRIKE_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set inverted for the current printjob.
	 *
	 * @param {boolean} [inverted=false] Enables/disables underlined text
	 */
	setInverted( inverted = false ) {
		if ( typeof inverted !== 'boolean' ) {
			inverted = false;
		}

		const cmd = cmds.text.font[ inverted ? 'INVERT_ON' : 'INVERT_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text flip for the current printjob.
	 * @todo: We may not want to split the print job up if this is enabled
	 * as it would be better to have all the .text() messages grouped to one.
	 * @param {boolean} [flip=false] Enables/disables flip
	 */
	setFlip( flip = false ) {
		if ( typeof flip !== 'boolean' ) {
			flip = false;
		}

		const cmd = cmds.text.orientation[ flip ? 'FLIP_ON' : 'FLIP_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text rotate for the current printjob.
	 *
	 * @param {boolean} [rotate=false] Enables/disables rotate
	 */
	setRotate( rotate = false ) {
		if ( typeof rotate !== 'boolean' ) {
			rotate = false;
		}

		const cmd = cmds.text.orientation[ rotate ? 'ROTATE_90_ON' : 'ROTATE_90_OFF' ];
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text font for the current printjob.
	 *
	 * @param {string} [font='A'] Text font (one of: 'A', 'B')
	 */
	setFont( font = 'A' ) {
		font = font.toUpperCase();

		const cmd = cmds.text.font[ 'FONT_' + font ];
		if ( !cmd ) {
			throw new Error( 'Font must be one of: A, B' );
		}

		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	separator() {
		let line = '';
		let i = 0;
		let width = 42;

		while ( i < width ) {
			line += '-';
			i++;
		}

		return this.newLine() && this.text( line ) && this.newLine();
	}

	/**
	 * Cuts paper on the current printjob.
	 */
	cut() {

		const buf = new Buffer( cmds.paper.FEED_CUT );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Print an image on the printer
	 * @todo it would be nice to support just a file path/url here
	 * @param imageData - object containing height, width and pixel data
	 */
	image( imageData ) {
		const storeBuf = new Buffer( cmds.image.STORE_BIT_IMAGE( imageData.width, imageData.height, imageData.data ) );
		this._queue.push( storeBuf );
		const printBuf = new Buffer( cmds.image.PRINT_BIT_IMAGE );
		this._queue.push( printBuf );

		return this;
	}

	// nv() {
	// 	this._queue.push( new Buffer( cmds.image.PRINT_NV ) );
	// }

	printData() {
		const init = new Buffer( cmds.printer.INIT );
		let queue = this._queue.slice( 0 ); // Clone queue
		queue.unshift( init ); // Prepend init command

		return queue;
	}

}

module.exports = Printjob;
