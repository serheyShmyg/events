(function(root, factory) {
	//AMD
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return factory(root);
		});
	//CommonJS
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(root);
	//Global
	} else {
		root.e = factory(root);
	}
}(this, function(root) {
	return {
		_namesLoop : function(names, callback) {
			var arr = names.split(' '),
				max = arr.length,
				n = 0;

			if (!max) return this;

			for (; n < max; n++) {
				if (typeof callback === 'function') callback.call(this, arr[n]);
			}

			return this;
		},
		on : function(eventName, callback, context) {
			if (!this._events) this._events = {};

			context = context || null;

			this._namesLoop(eventName, function(name) {
				if (!this._events[name]) {
					this._events[name] = {
						callbacks	: [{
							callback	: callback,
							context		: context
						}]
					};
				} else {
					this._events[name].callbacks.push({
						callback	: callback,
						context		: context
					});
				}
			});

			return this;
		},
		off : function(name, callback, context) {
			if (!this._events) return this;

			if (!name && !callback && !context) {
				this._events = {};
				return this;
			}

			if (name && !callback && !context) {
				delete this._events[name];
				return this;
			}

			var key, arr, max, n;

			for (key in this._events) {

				arr = this._events[key].callbacks;
				max = arr && arr.length;
				n = 0;

				if (!max) return this;

				for (; n < max; n++) {
					if (callback && !context) {
						if (arr[n] && arr[n].callback === callback) {
							arr.splice(n, 1);
							n--;
						}
					}

					if (!callback && context) {
						if (arr[n] && arr[n].context === context) {
							arr.splice(n, 1);
							n--;
						}
					}

					if (callback && context) {
						if ( (arr[n] && arr[n].callback === callback) && (arr[n] && arr[n].context === context) ) {
							arr.splice(n, 1);
							n--;
						}
					}
				}
			}

			return this;
		},
		trigger : function(eventName) {
			if (!this._events) return this;

			var args = Array.prototype.slice.call(arguments, 1) || [],
				allArgs;

			this._namesLoop(eventName, function(name) {
				if (!this._events[name]) return this;

				var arr		= this._events[name].callbacks,
					max		= arr.length,
					n		= 0,
					arrAll	= (this._events['all'] && this._events['all'].callbacks) || [],
					maxAll	= arrAll.length,
					z		= 0;

				allArgs = args.slice();
				allArgs.unshift(name);

				if (!max) return this;

				for (; n < max; n++) {
					if (!arr[n]) continue;
					if (typeof arr[n].callback !== 'function') continue;

					arr[n].callback.apply(arr[n].context, args);

					//All
					for (; z < maxAll; z++) {
						arrAll[z].callback.apply(arrAll[z].context, allArgs);
					}
				}
			});

			return this;
		},
		once : function(eventName, callback, context) {
			this.on.apply(this, Array.prototype.slice.call(arguments));
			this.on(eventName, function() {
				this.off(eventName, callback);
			}, this);

			return this;
		},
		installTo : function(o, withEvents) {
			var key;
			for (key in this) {
				if (!this.hasOwnProperty(key)) continue;
				o[key] = this[key];
			}

			if (!withEvents && o._events) o._events = {};

			return this;
		}
	};
}));