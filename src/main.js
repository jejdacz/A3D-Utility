/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 
 // move to viewer.js
 * - 3d scene setup
 * - 3d file opening
 */

//TODO insert 3d viewer
//TODO openfile feature for 3d viewer

//TODO init functions for every tool - code level of abstraction

//TODO Default draw style

//FIXME Code style
//FIXME Event class
//FIXME Crop tool's control points behavior when mouse out of canvas
//FIXME No blank file

import { ImageEditorController } from "./lib/ImageEditorController.js";
import { GUIController } from "./lib/GUIController.js";
import { Grid } from "./lib/Grid.js";
import { Meter } from "./lib/Meter.js";
import { Crop } from "./lib/Crop.js";
import { NullTool } from "./lib/NullTool.js";

const IME_TOOLS = "#ime-tools";
const IME_HELPERS = "#ime-helpers";
const IME_OPENFILE = "#ime-openfile";

const HELPER_BUTTON = "<button type=\"button\" class=\"btn btn-success btn-sm\" data-toggle=\"collapse\" data-target=\"#target\">text</button>";
const TOOL_BUTTON2 = "<a data-toggle=\"collapse\" data-target=\"#target\" href=\"#\">text</a>";
const TOOL_BUTTON = "<button type=\"button\" class=\"btn btn-warning btn-sm\" data-toggle=\"collapse\" data-target=\"#target\">text</button>";
const TOOL_SETTINGS = "<li id=\"target\" class=\"settings collapse\"></li>";


const SET_INPUT = "<input type=\"text\" class=\"\">";

const DEF_STROKE = "rgba(0, 0, 0, 0.75)";

const $CANVAS = $("<canvas>", {text: "Your browser does not support the HTML5 canvas tag."});
const	ime = ImageEditorController.create({ canvas:$CANVAS[0] });
const	gui = GUIController.create();

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
	
	initTools();
	initOpenFile();
	initGUI();
	
});

/**
 * Image editor GUI initialization.
 */
function initGUI() {
	
	/* GUI setup */
	gui.disableControls = function(){
		$(IME_TOOLS + " button").prop("disabled", true);
		$(IME_HELPERS + " button").prop("disabled", true);
	}

	gui.enableControls = function(){
		$(IME_TOOLS + " button").prop("disabled", false);
		$(IME_HELPERS + " button").prop("disabled", false);
	}
	
	// place canvas to page
	$CANVAS.appendTo("#canvas-placeholder");
	
	// enable contols when file loaded
	ime.addEventListener("imageload", () => gui.enableControls());
	
	// controls disabled by default
	gui.disableControls();
	
	// set default image
	ime.setImageSource("/static/blank.jpg");
}

/**
 * Initialize image file opening form.
 */	
function initOpenFile() {
	const reader = new FileReader();
	
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
	
	// on file load error
	reader.onerror = function(){
	
		// pass src to editor, displays warning image
		ime.setImageSource("/static/invalid.jpg");
		
		// clear information about file from the form
		$(IME_OPENFILE)[0].reset();
	}
}

/**
 * Initialize editor tools.
 */
