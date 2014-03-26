#Event emitter (mediator, observer)

Global name window.e;

##Methods
- on - __object.on(event, callback, [context])__
Bind a callback function to an object. The callback will be invoked whenever the event is fired. If you have a large number of different events on a page, the convention is to use colons to namespace them: "poll:start", or "change:selection". The event string may also be a space-delimited list of several events.
Callbacks bound to the special "all" event will be triggered when any event occurs, and are passed the name of the event as the first argument. For example, to proxy all events from one object to another:
`
proxy.on('all', function(eventName) {
	object.trigger(eventName);
});
`

- off - __object.off([event], [callback], [context])__
Remove a previously-bound callback function from an object. If no context is specified, all of the versions of the callback with different contexts will be removed. If no callback is specified, all callbacks for the event will be removed. If no event is specified, callbacks for all events will be removed.
`
// Removes just the `onChange` callback.
object.off("change", onChange);

// Removes all "change" callbacks.
object.off("change");

// Removes the `onChange` callback for all events.
object.off(null, onChange);

// Removes all callbacks for `context` for all events.
object.off(null, null, context);

// Removes all callbacks on `object`.
object.off();
`

- trigger - __object.trigger(event, [*args])__
Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be passed along to the event callbacks.

- once - __object.once(event, callback, [context])__
Just like on, but causes the bound callback to only fire once before being removed. Handy for saying "the next time that X happens, do this".

- installTo __object.installTo(object, [withEvents])__
Clone events ability to other object. withEvents - clone events previous object or not. Not by default.
