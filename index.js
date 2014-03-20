(function() {
    if (!Object.observe) {
        Object.defineProperty(Object.prototype, 'observe', {
            enumerable: false,
            configurable: true,
            writeable: false,
            value: function(obj, handler) {
                var props = Object.keys(obj),
                    length = props.length;

                Object.defineProperty(obj, '__interval__', {
                    enumerable: false,
                    configurable: true,
                    writeable: false,
                    value: setInterval(watchForChanges, 50)
                });

                function filter(a, func) {
                    var match = [];
                    for (var i = 0; i < a.length; i++) {
                        if (func(a[i])) {
                            match.push(a[i]);
                        }
                    }
                    return match;
                }

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

                function clearObserve(prop) {
                    var val = obj[prop];
                    delete obj[prop];
                    obj[prop] = val;
                }
                for (var i = 0; i < length; i++) {
                    clearObserve(props[i]);
                }
                clearInterval(obj.__interval__);
                delete obj.__interval__;
            }
        });
    }
})();