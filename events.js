(function() {
	var E = function() {
		if (!Array.prototype.forEach) throw new Error('Update your browser');
	};

	E.prototype.on = function(eventName, callback, context) {
		if (!eventName || !callback) return this;
		if (typeof eventName === 'number') eventName = '' + eventName;

		var namesArr = eventName.split(' '),
			dataObj = {
				callback	: callback,
				context		: context
			};

		this._events = this._events || {};
		context = context || null;

		namesArr.forEach(function(name, i) {
			if (!this._events[name]) {
				this._events[name] = {
					callbacks : [dataObj]
				};
			} else {
				this._events[name].callbacks.push(dataObj);
			}
		}.bind(this));

		return this;
	};
	E.prototype.off = function(name, callback, context) {
		if (!this._events) return this;

		if (!name && !callback && !context) {
			this._events = {};
			return this;
		}

		if (name && !callback && !context) {
			delete this._events[name];
			return this;
		}

		var arr;

		Object.keys(this._events).forEach(function(key) {
			arr = this._events[key].callbacks;

			if (!arr || !arr.length) return this;

			arr.forEach(function(item, n) {
				if (callback && !context) {
					if (item && item.callback === callback) {
						arr.splice(n, 1);
						n--;
					}
				}
				if (!callback && context) {
					if (item && item.context === context) {
						arr.splice(n, 1);
						n--;
					}
				}

				if (callback && context) {
					if ( (item && item.callback === callback) && (item && item.context === context) ) {
						arr.splice(n, 1);
						n--;
					}
				}
			});

			if (!arr.length) delete this._events[key];
		}.bind(this));

		return this;
	};
	E.prototype.trigger = function(eventName) {
		if (!this._events) return this;
		if (typeof eventName === 'number') eventName = '' + eventName;

		var args = Array.prototype.slice.call(arguments, 1) || [],
			namesArr = eventName.split(' '),
			allArgs, arr;

		namesArr.forEach(function(name, i) {
			if (!this._events[name]) return this;

			arr		= this._events[name].callbacks;
			arrAll	= (this._events['all'] && this._events['all'].callbacks) || [];
			allArgs	= args.slice();

			allArgs.unshift(name);

			if (!arr || !arr.length) return this;

			arr.forEach(function(item) {
				if (!item || typeof item.callback !== 'function') return true;

				item.callback.apply(item.context, args);

				//All
				arrAll.forEach(function(allItem) {
					allItem.callback.apply(allItem.context, allArgs);
				});
			});
		}.bind(this));

		return this;
	};
	E.prototype.once = function(eventName, callback, context) {
		this.on.apply(context, Array.prototype.slice.call(arguments));
		this.on(eventName, function() {
			this.off(eventName, callback);
		}, this);

		return this;
	};

	if (!window.E) window.E = E;
	return E;
}());