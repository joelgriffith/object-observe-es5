module.exports = {

	/**
	 *	Compare
	 *	Iterates over two arrays to determine if they are the same.
	 *	@return <boolean>
	 */
	compare: function(arr1, arr2) {
		if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
			throw new TypeError('#compare accepts two parameters, both being Arrays.');
		}
		if (arr1.length !== arr2.length) {
			return false;
		}
		for (var i = 0, l = arr1.length; i < l; i++) {
			if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
				if (!this.compare(arr1[i], arr2[i])) {
					return false;
				}
			} else if (arr1[i] !== arr2[i]) {
				return false;
			}
		}
		return true;
	},

	/**
	 *	Diff
	 *	Iterates over two arrays and returns their differences.
	 *	@return <Object>
	 */
	diff: function(arr1, arr2) {
		if (!arr1 || !arr2 || !(arr1 instanceof Array) || !(arr2 instanceof Array)) {
			throw new TypeError('#diff accepts two parameters, both being Arrays.');
		}
		var a = [],
			diff = {},
			a1L = arr1.length,
			a2L = arr2.length;

		diff.added = [];
		diff.deleted = [];
		diff.all = [];

		for (var i = 0; i < a1L; i++) {
			a[arr1[i]] = 1;
		}
		for (var j = 0; j < a2L; j++) {
			if (a[arr2[j]]) {
				delete a[arr2[j]];
			} else {
				a[arr2[j]] = 2;
			}
		}
		for (var k in a) {
			diff.all.push(k);
			if (a[k] === 1) {
				diff.deleted.push(k);
			} else {
				diff.added.push(k);
			}
		}
		return diff;
	},

	/**
	 *	Keys
	 *	Shallowly iterates over an object and returns an array of top-level properties
	 *	@return <Array>
	 */
	keys: function(obj) {
		if (Object.prototype.toString.call(obj) !== '[object Object]') {
			throw new TypeError('#keys only accepts objects');
		}
		var props = [];
		for (var prop in obj) {
			props.push(prop);
		}
		return props;
	},

	/**
	 *	Clone
	 *	Clones an Object to an associative array.
	 *	@return <Array>
	 */
	clone: function(obj) {
		var a = [];
		for (var prop in obj) {
			a[prop] = obj[prop];
		}
		return a;
	}
};