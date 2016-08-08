module.exports = {
	first64: ( arr ) => {
		// TODO: add debug output here - if longer than 64,
		// let user know that array will be truncated
		let newArr = [];
		for ( var i = 0; i < arr.length && i < 64; i++ ) {
			newArr.push( arr[ i ] );
		}
		return newArr;
	},

	evenElementsAreAscending: ( arr ) => {
		let lastVal;
		for ( var i = 0; i < arr.length; i += 2 ) {
			if ( typeof lastVal !== 'undefined' && arr[ i ] < lastVal )
				return false;

			lastVal = arr[ i ];
		}

		return true;
	},

	oddElementsAreLT32: ( arr ) => {
		for ( var i = 1; i < arr.length; i += 2 ) {
			if ( arr[ i ] > 32 ) return false;
		}

		return true;
	},

	withinRange: ( val, min, max ) => {
		return val >= min && val <= max;
	},
};
