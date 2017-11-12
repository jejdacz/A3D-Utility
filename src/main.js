/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

//TODO * builder for controls
//TODO * simple factory for components
//TODO * debug log class

//TODO first try then refactor


import { ImageEditorController } from './lib/ImageEditorController.js';
import { EventTarget } from './lib/EventTarget.js';
import { Grid } from './lib/Grid.js';
import { ToggleButton } from './lib/ToggleButton.js';
import { Meter } from './lib/Meter.js';

$(function(){
   	
   	var canvas2d = document.getElementById("canvas2d");
   
   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
	
	var GUIController = new EventTarget();
	GUIController.controls = [];
			
	var ime = new ImageEditorController(canvas2d);
	
	// Grid helper init	
	var grid = new Grid(ime.canvas, 3, 3);	
	ime.addHelper(grid);
	grid.addEventListener('change', e => ime.onChange(e));
	createHelperButton(grid, createButtonHTML('id3', 'Grid')).appendTo("#controlsForm fieldset div.form-group");
	
	// Meter tool init
	var meter = new Meter(ime);
	ime.addTool(meter);
	meter.addEventListener('change', e => ime.onChange(e));
	createToolButton(meter, createButtonHTML('id1', 'Meter')).appendTo("#controlsForm fieldset div.form-group");
	
	// Meter tool 2	init
	var meter2 = new Meter(ime);
	ime.addTool(meter2);
	meter2.addEventListener('change', e => ime.onChange(e));
	createToolButton(meter, createButtonHTML('id1', 'Meter')).appendTo("#controlsForm fieldset div.form-group");
			
	// set default image
	ime.setImageSource("/static/blank.jpg");
		
	// enable controls when image loaded
	ime.addEventListener('imageload', e => GUIController.dispatchEvent({type:"enablecontrols"}));
	
	// prevent submit action
	fileForm.onsubmit = function(e) {e.preventDefault();}
	
	// on file select				
	fileInput.onchange = function(e) {
			
		// disable controls on file loading
		GUIController.dispatchEvent({type:"disablecontrols"});
		
		// read file
		reader.readAsDataURL(fileInput.files[0]);
	}
	
	// on file load
	reader.onload = function(){
  		var dataURL = reader.result;	
  		
  		// validate file type
  		if (fileInput.files[0].type.substring(0, 5) == 'image') {	  			
  			
  			// pass src to editor
  			ime.setImageSource(dataURL);
  		} else {
  			
  			// pass src to editor, displays warning image
  			ime.setImageSource("/static/invalid.jpg");
  		}	
  		
  		// reset form when file is loaded
  		fileForm.reset();
	}
		
//createButtonHTML(id, name).HTML(createButtonHTML(id, name)).appendTo(dsfdfs).create

/*** Factory methods ***/

/**
 * Creates Tool button. Button is stored in GUIController.controls.
 * Sets button callbacks and listeners.
 * Returns jquery object. 
 */
function createToolButton(tool, button) {
			
	var tb = new ToggleButton();
	
	GUIController.controls.push(tb);	
	
	GUIController.addEventListener('enablecontrols', e => tb.enable(e));
	GUIController.addEventListener('disablecontrols', e => tb.disable(e));
		
	var dt = () => tb.deactivate();
	
	tb.onActivate = () => {		
		ime.activateTool(tool);
		ime.addEventListener('overridetool', dt);
		button.addClass("active");			
	};
	
	tb.onDeactivate = () => {
		ime.removeEventListener('overridetool', dt);
		ime.deactivateTool(tool);		
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
 * Creates Helper button. Button is stored in GUIController.controls.
 * Sets button callbacks and listeners.
 * Returns jquery object.
 */
function createHelperButton(tool, button) {
			
	var tb = new ToggleButton();
	
	GUIController.controls.push(tb);
	
	GUIController.addEventListener('enablecontrols', e => tb.enable(e));
	GUIController.addEventListener('disablecontrols', e => tb.disable(e));
		
	tb.onActivate = () => {				
		tool.activate();		
		button.addClass("active");			
	};	
	
	tb.onDeactivate = () => {		
		tool.deactivate();
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
function createButtonHTML(id, name) {
	var button = $("<button>", {class: "form-control", type: "button", id: id, text: name});	
	return button;
}

});   
