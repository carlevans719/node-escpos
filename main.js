const { Printer, PrintJob } = require( './escpos.js' );
let myPrinter = new Printer();
let myPrintJob = new PrintJob();
const Jimp = require( 'jimp' );
const getPixels = require( 'get-pixels' );

const ESC = 0x1b;
const NUL = 0x00;

const cmds = {
	INIT: [ ESC, 0x40 ], // Clear data in buffer and reset modes
	SELECT: [ ESC, 0x3d, 0x01 ], // Printer select
	RESET: [ ESC, 0x3f, 0x0a, NUL ], // TODO: Not documented...
}

myPrinter.connect();

// Jimp.read( '/home/carl/Pictures/1.png', ( err, result ) => {
// 	result.greyscale().dither565();
// 	console.log( result.bitmap.data, result.bitmap.data.length );
//
// 	result.getBuffer( result._originalMime, ( bad, bitmap ) => {
// 		const width = result.bitmap.width;
// 		const widthBuffer = Buffer.from( [ width % 256, Math.floor( width / 256 ) ] )
// 		const height = result.bitmap.height;
// 		const heightBuffer = Buffer.from( [ height % 256, Math.floor( height / 256 ) ] );
// 		console.log( `Image height is ${height} pixels, image width is ${width} pixels` );
//
// 		const dataBuffer = Buffer.alloc( width * height );
// 		const bitmapBuffer = Buffer.from( result.bitmap.data );
// 		let tempArr = [];
// 		for ( let i = 0; i < bitmapBuffer.length; i += 4 ) {
// 			tempArr.push( bitmapBuffer[ i + 2 ] );
// 		}
// 		const tempBuffer = Buffer.from( tempArr );
// 		tempBuffer.copy( dataBuffer );
// 		console.log( tempBuffer.length, dataBuffer.length );
//
// 		myPrinter.print( [
// 			Buffer.concat( [
// 				Buffer.from( [ 0x1d, 0x76, 0x30, 0x03 ] ),
// 				widthBuffer,
// 				heightBuffer,
// 				dataBuffer
// 			] )
// 		] )
//
// 	} )
// } )


// getPixels( '/home/carl/Pictures/1.png', ( pixelsErr, pixels ) => {
// 	if ( pixelsErr ) return;
//
// 	console.log( pixels.shape, pixels.data.length );
// 	const printCmd = pixelsToEscPos( pixels.shape[ 1 ], pixels.shape[ 0 ], Array.from( pixels.data ) );
//
// 	myPrinter.print( [ printCmd ] );
// } );

Jimp.read( '/home/carl/Pictures/abc.jpg', ( err, result ) => {
	result.opaque().greyscale();

	const pixels = Array.from( result.bitmap.data );
	const bwPixels = [];
	for ( let i = 0; i < pixels.length; i += 4 ) {
		bwPixels.push( pixels[ i ] );
	}
	const printCmd = pixelsToEscPos( result.bitmap.height, result.bitmap.width, bwPixels );
	console.log( result.bitmap.height, result.bitmap.width );
	myPrinter.print( [ printCmd ] );
} );


const pixelsToEscPos = ( height, width, pixels ) => {
	console.log( "Processing " + pixels.length + " pixels..." );

	const HEADER = [ 0x1d, 0x76, 0x30, 0x00 ];
	const bytesNeeded = Math.ceil( width / 8 ); // 8 pixels per byte
	const widthBuffer = Buffer.from( [ ( bytesNeeded * 2 ) % 256, Math.floor( ( bytesNeeded * 2 ) / 256 ) ] ); // xL, xH
	const heightBuffer = Buffer.from( [ height % 256, Math.floor( height / 256 ) ] ); // yL, yH

	const pixels_copy = pixels.slice( 0 ); // Avoid side-effects XXX: memory issue?
	const pixelBytes = [];
	// let rowCount = 0;
	while ( pixels_copy.length ) {
		// let colCount = 0;
		for ( let i = width; i > 0; i -= 8 ) {
			pixelBytes.push( pixelsToByte( pixels_copy.splice( 0, Math.min( i, 8 ) ) ) );
			// colCount++;
		}
		// rowCount++;
		// console.log( "Added " + colCount + " columns" );
	}
	// console.log( "Added " + rowCount + " rows" );

	return Buffer.concat( [
		Buffer.from( HEADER ),
		widthBuffer,
		heightBuffer,
		Buffer.from( pixelBytes )
	] );
}

// pass in an array with length === 8
// e.g. [0,255,255,255,255,255,255,255];
// Element [0] has a weighting of 128
// Element [1] has a weighting of 64
// etc..
const pixelsToByte = ( pixels ) => {
	const threshold = 128;
	let value = 0;

	// convert analog to digital & sum
	for ( let i = 0; i < 8; i++ ) {
		if ( i < pixels.length )
			value += Number( pixels[ i ] >= threshold ) << ( 7 - i );
	}

	return value;
}


const buildPixelArray = () => {
	let toPrint = [];

	// row 1
	for ( let z = 0; z < 125; z++ ) {
		for ( let a = 0; a < 500; a++ ) {
			toPrint.push( 0x00 );
		}
	}

	// row 2
	for ( let y = 0; y < 125; y++ ) {
		for ( let b = 0; b < 100; b++ ) {
			toPrint.push( 0x00 );
		}
		for ( let c = 0; c < 150; c++ ) {
			toPrint.push( 0xFF );
		}
		for ( let d = 0; d < 250; d++ ) {
			toPrint.push( 0x00 );
		}
	}

	// row 3
	for ( let x = 0; x < 125; x++ ) {
		for ( let e = 0; e < 100; e++ ) {
			toPrint.push( 0x00 );
		}
		for ( let f = 0; f < 75; f++ ) {
			toPrint.push( 0xFF );
		}
		for ( let g = 0; g < 125; g++ ) {
			toPrint.push( 0x00 );
		}
		for ( let h = 0; h < 100; h++ ) {
			toPrint.push( 0x00 );
		}
		for ( let j = 0; j < 100; j++ ) {
			toPrint.push( 0x00 );
		}
	}

	// row 4
	for ( let w = 0; w < 125; w++ ) {
		for ( let k = 0; k < 100; k++ ) {
			toPrint.push( 0x00 );
		}
		for ( let l = 0; l < 150; l++ ) {
			toPrint.push( 0xFF );
		}
		for ( let m = 0; m < 250; m++ ) {
			toPrint.push( 0x00 );
		}
	}

	// row 5
	for ( let v = 0; v < 125; v++ ) {
		for ( let n = 0; n < 500; n++ ) {
			toPrint.push( 0x00 );
		}
	}

	return toPrint;
};

// myPrinter.print( [ pixelsToEscPos( 650, 500, buildPixelArray() ) ] );
