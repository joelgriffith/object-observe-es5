module.exports = {

	/**
	 *	Watch Property
	 *	Given an object, property, and handler, replace it with a custom getter/setter
	 */
	watchProperty: function(obj, prop, handler) {
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
	},

	/**
	 *	Given a delta object, update the watched properties and fire a callback
	 */
	updateProperties: function(delta, obj, handler) {
		var added = delta.added,
			deleted = delta.deleted,
			hasAdded = !!added.length,
			hasDeleted = !!deleted.length,
			all = delta.all,
			allL = all.length,
			response = [];

		for (var i = 0; i < allL; i++) {
			this.watchProperty(obj, all[i], handler);

			if (hasAdded && i <= added.length) {
				response.push({
					type: 'add',
					object: obj,
					name: added[i]
				});
			}
			if (hasDeleted && i <= deleted.length) {
				response.push({
					type: 'deleted',
					object: obj,
					name: deleted[i]
				});
			}
		}
		handler(response);
	},

	/**
	 *	Unwatch Property
	 *	Given an object and property, retrieve the old value, delete the prop, and set it
	 */
	unWatchProperty: function(obj, prop) {
		var val = obj[prop];
		delete obj[prop];
		obj[prop] = val;
	},

	/**
	 *	Set Dirty Check
	 *	Define a 'hidden' dirty check on the object so that it can be cleared later
	 */
	setDirtyCheck: function(obj, time, fn) {
		Object.defineProperty(obj, '__interval__', {
			enumerable: false,
			configurable: true,
			writeable: false,
			value: setInterval(fn, time)
		});
	},

	/**
	 *	Clear Dirty Check
	 *	Given an object, clear the dirty-check interval and delete the property.
	 */
	clearDirtyCheck: function(obj) {
		clearInterval(obj.__interval__);
		delete obj.__interval__;
	}
};