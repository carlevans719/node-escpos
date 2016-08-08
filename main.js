const { Printer, PrintJob } = require( './escpos.js' );
const Pixels = require( 'get-pixels' );

let myPrinter = new Printer();
let myPrintJob = new PrintJob();

myPrinter.connect();


// // Make a pretty page...
// myPrintJob.setRotate( true );
// myPrintJob.text( '|||||||||||||' );
// // myPrintJob.newLine( 2 );
//

// myPrintJob.setLeftMargin( 10 );
// myPrintJob.text( 'Oh, what fun this is. I want to check what happens when we need two lines for all the text.' )
// myPrintJob.newLine();
// myPrintJob.text( 'Look! Some more text for your reading leisure... Lovely.' )
// myPrintJob.pad()
// myPrintJob.cut();

// myPrintJob.setInverted( true );
// myPrintJob.text( 'This is line 2' );
// myPrintJob.setInverted( false );
//
// myPrintJob.text( 'And line 3' );
//
Pixels( '../../Pictures/Untitled.png', ( err, res ) => {
	res.data1 = [];
	res.data2 = [];
	res.data.forEach( pxl => { res.data2.push( pxl ) } );
	while ( res.data2.length ) {
		res.data1.push( res.data2.shift() );
		res.data2.shift();
		res.data2.shift();
		res.data2.shift();
	}
	// res[ 0 ].data1 = [];
	// res[ 0 ].data.forEach( function ( elem ) {
	// 	res[ 0 ].data1.push( elem );
	// } );
	// myPrintJob.cut(); // slice dat.
	// myPrinter.print( new Buffer( [ 0x1d, 0x2f, 0x00 ] ) );
	// myPrinter.print( [ new Buffer( [ 0x1d, 0x2a, res[ 0 ].width * 4, res[ 0 ].height ].concat( res[ 0 ].data ) ) ] );
	// console.log( Array.isArray( res[ 0 ].data1 ) );
	myPrinter.print( [ new Buffer( [ 0x1d, 0x76, 0x30, 0x03, 0x00, res.shape[ 0 ], 0x00, res.shape[ 1 ] ].concat( res.data1 ) ) ] );
} );

// myPrintJob.nv();
//
// Send the printJob to the printer
// myPrinter.print( myPrintJob, function () {
// 	console.log( "It's finished printing!!" );
// } );
