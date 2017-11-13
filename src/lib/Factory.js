/*** Factory methods ***/

import { GUI_HELPERS } from '../main.js';

class Factory {
	constructor(ime, gui) {
		this.ime = ime;
		this.gui = gui;
	}
	
	/**
	 * Creates Tool button. Button is stored in this.gui.controls.
	 * Sets button callbacks and listeners.
	 * Returns jquery object. 
	 */ 
	createToolButton(tool, button) {
			
		var tb = new ToggleButton();
	
		this.gui.controls.push(tb);
	
		this.gui.addEventListener('enablecontrols', e => tb.enable(e));
		this.gui.addEventListener('disablecontrols', e => tb.disable(e));
		tb.addEventListener('activatetool', e => this.gui.dispatchEvent(e));
		
		var dt = () => tb.deactivate();
	
		tb.onActivate = () => {		
			tb.dispatchEvent({type:"activatetool"});		
			this.ime.activateTool(tool);			
			button.addClass("active");
			this.gui.addEventListener('activatetool', dt);	
		};
	
		tb.onDeactivate = () => {	
			// tool is automaticaly deactivated by IME
			button.removeClass("active");
			this.gui.removeEventListener('activatetool', dt);
		};
	
		tb.onEnable = () => button.prop("disabled", false);
		tb.onDisable = () => button.prop("disabled", true);	
	
		button.click(function () {
			tb.activate();
		});
	
		return button;
	}

	/**
	 * Creates Helper button. Button is stored in this.gui.controls.
	 * Sets button callbacks and listeners.
	 * Returns jquery object.
	 */
	createHelperButton(tool, button) {
			
		var tb = new ToggleButton();
	
		this.gui.controls.push(tb);
	
		this.gui.addEventListener('enablecontrols', e => tb.enable(e));
		this.gui.addEventListener('disablecontrols', e => tb.disable(e));
		
		tb.onActivate = () => {
			this.ime.activateHelper(tool);		
			button.addClass("active");
		};	
	
		tb.onDeactivate = () => {		
			this.ime.deactivateHelper(tool);
			button.removeClass("active");
		};
	
		tb.onEnable = () => button.prop("disabled", false);
		tb.onDisable = () => button.prop("disabled", true);	
	
		button.click(function () {
			tb.click();
		});
	
		return button;
	}

	/**
	 * Creates button's HTML code.
	 * Returns jquery object.
	 */
	createButtonHTML(id, name) {
		var $button = $("<button>", {class: "form-control", type: "button", id: id, text: name});	
		return $button;
	}
	
	createGrid(cols, rows) {
		var grid = new Grid(this.ime.canvas, cols, rows);		
		grid.addEventListener('change', e => this.ime.onChange(e));
		
		var $button = this.createButtonHTML('gridHelper', 'Grid');
		this.createHelperButton(grid, $button).appendTo(GUI_HELPERS);
		return { tool:grid , control:$button };
	}	
}

export { Factory };
  
