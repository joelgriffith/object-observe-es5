(function() {

    if (!Object.observe) {

        var polyfill = require('./lib/polyfill'),
            utils = require('./lib/utils');

        /**
         *  Observe Shim
         */
        Object.defineProperty(Object.prototype, 'observe', {
            enumerable: false,
            configurable: true,
            writeable: false,
            value: function(obj, handler) {
                var props = utils.keys(obj),
                    propsL = props.length;

                for (var i = 0; i < propsL; i++) {
                    polyfill.watchProperty(obj, props[i], handler);
                }
                function updateProperties() {
                    if (!utils.compare(props, utils.keys(obj))) {
                        polyfill.updateProperties(utils.diff(props, utils.keys(obj)), obj, handler);
                        props = utils.keys(obj);
                    }
                }
                polyfill.setDirtyCheck(obj, 50, updateProperties);
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
                    propsL = props.length;

                for (var i = 0; i < propsL; i++) {
                    polyfill.unWatchProperty(obj, props[i]);
                }
                polyfill.clearDirtyCheck(obj);
            }
        });
    }
})();