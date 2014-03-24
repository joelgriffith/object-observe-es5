module.exports = {

	// Array Fixtures
	array: {

		// #compare
		compare: {

			// Testing Length
			lengthA : [1,2,3],
			lengthB : [1,2,3,4],

			// Testing Truthy
			truthyA: [1,2,3],
			truthyB: [1,2,3],

			// Testing Recursion
			nestedA: [1,2,3,[1,2]],
			nestedB: [1,2,3,[2,1]],
			nestedC: [1,2,3,[1,2]],

			// Testing non-arrays
			typeA: 1,
			typeB: [1,2,3],
			typeC: 'string'
		},

		// #diff
		diff: {

			// Testing identical arrays
			emptyA: [1,2,3],
			emptyB: [1,2,3],

			// Testing identical arrays in different orders
			orderA: [1,2,3],
			orderB: [3,2,1],

			// Differences
			diffA: [1,2,3],
			diffB: [1,2,3,4],

			// Types
			typeA: [1,2,3,'a','b','c'],
			typeB: [1,2,3,4,'a','b','c','d'],

			// Non Arrays
			nonArrayA: 'string',
			nonArrayB: true,
			nonArrayC: undefined,
			nonArrayD: 9,
			nonArrayE: {},
			nonArrayF: null
		},

		// #keys
		keys: {

			// Return
			returnA: {'one': 1, 'two': 2},

			// Testing empty
			empty: {},

			// Standard behaviour
			flat: {'one' : 1, 'two' : 2, 'three' : 3},

			// Nested object
			nested: {'one': 1, 'two': { 'notMe': 0, 'orMe': 0 }, 'three': 3},

			// Type checkin'
			nonObjectA: 'string',
			nonObjectB: true,
			nonObjectC: undefined,
			nonObjectD: 9,
			nonObjectE: [],
			nonObjectF: null
		}
	}
};