function initTools() {

	/* Create cursor tool */
	var cursor = NullTool.create();	
	ime.addTool(cursor);	
	var $btnCursor = $(TOOL_BUTTON)
		.text("Cursor")		
		.click(() => {
				if (!cursor.isActive()) ime.activateTool(cursor);
			})		
		.appendTo(IME_TOOLS)		 
		.wrap("<li></li>");
		
	cursor.addEventListener("activate", () => $btnCursor.addClass("active"));
	cursor.addEventListener("deactivate", () => $btnCursor.removeClass("active"));
	
	$btnCursor.trigger("click"); // activated by default
	
		
	/* Create meter tool */
	var meter = Meter.create({ canvas:ime.getCanvas() });
	ime.addTool(meter);	
	meter.addEventListener("change", () => ime.draw());
	var $btnMeter = $(TOOL_BUTTON)
		.text("Meter")
		.click(() => {
				if (!meter.isActive()) ime.activateTool(meter);
			})		
		.appendTo(IME_TOOLS)
		.wrap("<li></li>");
		
	meter.addEventListener("activate", () => $btnMeter.addClass("active"));
	meter.addEventListener("deactivate", () => $btnMeter.removeClass("active"));
	
		
	/* Create crop tool */
	var crop = Crop.create({ canvas:ime.getCanvas(),imageConf:ime.getimageConf() });
	ime.addTool(crop);	
	crop.addEventListener("change", () => ime.draw());
	crop.addEventListener("crop", () => ime.imageConfigModified());
	var $btnCrop = $(TOOL_BUTTON)
		.text("Crop")
		.attr("data-target","#crop-settings")
		.click(() => {
				if (!crop.isActive()) ime.activateTool(crop);
			})		
		.appendTo(IME_TOOLS)
		.wrap("<li></li>");
		
	crop.addEventListener("activate", () => $btnCrop.addClass("active"));
	crop.addEventListener("deactivate", () => $btnCrop.removeClass("active"));
		
	// append settings
	var $setCrop = $(TOOL_SETTINGS)
		.attr("id","crop-settings")
		.append("<ul>" +
							"<li>" +
								"<label for=\"crop-settings-width\">Width:</label>" +
							"</li>" +
							"<li>" +
								"<label class=\"value\" id=\"crop-settings-width\"></label>" +
							"</li>" +							
							"<li>" +
								"<label for=\"crop-settings-height\">Height:</label>" +
							"</li>" +
							"<li>" +
								"<label class=\"value\" id=\"crop-settings-height\"></label>" +
							"</li>" +							
							"<li>" +
								"<label for=\"crop-settings-ratio\">Ratio:</label>" +
							"</li>" +
							"<li>" +
								"<label class=\"value\" id=\"crop-settings-ratio\"></label>" +
							"</li>" +							
							"<li>" +
								"<button type=\"button\" class=\"btn btn-danger btn-sm\" id=\"crop-settings-apply\">Apply crop</button>" +
							"</li>" +
						"</ul>")
		.appendTo(IME_TOOLS);
		
	$("#crop-settings-apply").click(() => crop.crop());
	
	crop.addEventListener("change", () => {
		$("#crop-settings-width").text(crop.getWidth());
		$("#crop-settings-height").text(crop.getHeight());
		$("#crop-settings-ratio").text(Math.round((crop.getWidth()/crop.getHeight())*100)/100);
	});
		
	//crop.addEventListener("activate", () => $setCrop.collapse("show"));
	crop.addEventListener("deactivate", () => $setCrop.collapse("hide"));
		
			
	/* Create grid helper */
	var grid = Grid.create({ canvas:ime.getCanvas(), rows:3, cols:3 });
	ime.addHelper(grid); // ime calls draw()
	grid.addEventListener("change", () => ime.draw());		
	var $btnGrid = $(HELPER_BUTTON)
		.text("Grid")
		.attr("data-target","#grid-settings")
		.click(() => {
				if (!grid.isActive()) {
					ime.activateHelper(grid);
				} else {
					ime.deactivateHelper(grid);
				}
			})		
		.appendTo(IME_TOOLS)
		.wrap("<li></li>");
	
	grid.addEventListener("activate", () => $btnGrid.addClass("active"));
	grid.addEventListener("deactivate", () => $btnGrid.removeClass("active"));
	
	// append settings
	var $setGrid = $(TOOL_SETTINGS)
		.attr("id","grid-settings")
		.append("<ul>" +
							"<li>" +
								"<label for=\"grid-settings-rows\">Rows:</label>" + 
								"<input type=\"number\" min=\"1\" class=\"input-sm\" id=\"grid-settings-rows\">" +
							"</li>" +
							"<li>" +
								"<label for=\"grid-settings-rows\">Cols:</label>" +
								"<input type=\"number\" min=\"1\" class=\"input-sm\" id=\"grid-settings-cols\">" +
							"</li>" +							
						"</ul>")		
		.appendTo(IME_TOOLS);
		
	grid.addEventListener("deactivate", () => $setGrid.collapse("hide"));
	
	$("#grid-settings-rows").val(grid.getRows());
	$("#grid-settings-cols").val(grid.getCols());	
	
	$("#grid-settings-cols").on("input", function() {
		if (isNaN($(this).val())) {
			console.log("not a number");
		} else {
			grid.setCols(Number($(this).val()));
		}
	});
	
	$("#grid-settings-rows").on("input", function() {
		if (isNaN($(this).val())) {
			console.log("not a number");
		} else {
			grid.setRows(Number($(this).val()));
		}
	});
	
	/* Create restore and zoom buttons */
			
	var $btnRestore = $(HELPER_BUTTON)
		.text("Restore")
		.click(() => ime.restore())
		.appendTo(IME_TOOLS)
		.wrap("<li></li>");		
		
	var $btnZoomIn = $(HELPER_BUTTON)
		.text(" + ")
		.addClass("half")
		.click(() => ime.zoomIn());				
		
	var $btnZoomOut = $(HELPER_BUTTON)
		.text(" - ")
		.addClass("half")
		.click(() => ime.zoomOut());		
		
	$("<li></li>")		
		.append($btnZoomIn)
		.append($btnZoomOut)
		.appendTo(IME_TOOLS);
		
	$("#snapshot").click(function(){
				ime.setImageSource(window.renderer.domElement.toDataURL());				
	});
}

