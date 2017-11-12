/**
 * Toggle button.
 *
 * @author Marek Mego 
 */
 
import { EventTarget } from './EventTarget.js';

class ToggleButton extends EventTarget {
	constructor(){		
		super();
		this._activated = false;
		this._enabled = true;
		this._onEnableCallback = function(){};
		this._onDisableCallback = function(){};
		this._onActivateCallback = function(){};
		this._onDeactivateCallback = function(){};		 
	}
	
	set onEnable(c) {this._onEnableCallback = c;}	
	set onDisable(c) {this._onDisableCallback = c;}	
	set onActivate(c) {this._onActivateCallback = c;}	
	set onDeactivate(c) {this._onDeactivateCallback = c;}
		
	click() {
		console.log('tb clicked');
		if (this._enabled) {
			if (this._activated) {
				this.deactivate();
			} else {
				this.activate();
			}
		}
	}
	
	enable() {
		console.log('tb enabled');
		this._enabled = true;
		this._onEnableCallback();
	}
	
	disable() {
		console.log('tb disabled');
		this._enabled = false;
		this._onDisableCallback();
	}
	
	activate() {
		console.log('tb activated');
		this._activated = true;
		this._onActivateCallback();		
	}
	
	deactivate() {
		console.log('tb deactivated');
		this._activated = false;
		this._onDeactivateCallback();
	}	
}

export  { ToggleButton };
