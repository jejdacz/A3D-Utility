/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

//MUST:
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
import { ToggleButton } from './lib/ToggleButton.js';
import { createToolButton, createHelperButton } from './lib/Utility.js';

const IME_TOOLS = "#ime-tools";
const IME_HELPERS = "#ime-helpers";

const HELPER_BUTTON = '<button type="button" class="btn btn-success btn-sm">text</button>';
const TOOL_BUTTON = '<button type="button" class="btn btn-info btn-sm">text</button>';

const $CANVAS = $("<canvas>", {text: "Your browser does not support the HTML5 canvas tag."});
const IME = new ImageEditorController($CANVAS[0]);
const GUI = new EventTarget();
GUI.controls = [];
const reader = new FileReader();

// Init image editor when document ready.
$(function(){
   	
	initIME();
	initOpenFile();
});

function initIME() {
		
	// CREATE GRID HELPER
	var grid = new Grid(IME.canvas, 3, 3);		
	IME.addHelper(grid);
	grid.addEventListener('change', e => IME.onChange(e));
	var gridIcon = '<span class="glyphicon glyphicon-th" aria-hidden="true"></span>';	
	var $gridButton = $(HELPER_BUTTON).html(gridIcon).appendTo(IME_HELPERS);
	createHelperButton(IME, GUI, grid, $gridButton);
		
	// CREATE METER TOOL
	var meter = new Meter(IME);	
	IME.addTool(meter);
	meter.addEventListener('change', e => IME.onChange(e));	
	var $meterButton = $(TOOL_BUTTON).text("Meter").appendTo(IME_TOOLS);
	createToolButton(IME, GUI, meter, $meterButton);
		
	// CREATE CURSOR TOOL
	var cursor = new NullTool();	
	IME.addTool(cursor);	
	var $cursorButton = $(TOOL_BUTTON).text("Cursor").appendTo(IME_TOOLS);
	createToolButton(IME, GUI, cursor, $cursorButton);
	
	// select cursor tool by default
	$cursorButton.trigger("click");
	
	// place canvas to page
	$CANVAS.appendTo("#canvas-placeholder");
	
	// enable contols when file loaded
	IME.addEventListener('imageload', e => GUI.dispatchEvent({type:'enablecontrols'}));
	
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
		GUI.dispatchEvent({type:'disablecontrols'});
		
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



