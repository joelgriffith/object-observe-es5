(function() {

    if (!Object.observe) {

        /**
         *  Observe Shim
         */
        Object.defineProperty(Object.prototype, 'observe', {
            enumerable: false,
            configurable: true,
            writeable: false,
            value: function(obj, handler) {
                var props = Object.keys(obj),
                    length = props.length;

                /**
                 *  Interval
                 *  This is a "private" holder for the dirty checking interval so we can clear later
                 */
                Object.defineProperty(obj, '__interval__', {
                    enumerable: false,
                    configurable: true,
                    writeable: false,
                    value: setInterval(watchForChanges, 50)
                });

                /**
                 *  Filter
                 *  Abstraction for diffing array values (quicker than .filter)
                 */
                function filter(a, func) {
                    var match = [];
                    for (var i = 0; i < a.length; i++) {
                        if (func(a[i])) {
                            match.push(a[i]);
                        }
                    }
                    return match;
                }

                /**
                 *  Watch Property
                 *  Given a property identifier, replace it's getter/setter so we can watch it for 'updates'
                 */
                function watchProperty(prop) {
                    var oldval = obj[prop],
                        newval = oldval,
                        getter = function() {
                            return newval;
                        },
                        setter = function(val) {
                            oldval = newval;
                            if (oldval !== val) {
                                handler([{
                                    type: 'update',
                                    object: obj,
                                    name: prop,
                                    oldValue: oldval
                                }]);
                            }
                            return (newval = val);
                        };

                    if (delete obj[prop]) {
                        Object.defineProperty(obj, prop, {
                            get: getter,
                            set: setter,
                            enumerable: true,
                            configurable: true
                        });
                    }
                }

                /**
                 *  Watch For Changes
                 *  Dirty check the object's properties and handle new/deleted properties
                 *      in the same tick, the latter ones won't be there.
                 */
                function watchForChanges() {
                    if (Object.keys(obj).length !== length) {
                        var newProps = Object.keys(obj),
                            newLength = newProps.length,
                            deltaProps;

                        if (newLength > length) {
                            deltaProps = filter(newProps, function(i) {
                                return props.indexOf(i) < 0;
                            });
                            handler([{
                                type: 'add',
                                object: obj,
                                name: deltaProps[0]
                            }]);
                            applyObserve(deltaProps);
                        } else {
                            deltaProps = filter(props, function(i) {
                                return newProps.indexOf(i) < 0;
                            });
                            handler([{
                                type: 'delete',
                                object: obj,
                                name: deltaProps[0]
                            }]);
                        }
                        props = newProps;
                        length = newLength;
                    }
                }

                /**
                 *  Apply Observe
                 *  Iterate over the array of keys on the object, and apply the getter/setter on it
                 */
                function applyObserve(arr) {
                    var length = arr.length;
                    for (var i = 0; i < length; i++) {
                        watchProperty(arr[i]);
                    }
                }
                applyObserve(props);
                watchForChanges();
            }
        });

        /**
         *  Unobserve Shim
         */
        Object.defineProperty(Object.prototype, 'unobserve', {
            enumerable: false,
            configurable: true,
            writeable: false,
            value: function(obj) {
                if (!obj.__interval__) {
                    return false;
                }
                var props = Object.keys(obj),
                    length = props.length;

                /**
                 *  Clear Observe
                 *  Replace the custom getter/setters on a property with the static ones
                 */
                function clearObserve(prop) {
                    var val = obj[prop];
                    delete obj[prop];
                    obj[prop] = val;
                }
                for (var i = 0; i < length; i++) {
                    clearObserve(props[i]);
                }

                /**
                 *  Clear the dirty check timer, and delete the no unused timer property
                 */
                clearInterval(obj.__interval__);
                delete obj.__interval__;
            }
        });
    }
})();