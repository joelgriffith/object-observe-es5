# Differences with the original repo
## Fixes
This fork fixes the issue where `console.log(change.obj)` would print the observed object with its old value, preventing any observer to be able to retrieve the new value of the property whose change triggered the callback.

# ES5 Object.observe polyfill
## Testing
A full test-suite is included with this polyfill. You'll need `mocha`, and `jshint` installed globally for the best results. To run:

- `npm install && npm test`

## Building
There is also a gulp file included to build yourself. This requires `mocha`, `jshint`, and `gulp` to be installed globally.

- `gulp` runs the default task, which is building, linting, and running the test suite.
- `gulp test` runs the mocha test suite.
- `gulp build` builds the minified js in `build/observe.min.<build>.js`
- `gulp clean` cleans the `/build` directory.
- `gulp hint` runs jshint on the `/lib` folder.

## Differences
Though this polyfill has the majority of functionality that I anticipate people to use, there are a few differences.

### Missing Features:
- Doesn't work with Arrays. This might be addressed in the future.
- Only supports the `add`, `delete`, and `update` events on an object. The Spec implements other low-level events, such as `preventExtensions` and `frozen`. These will be addressed at a later date.

### API Differences
- Deleted properties don't have the `oldValue` parameter in the change payload.

## Intended Uses
The most obvious use is for data-binding. When a user, or another 3rd party, makes changes to an object there can now be handlers in place for how to respond. This brings an incredible amount of automation and power to applications.

## Support
This will work in any browser that has implemented ES5. To summarize: IE9+, Chrome 6+, FireFox 4+, Safari 5+, and Node.

## License
The MIT License (MIT)

Copyright (c) 2014 Joel Griffith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
