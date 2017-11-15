/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

//MUST:
//TODO simple control system
//TODO create() factory static method
//TODO Crop class
//TODO UNDO
//TODO Zoom
//FIXME GUIController class
//FIXME Code style

//SHOULD:
//TODO * debug log class

//TIPS:
//TODO first test then refactor

import { ImageEditorController } from './lib/ImageEditorController.js';
import { EventTarget } from './lib/EventTarget.js';
import { Grid } from './lib/Grid.js';
import { Meter } from './lib/Meter.js';
import { NullTool } from './lib/NullTool.js';

const IME_TOOLS = "#ime-tools";
const IME_HELPERS = "#ime-helpers";

const HELPER_BUTTON = "<button type=\"button\" class=\"btn btn-success btn-sm\">text</button>";
const TOOL_BUTTON = "<button type=\"button\" class=\"btn btn-info btn-sm\">text</button>";

const $CANVAS = $("<canvas>", {text: "Your browser does not support the HTML5 canvas tag."});
const IME = new ImageEditorController($CANVAS[0]);

// GUI OBJECT SETUP
const GUI = new EventTarget();
GUI.controls = {};
GUI.disableControls = function(){
	$(IME_TOOLS + " button").prop("disabled", true);
	$(IME_HELPERS + " button").prop("disabled", true);
}

GUI.enableControls = function(){
	$(IME_TOOLS + " button").prop("disabled", false);
	$(IME_HELPERS + " button").prop("disabled", false);
}


// jQuery custom function
$.fn.myFunc = function() {
	$(this).addCalss('my');
	return this;
}

// BUTTON'S CALLBACKS
const clickTool = function(obj) {
	console.log('but clicked');
	var tool = obj.data.tool;
	if ($(this).hasClass("active")) {
		console.log('but is active');
		return;
	} else {
		$(IME_TOOLS + " button").removeClass("active");
		IME.activateTool(tool);
		$(this).addClass("active");
		console.log('but activated');
	}
}

const clickHelper = function(obj) {
	console.log('hlp clicked');
	var helper = obj.data.helper;
	if ($(this).hasClass("active")) {
		IME.deactivateHelper(helper);
		$(this).removeClass("active");
		console.log('hlp deactivated');
	} else {		
		IME.activateHelper(helper);
		$(this).addClass("active");
		console.log('hlp activated');
	}
}

const reader = new FileReader();

// INIT ON DOCUMENT READY
$(function(){
   	
	initIME();
	initOpenFile();
});

function initIME() {
		
	// CREATE GRID HELPER
	var grid = new Grid(IME.canvas, 3, 3);
	IME.addHelper(grid); // draw()
	grid.addEventListener('change', e => IME.onChange(e));
	var gridIcon = '<span class="glyphicon glyphicon-th" aria-hidden="true"></span>';	
	$(HELPER_BUTTON)
		.html(gridIcon)
		.click({helper:grid}, clickHelper)
		.appendTo(IME_HELPERS);
	
	// CREATE METER TOOL
	var meter = new Meter(IME);
	IME.addTool(meter);	
	meter.addEventListener('change', e => IME.onChange(e));	
	$(TOOL_BUTTON)
		.text("Meter")
		.click({tool:meter}, clickTool)
		.appendTo(IME_TOOLS);
			
	// CREATE CURSOR TOOL
	var cursor = new NullTool();	
	IME.addTool(cursor);	
	$(TOOL_BUTTON)
		.text("Cursor")
		.click({tool:cursor}, clickTool)
		.appendTo(IME_TOOLS)
		.trigger("click"); // activated by default
	
	// place canvas to page
	$CANVAS.appendTo("#canvas-placeholder");
	
	// enable contols when file loaded
	IME.addEventListener('imageload', e => GUI.enableControls());
	
	// set default image
	IME.setImageSource("/static/blank.jpg");
}
	
function initOpenFile() {	
		
	// open file form actions
	$("#ime-openfile")
		.submit(function(e) {
			e.preventDefault();
		})		
		.change(function(e) {
			
		// disable controls on file loading
		GUI.disableControls();
		
		// read file
		reader.readAsDataURL($("#ime-openfile input")[0].files[0]);
		});
	
	// on file load
	reader.onload = function(){
  		var dataURL = reader.result;
  		
  		// validate file type
  		if ($("#ime-openfile input")[0].files[0].type.substring(0, 5) == 'image') {	  			
  			
  			// pass src to editor
  			IME.setImageSource(dataURL);
  		} else {
  			
  			// pass src to editor, displays warning image
  			IME.setImageSource("/static/invalid.jpg");
  		}	  		
	}
}



