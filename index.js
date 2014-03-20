if (!Object.observe) {
    Object.defineProperty(Object.prototype, 'observe', {
        enumerable: false,
        configurable: true,
        writeable: false,
        value: function(obj, handler) {
            var props = Object.keys(obj),
                length = props.length,
                raf = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame;

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
                        deltaProps = newProps.filter(function(i) {
                            return props.indexOf(i) < 0;
                        });
                        handler([{
                            type: 'add',
                            object: obj,
                            name: deltaProps[0]
                        }]);
                        applyWatch(deltaProps);
                    } else {
                        deltaProps = props.filter(function(i) {
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
                raf(watchForChanges);
            }
            function applyWatch(arr) {
                var length = arr.length;
                for (var i = 0; i < length; i++) {
                    watchProperty(arr[i]);
                }
            }
            applyWatch(props);
            watchForChanges();
        }
    });
}

if (!Object.unobserve)