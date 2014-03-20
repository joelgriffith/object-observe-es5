# Sick-Model

Sick-Model is an object wrapper that add's a crucial method, `onChange`. This allows an application to listen for changes to a model property, and do something when it happens. Largely inspired by Object.observe and Object.watch.

## Integrating it

```
/**
 * RequireJS
 */
require('./index.js', function(SickModel) {
	// Your code here with SickModel!
});

/**
 * CommonJS/Node/WebPack
 */
var SickModel = require('./index.js');

// Or if it's your node_modules
var SickModel = require('sick-merge');

/**
 * 90's Web Developers
 */
<script src="index.js" type="text/javascript"></script>
```

## Example

```javascript
// Simple model
var jeffreyLebowski = {
	name: 'Jeffrey Lebowski',
	nickname: 'The Dude',
	sport: 'Bowling',
	rugStatus: 'Stolen'
};

// Adding the onChange of Sick-Model
var theDude = new SickModel(jeffreyLebowski);

// Listening for the change
theDude.onChange('rugStatus', function(propName, oldValue, newValue) {
	console.log(propName, oldValue, newValue);
});

// When it changes
theDude.rugStatus = 'Found'; // Prints: 'rugStatus, Stolen, Found'
```

## About
This code mostly revovles around [the wonderful shim that Eli Grey has written](https://gist.github.com/eligrey/384583). Instead of implementing it in the Object.prototype, however, it merely adds it ONLY to the object you pass it in the constructor, thus keeping the namespace clean.