/*** Factory methods ***/

import { IME_TOOLS, IME_HELPERS, HELPER_BUTTON, TOOL_BUTTON } from "../main.js";
import { Grid } from "./Grid.js";
import { Meter } from "./Meter.js";
import { NullTool } from "./NullTool.js";
import { ToggleButton } from "./ToggleButton.js";

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
	
		this.gui.addEventListener("enablecontrols", e => tb.enable(e));
		this.gui.addEventListener("disablecontrols", e => tb.disable(e));
		tb.addEventListener("activatetool", e => this.gui.dispatchEvent(e));
		
		var dt = () => tb.deactivate();
	
		tb.onActivate = () => {		
			tb.dispatchEvent({type:"activatetool"});		
			this.ime.activateTool(tool);			
			button.addClass("active");
			this.gui.addEventListener("activatetool", dt);	
		};
	
		tb.onDeactivate = () => {	
			// tool is automaticaly deactivated by IME
			button.removeClass("active");
			this.gui.removeEventListener("activatetool", dt);
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
	
		this.gui.addEventListener("enablecontrols", e => tb.enable(e));
		this.gui.addEventListener("disablecontrols", e => tb.disable(e));
		
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
	/*	
	createGrid(cols, rows) {
		var grid = new Grid(this.ime.canvas, cols, rows);
		
		this.ime.addHelper(grid);
		grid.addEventListener("change", e => this.ime.onChange(e));
		
		var $button = $(HELPER_BUTTON).text("Grid");
		this.createHelperButton(grid, $button).appendTo(IME_HELPERS);
		
		return $button;
	}
	
	createMeter() {
		var meter = new Meter(this.ime);
		
		this.ime.addTool(meter);
		meter.addEventListener("change", e => this.ime.onChange(e));
		
		var $button = $(TOOL_BUTTON).text("Meter");
		this.createToolButton(meter, $button).appendTo(IME_TOOLS);
		
		return $button;
	}
	
	createCursor() {
		var cursor = new NullTool();
		
		this.ime.addTool(cursor);		
		
		var $button = $(TOOL_BUTTON).text("Cursor");
		this.createToolButton(cursor, $button).appendTo(IME_TOOLS);
		
		return $button;
	}	*/	
}

export { Factory };
  
