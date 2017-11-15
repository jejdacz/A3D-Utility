/**
 * Simple event target class.
 *
 * Source: https://developer.mozilla.org
 */

class EventTarget {
	constructor() {
		this.listeners = {};		
	}	
	
	addEventListener(type, callback) {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		console.log("add lis " + type);
		this.listeners[type].push(callback);
	}
	
	removeEventListener(type, callback) {
		if (!(type in this.listeners)) {
			return;
		}
		
		var stack = this.listeners[type];
  		for (var i = 0, l = stack.length; i < l; i++) {
    		if (stack[i] === callback){
      		stack.splice(i, 1);
      		console.log("rem lis " + type);
      		return;
    		}
  		}
		
	}
	
	dispatchEvent(event) {
		if (!(event.type in this.listeners)) {
			return true;
		}
		var stack = this.listeners[event.type];
		
		for (var i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event);
		}
		
		return !event.defaultPrevented;
	}
}

export { EventTarget };
