/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 
 // move to viewer.js
 * - 3d scene setup
 * - 3d file opening
 */

//TODO Grid controls
//TODO Crop controls (ratio)
//TODO Controls layout
//TODO Default draw style
//TODO Read file progressbar
//TODO Read file onerror

//FIXME Input check + error check
//FIXME Code style
//FIXME Event class
//FIXME Crop tool's control points behavior when mouse out of canvas
//FIXME No blank file

import { ImageEditorController } from "./lib/ImageEditorController.js";
import { GUIController } from "./lib/GUIController.js";
import { EventTarget } from "./lib/EventTarget.js";
import { Grid } from "./lib/Grid.js";
import { Meter } from "./lib/Meter.js";
import { Crop } from "./lib/Crop.js";
import { NullTool } from "./lib/NullTool.js";

const IME_TOOLS = "#ime-tools";
const IME_HELPERS = "#ime-helpers";
const IME_OPENFILE = "#ime-openfile";

const HELPER_BUTTON = "<button type=\"button\" class=\"btn btn-success btn-sm\">text</button>";
const TOOL_BUTTON = "<button type=\"button\" class=\"btn btn-info btn-sm\">text</button>";

const $CANVAS = $("<canvas>", {text: "Your browser does not support the HTML5 canvas tag."});
const ime = ImageEditorController.create({ canvas:$CANVAS[0] });
const gui = GUIController.create();
const reader = new FileReader();

/* Tool button click action */
const clickTool = function(obj) {	
	var tool = obj.data.tool;
	if ($(this).hasClass("active")) {		
		return;
	} else {
		$(IME_TOOLS + " button").removeClass("active");
		ime.activateTool(tool);
		$(this).addClass("active");		
	}
}

/* Helper button click action */
const clickHelper = function(obj) {	
	var helper = obj.data.helper;
	if ($(this).hasClass("active")) {
		ime.deactivateHelper(helper);
		$(this).removeClass("active");		
	} else {		
		ime.activateHelper(helper);
		$(this).addClass("active");		
	}
}

/**
 * On document ready actions.
 */
$(function(){
   	
	initIME();
	initOpenFile();
});

/**
 * Image editor initialization.
 */
function initIME() {	
	/* GUI setup */
	gui.disableControls = function(){
		$(IME_TOOLS + " button").prop("disabled", true);
		$(IME_HELPERS + " button").prop("disabled", true);
	}

	gui.enableControls = function(){
		$(IME_TOOLS + " button").prop("disabled", false);
		$(IME_HELPERS + " button").prop("disabled", false);
	}
		
	/* Create grid helper */
	var grid = Grid.create({ canvas:ime.getCanvas(), rows:3, cols:3 });
	ime.addHelper(grid); // ime calls draw()
	grid.addEventListener("change", () => ime.draw());
	var gridIcon = "<span class=\"glyphicon glyphicon-th\" aria-hidden=\"true\"></span>";	
	$(HELPER_BUTTON)
		.html(gridIcon)
		.click({helper:grid}, clickHelper)
		.appendTo(IME_HELPERS);
	
	/* Create meter tool */
	var meter = Meter.create({ canvas:ime.getCanvas() });
	ime.addTool(meter);	
	meter.addEventListener("change", () => ime.draw());
	$(TOOL_BUTTON)
		.text("Meter")
		.click({tool:meter}, clickTool)
		.appendTo(IME_TOOLS);
		
	/* Create crop tool */
	var crop = Crop.create({ canvas:ime.getCanvas(),imageConf:ime.getimageConf() });
	ime.addTool(crop);	
	crop.addEventListener("change", () => ime.draw());
	crop.addEventListener("crop", () => {ime.imageConfigModified();});
	$(TOOL_BUTTON)
		.text("Crop")
		.click({tool:crop}, clickTool)
		.appendTo(IME_TOOLS);
			
	/* Create cursor tool */
	var cursor = NullTool.create();	
	ime.addTool(cursor);	
	$(TOOL_BUTTON)
		.text("Cursor")
		.click({tool:cursor}, clickTool)
		.appendTo(IME_TOOLS)
		.trigger("click"); // activated by default
		
	$(HELPER_BUTTON)
		.text("CropOk")
		.click( () => {crop.crop();} )  // imageConf won't be modified during it's lifetime so CTOR injection is ok
		.appendTo(IME_HELPERS);
		
	$(HELPER_BUTTON)
		.text("Restore")
		.click( () => ime.restore() )
		.appendTo(IME_HELPERS);
		
	$(HELPER_BUTTON)
		.text(" + ")
		.click( () => ime.zoomIn() )		
		.appendTo(IME_HELPERS);
		
	$(HELPER_BUTTON)
		.text(" - ")
		.click( () => ime.zoomOut() )	
		.appendTo(IME_HELPERS);
	
	// place canvas to page
	$CANVAS.appendTo("#canvas-placeholder");
	
	// enable contols when file loaded
	ime.addEventListener("imageload", () => gui.enableControls());
	
	// set default image	
	ime.setImageSource("/static/blank.jpg");
}

/**
 * Initialize image file opening form.
 */	
function initOpenFile() {		
	// open file form actions
	$(IME_OPENFILE)
		.submit(function(e) {
		
			e.preventDefault();
		})		
		.change(function(e) {
		
			// disable controls on file loading
			gui.disableControls();
			
			// read file
			reader.readAsDataURL($(IME_OPENFILE + " input")[0].files[0]);
			
		});
	
	// on file load
	reader.onload = function(){
  		var dataURL = reader.result;
  		
  		// validate file type
  		if ($(IME_OPENFILE + " input")[0].files[0].type.substring(0, 5) == "image") {	  			
  			
  			// pass src to editor
  			ime.setImageSource(dataURL);
  		} else {
  			
  			// pass src to editor, displays warning image
  			ime.setImageSource("/static/invalid.jpg");
  		}
  		
  		// clear information about file from the form
  		$(IME_OPENFILE)[0].reset();		
	}
}



