/*** Factory methods ***/

import { ToggleButton } from './ToggleButton.js';
	
/**
 * Creates Tool button. Button is stored in this.gui.controls.
 * Sets button callbacks and listeners.
 * Returns jquery object. 
 */ 
function createToolButton(ime, gui, tool, button) {
		
	var tb = new ToggleButton();

	gui.controls.push(tb);

	gui.addEventListener('enablecontrols', e => tb.enable(e));
	gui.addEventListener('disablecontrols', e => tb.disable(e));
	tb.addEventListener('activatetool', e => gui.dispatchEvent(e));
	
	var dt = () => tb.deactivate();

	tb.onActivate = () => {		
		tb.dispatchEvent({type:"activatetool"});		
		ime.activateTool(tool);			
		button.addClass("active");
		gui.addEventListener('activatetool', dt);	
	};

	tb.onDeactivate = () => {	
		// tool is automaticaly deactivated by IME
		button.removeClass("active");
		gui.removeEventListener('activatetool', dt);
	};

	tb.onEnable = () => button.prop("disabled", false);
	tb.onDisable = () => button.prop("disabled", true);	

	button.click(function () {
		tb.activate();
	});

	return tb;
}

/**
 * Creates Helper button. Button is stored in this.gui.controls.
 * Sets button callbacks and listeners.
 * Returns jquery object.
 */
function createHelperButton(ime, gui, tool, button) {
		
	var tb = new ToggleButton();

	gui.controls.push(tb);

	gui.addEventListener('enablecontrols', e => tb.enable(e));
	gui.addEventListener('disablecontrols', e => tb.disable(e));
	
	tb.onActivate = () => {
		ime.activateHelper(tool);		
		button.addClass("active");
	};	

	tb.onDeactivate = () => {		
		ime.deactivateHelper(tool);
		button.removeClass("active");
	};

	tb.onEnable = () => button.prop("disabled", false);
	tb.onDisable = () => button.prop("disabled", true);	

	button.click(function () {
		tb.click();
	});

	return tb;
}
	
export { createToolButton, createHelperButton };
  
