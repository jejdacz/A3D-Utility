/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

//MUST:
//TODO Refactor methods out of DOC READY and to MODULES  ---- SAME ABSTRACTION
//TODO Crop class
//TODO UNDO
//TODO Zoom
//TODO GUIController class
//TODO factory for components UTILITY MODULE

//SHOULD:
//TODO * builder for controls
//
//TODO * debug log class

//TIPS:
//TODO first test then refactor


import { ImageEditorController } from './lib/ImageEditorController.js';
import { EventTarget } from './lib/EventTarget.js';
import { Grid } from './lib/Grid.js';
import { ToggleButton } from './lib/ToggleButton.js';
import { Meter } from './lib/Meter.js';
import { NullTool } from './lib/NullTool.js';
import { Factory } from './lib/Factory.js';

const GUI_HELPERS = "#controlsForm fieldset div.form-group";
const GUI_TOOLS = "#controlsForm fieldset div.form-group";


var mess = "Your browser does not support the HTML5 canvas tag.";
var $canvas2d = $("<canvas>", {id: "canvas2d", text: mess});
var ime = new ImageEditorController($canvas2d[0]);	

$(function(){
   	   	
   	// after doc is ready document.body.appendChild(canvas2d);
   	//var canvas2d = document.getElementById("canvas2d");
   	
   	$canvas2d.appendTo("#canvasPlaceHolder");
   	
   	var canvas2d = $canvas2d[0];
   
   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
	
	var GUIController = new EventTarget();
	GUIController.controls = [];
			
	//var ime = new ImageEditorController(canvas2d);
	
	// Grid helper init	ime.addHelper(createGrid(ime.canvas, 3, 3)); //thats all
	var grid = new Grid(ime.canvas, 3, 3);	
	ime.addHelper(grid);
	grid.addEventListener('change', e => ime.onChange(e));
	createHelperButton(grid, createButtonHTML('gridHelper', 'Grid')).appendTo("#controlsForm fieldset div.form-group");
	
	// Meter tool init ************ factory method createMeter(ime, id, name) return jquery or dom
	var meter = new Meter(ime);
	ime.addTool(meter);
	meter.addEventListener('change', e => ime.onChange(e));
	createToolButton(meter, createButtonHTML('meterTool', 'Meter')).appendTo("#controlsForm fieldset div.form-group");
	
	// Meter tool 2	init
	var meter2 = new Meter(ime);
	ime.addTool(meter2);
	meter2.addEventListener('change', e => ime.onChange(e));
	createToolButton(meter, createButtonHTML('meterTool2', 'Meter')).appendTo("#controlsForm fieldset div.form-group");
	
	// Cursor/Null tool
	var cursor = new NullTool();
	ime.addTool(cursor);	
	createToolButton(cursor, createButtonHTML('cursorTool', 'Cursor')).appendTo("#controlsForm fieldset div.form-group");
	
	// activate cursor tool as default
	$("#cursorTool").trigger("click");
			
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

});

export { GUI_HELPERS, GUI_TOOLS };

