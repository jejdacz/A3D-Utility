/**
 * A3D Utility
 * 
 * This is a utility suitable for artists to make reference images from 3d models.
 * 1. Adjust the camera on the 3d scene.
 * 2. Make a snapshot of the 3d scene.
 * 3. Crop and resize the snapshot.
 * 4. Draw the grid over the image.
 * 5. Save the image by right-mouse-button click on the image editor screen.
 * 
 * @author Marek Mego
 * (c) 2017
 *
 * Copyrights of the parts used in this utility:
 *
 * Base for 3D viewer
 * WebGL 3D Model Viewer Using three.js (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js)
 * Copyright (c) 2016 Manuel Wieser
 * Licensed under MIT (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js/blob/master/LICENSE) 
 *
 *
 * Base for 3D viewer
 * JavaScript 3D library (https://github.com/mrdoob/three.js)
 * Copyright © 2010-2016 three.js authors
 * Licensed under MIT (https://github.com/mrdoob/three.js/blob/master/LICENSE)
 *
 *
 * Base for main page design
 * Start Bootstrap - Simple Sidebar (https://startbootstrap.com/template-overviews/simple-sidebar)
 * Copyright 2013-2017 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-simple-sidebar/blob/master/LICENSE)
 *
 * 
 * 
 *
 * Usage:
 * 	Run the utility on a local	http server, e.g. Python server. 
 *
 *			// for python 3.x
 * 			python -m http.server
 *
 * 	3dviewer:
 * 		supported file format of 3d object is .obj
 *		
 *		On the page viewer's screen fills the rest of the browser's window next to the side bar.
 *		Use mouse to control rotation/zoom/pan. Screen is adjusted when the window is resized.
 *		
 *	Make a snapshot of the scene by the "Snapshot" button.
 *	The image will be displayed in the Image editor screen right below the 3dviewer screen. Scroll down to see it.
 *
 *	Image editor:
 *		Use the snapshot or open an image file from local filesystem.
 *		
 *		Cursor tool:
 *			Does nothing. Suitable when saving the image.
 *
 *		Meter tool:
 *			Measures a distance in pixels on the image editor screen.
 *
 *		Crop tool:
 *			Crops the image to the selection.
 *
 *		Grid tool:
 *			Displays the grid over the image editor screen.
 *
 *		Restore:
 *			Restores the image to the state when it was loaded.
 *
 *		Zoom + / - :
 *			Resizes the image.
 *
 *
 * This script does:
 * - init constants, variables and DOM elements
 * - init image editor 
 * - init 3d viewer
 * - init file open forms
 */

import { ImageEditorController } from "./js/ImageEditorController.js";
import { GUIController } from "./js/GUIController.js";
import { Grid } from "./js/Grid.js";
import { Meter } from "./js/Meter.js";
import { Crop } from "./js/Crop.js";
import { NullTool } from "./js/NullTool.js";
import { Point } from "./js/Point.js";


/**
 * Templates
 */
const FORM_BUTTON = "<button type=\"button\" class=\"btn btn-info btn-sm\">text</button>";
const HELPER_BUTTON = "<button type=\"button\" class=\"btn btn-success btn-sm tool\" data-toggle=\"collapse\" data-target=\"#target\">text</button>";
const TOOL_BUTTON = "<button type=\"button\" class=\"btn btn-warning btn-sm tool\" data-toggle=\"collapse\" data-target=\"#target\">text</button>";
const TOOL_SETTINGS = "<li id=\"target\" class=\"settings collapse\"></li>";


/**
 * DOM Elements
 */
var $error;
var $tools;
var $btn3d;
const $canvas = $("<canvas width=\"0\" height=\"0\">text: \"Your browser does not support the HTML5 canvas tag.</canvas>");

// TODO: put all controls, containers and GUI elements to GUIController container to unify access

/**
 * Controllers
 */
var	ime;
var	gui;


/**
 *
 * On document ready.
 *
 * Init the application.
 *
 */ 
$(function(){
	
	$error = $("#error-placeholder");
	$tools = $("#ime-tools");
	
	ime = ImageEditorController.create({ canvas:$canvas[0] });
	gui = GUIController.create();
	
	initForms();
	initTools();	
	initOpenImageFile();
	initGUI();
	init3dviewer();	
			
});


/**
 * Initialize Open 3D, Snapshot, Open Image forms.
 */
function initForms() {
	
	// append file open forms to the page
	$tools.append(
		"<form id=\"three-openfile\">" +																		
			"<input id=\"inputfile-three\" class=\"input-sm\" type=\"file\" accept=\".obj\" required=\"required\" multiple>" +
		"</form>"+		
		"<form id=\"ime-openfile\">" +																				
			"<input id=\"inputfile-image\" class=\"input-sm\" type=\"file\" accept=\"image/*\" required=\"required\" >" +
		"</form>"
	);			
	
	// create the Open 3d button - disabled, feature not implemented
	$btn3d = $(FORM_BUTTON)
		.text("Open 3D")
		.click(function(){
				$("#inputfile-three").trigger("click");
			})
		.appendTo($tools)
		.prop("disabled", true)		 
		.wrap("<li></li>");		
	
	// create the Snapshot button	
	var $btnSnap = 	$(FORM_BUTTON)
		.text("Snapshot")			
		.click(function(){
				ime.setImageSource(renderer.domElement.toDataURL());
				$('html, body').animate({ scrollTop: window.innerHeight * 0.9 }, 1000);
			})
		.appendTo($tools)
		.prop("disabled", true)		 
		.wrap("<li></li>");
		
	window.addEventListener("three:render", () => {
			$btnSnap.prop("disabled", false);
	});
	
	// create the Open Image button
	$(FORM_BUTTON)
		.text("Open Image")
		.click(function(){
				$("#inputfile-image").trigger("click");
			})
		.appendTo($tools)		 
		.wrap("<li></li>");		
}


/**
 * Initialize editor tools.
 */
function initTools() {

	
	/*** Create the cursor tool and controls. ***/
	
		 	
	// instantiate the tool
	var cursor = NullTool.create();	
	
	// store the reference
	ime.addTool(cursor);
	
	// create a button
	var $btnCursor = $(TOOL_BUTTON)
		.text("Cursor")		
		.click(() => {
		
				// set the click event callback
				if (!cursor.isActive()) ime.activateTool(cursor);
				
			})
			
		// append the button to the page	
		.appendTo($tools)		 
		.wrap("<li></li>");
	
	// link the button and tool
	cursor.addEventListener("activate", () => $btnCursor.addClass("active"));
	cursor.addEventListener("deactivate", () => $btnCursor.removeClass("active"));
	
	// the cursor is activated by default
	$btnCursor.trigger("click");
	
	
	
		
	/*** Create the meter tool and controls. ***/
	
	
	// instantiate the tool
	var meter = Meter.create({ canvas:ime.getCanvas() });
	
	// store the reference
	ime.addTool(meter);
	
	// link the tool to the controller
	meter.addEventListener("change", () => ime.draw());
	
	// create a button
	var $btnMeter = $(TOOL_BUTTON)
		.text("Meter")
		.click(() => {
				
				// set the click event callback
				if (!meter.isActive()) ime.activateTool(meter);
				
			})
			
		// append the button to the page		
		.appendTo($tools)
		.wrap("<li></li>");
	
	// link the button and the tool	
	meter.addEventListener("activate", () => $btnMeter.addClass("active"));
	meter.addEventListener("deactivate", () => $btnMeter.removeClass("active"));
	
	
	
		
	/*** Create the crop tool and controls. ***/
	
	
	// instantiate the tool	
	var crop = Crop.create({ canvas:ime.getCanvas(),imageConf:ime.getimageConf() });
	
	// store the reference
	ime.addTool(crop);
	
	// link the tool and the controller	
	crop.addEventListener("change", () => ime.draw());
	crop.addEventListener("crop", () => ime.imageConfigModified());
	
	// create a button
	var $btnCrop = $(TOOL_BUTTON)
		.text("Crop")
		
		// set the id for settings collapse control
		.attr("data-target","#crop-settings")
		.click(() => {
		
				// set the click event callback
				if (!crop.isActive()) ime.activateTool(crop);
				
			})
			
		// append the button to the page		
		.appendTo($tools)
		.wrap("<li></li>");
	
	// link the button to the tool	
	crop.addEventListener("activate", () => $btnCrop.addClass("active"));
	crop.addEventListener("deactivate", () => $btnCrop.removeClass("active"));
		
	// create settings
	var $setCrop = $(TOOL_SETTINGS)
		.attr("id","crop-settings")
		.append(
				"<ul>" +
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
				"</ul>"
			)
		// append the settings to the page
		.appendTo($tools);
	
	// link the button "apply" to the tool
	$("#crop-settings-apply").click(() => crop.crop());
	
	// link the inputs to the tool
	crop.addEventListener("change", () => {
		$("#crop-settings-width").text(crop.getWidth());
		$("#crop-settings-height").text(crop.getHeight());
		$("#crop-settings-ratio").text(Math.round((crop.getWidth()/crop.getHeight())*100)/100);
	});
	
	// open the settings when the tool is activated
	//FIXME	delay of transitions causes the settings aren't opened
	//crop.addEventListener("activate", () => $setCrop.collapse("show"));
	
	// hide the settings when the tool is deactivated
	crop.addEventListener("deactivate", () => $setCrop.collapse("hide"));
	
	
			
			
	/*** Create the grid helper and controls. ***/
	
	
	// instantiate the tool	
	var grid = Grid.create({ canvas:ime.getCanvas(), rows:3, cols:3 });
	
	// store the reference
	ime.addHelper(grid);
	
	// link the tool and the controller
	grid.addEventListener("change", () => ime.draw());
	
	// create a button		
	var $btnGrid = $(HELPER_BUTTON)
		.text("Grid")
		
		// set the id for settings collapse control
		.attr("data-target","#grid-settings")
		.click(() => {
		
				// set the click event callback
				if (!grid.isActive()) {
					ime.activateHelper(grid);
				} else {
					ime.deactivateHelper(grid);
				}
				
			})
			
		// append the button to the page			
		.appendTo($tools)
		.wrap("<li></li>");
	
	// link the button to the tool
	grid.addEventListener("activate", () => $btnGrid.addClass("active"));
	grid.addEventListener("deactivate", () => $btnGrid.removeClass("active"));
	
	// create settings
	var $setGrid = $(TOOL_SETTINGS)
		.attr("id","grid-settings")
		.append(
				"<ul>" +
					"<li>" +
						"<label for=\"grid-settings-rows\">Rows:</label>" + 
						"<input type=\"number\" min=\"1\" class=\"input-sm\" id=\"grid-settings-rows\">" +
					"</li>" +
					"<li>" +
						"<label for=\"grid-settings-rows\">Cols:</label>" +
						"<input type=\"number\" min=\"1\" class=\"input-sm\" id=\"grid-settings-cols\">" +
					"</li>" +
					"<li>" +
						"<label for=\"grid-settings-color\">Color:</label>" +
						"<input type=\"color\" value=\"#000000\"  class=\"input-sm\" id=\"grid-settings-color\">" +
					"</li>" +				
				"</ul>"
			)						
		// append the settings to the page		
		.appendTo($tools);
	
	// set inputs values
	$("#grid-settings-rows").val(grid.getRows());
	$("#grid-settings-cols").val(grid.getCols());	
	
	// link the inputs to the tool
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
	
	$("#grid-settings-color").on("input", function() {
		grid.setStyle($(this).val());
	});
	
	// hide the settings when the tool is deactivated
	grid.addEventListener("deactivate", () => $setGrid.collapse("hide"));
	
	
	
	
	/*** Create restore and zoom controls. ***/
	
	
	// Restore		
	var $btnRestore = $(HELPER_BUTTON)
		.text("Restore")
		.click(() => ime.restore())
		
		// append button to the page
		.appendTo($tools)
		.wrap("<li></li>");		
	
	// Zoom In	
	var $btnZoomIn = $(HELPER_BUTTON)
		.text(" + ")
				
		// half size
		.addClass("half")
		.click(() => ime.zoomIn());
						
	// Zoom Out	
	var $btnZoomOut = $(HELPER_BUTTON)
		.text(" - ")
		
		// half size
		.addClass("half")
		.click(() => ime.zoomOut());		
	
	// wrap Zoom buttons together
	$("<li></li>")		
		.append($btnZoomIn)
		.append($btnZoomOut)
		
		// append element to the page
		.appendTo($tools);		
}


/**
 * Initialize image file opening form.
 */ 
function initOpenImageFile() {
	
	// instantiate file reader
	const reader = new FileReader();
	
	const $form = $("#ime-openfile");
	const $input = $form.find("input");
	
	// form actions
	$form
		.submit(function(e) {		
				e.preventDefault();
			})
		.change(function(e) {
				
			// disable controls on file loading
			gui.disableControls();
			
			// read file
			reader.readAsDataURL($input[0].files[0]);			
		});
	
	// on file load
	reader.onload = function(){
		var dataURL = reader.result;
		
		// validate file type
		if ($input[0].files[0].type.substring(0, 5) == "image") {	  			
			
			// pass src to editor
			ime.setImageSource(dataURL);
		} else {
			
			console.warn("Image Editor error: invalid file type");
			
			$error.text("Image Editor error: invalid file type");
			
		}
		
		// clear information about file from the form
		$form[0].reset();		
	}
	
	// on file load error
	reader.onerror = function(){
	
		console.warn("Image Editor error: can't load the file");
				
		$error.text("Image Editor error: can't load the file");
				
		// clear information about file from the form
		$form[0].reset();
	}
}


/**
 * Image editor GUI initialization.
 */
function initGUI() {
	
	// setup callbacks for enable/disable the controls
	gui.disableControls = function(){
		$tools.find("button.tool").prop("disabled", true);		
	}

	gui.enableControls = function(){
		$tools.find("button.tool").prop("disabled", false);		
	}
	
	// place canvas to page
	$canvas.appendTo("#canvas-placeholder");
	
	// enable controls when file loaded
	ime.addEventListener("imageload", () => gui.enableControls());
	
	// controls disabled by default
	gui.disableControls();
	
}




/**
 *
 * 3D VIEWER
 *
 */
 
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;

var objFile; 

function init3dviewer() {
		
		
		const THREE = window.THREE;
				
		var container;
		
		var windowHalfX;
		var windowHalfY;		
		
		var $form = $("#three-openfile");
		var $threeInputFile = $("#inputfile-three");
		var $threePlaceholder = $("#three-canvas-placeholder");
				
		// check WEBGL support
		if ( ! Detector.webgl) {
			Detector.addGetWebGLMessage( { parent: $error[0] } );
			$btn3d.prop("disabled", true);					
			return;				
		}
		
		$btn3d.prop("disabled", false);				

		var reader = new FileReader();
		
		$form				
		.submit(function(e) {
				
				e.preventDefault();
				
			})
													
		.change(function(e) {
									
			reader.onload = function(){
				
				$threePlaceholder.empty();
				
				objFile = reader.result;
				
				init();
				animate();
				
				// clear information about file from the form
				$form[0].reset();						
				
			}
			
			reader.readAsText($threeInputFile[0].files[0]);
						
		});
		
		// on file load error
		reader.onerror = function(){

			console.warn("3d viewer: can't load the file");
		
			$error.text("3d viewer: can't load the file");
		
			// clear information about file from the form
			$form[0].reset();
		}	
			
 		
	function init() {
	 	
	 		// resize view on window resize
			$(window).resize(function(){
				$threePlaceholder.height(window.innerHeight * 0.9);
			});

			$threePlaceholder.height(window.innerHeight * 0.9);
	 		
	 		container = $threePlaceholder[0];
			windowHalfX = container.left + container.offsetWidth / 2;
	 		windowHalfY = container.top + container.offsetHeight / 2;
			
			/* Camera */
		  camera = new THREE.PerspectiveCamera( 15, container.offsetWidth / container.offsetHeight, 1, 2000 );
			camera.position.z = 1000;
			camera.position.y = 100;
		
			/* Lights */
			ambient = new THREE.AmbientLight(0xffffff, 0.3);       
		
			keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 30%, 75%)'), 0.9);
		  keyLight.position.set(-200, 200, 200);

		  fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 50%, 75%)'), 0.4);
		  fillLight.position.set(400, 0, 0);

		  backLight = new THREE.DirectionalLight(0xffffff, 0.5);
		  backLight.position.set(200, 200, -200).normalize();
		    
			/* Scene */
			scene = new THREE.Scene();
		
			scene.add( ambient );
			scene.add( keyLight );
			scene.add( fillLight );
			scene.add( backLight );
			scene.add( camera );
		  
		  var manager = new THREE.LoadingManager();
			manager.onProgress = function ( item, loaded, total ) {

				console.log( item, loaded, total );

			};

			var textureLoader = new THREE.TextureLoader( manager );
			var texture = textureLoader.load( '/3dviewer/obj/marble.jpg' );
		  
		  var mat = new THREE.MeshStandardMaterial( { color: 0xf3eedd, roughness: 0.08, metalness: 0.05 } );
		  mat.map = texture;
		  
		  var object = new THREE.OBJLoader().parse( objFile );
		
						object.traverse( function ( child ) {

							if ( child instanceof THREE.Mesh ) {

								child.material = mat;

							}

						});
					
			object.position.y = -90;
			scene.add( object );
		

		  /* Renderer */

		  renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});            
		  renderer.setPixelRatio(window.devicePixelRatio);
		  renderer.setSize(container.offsetWidth, container.offsetHeight);
		  renderer.setClearColor(new THREE.Color("hsl(0, 0%, 30%)"));

		  container.appendChild(renderer.domElement);

		  /* Controls */

		  controls = new THREE.OrbitControls(camera, renderer.domElement);
		  controls.enableDamping = true;
		  controls.dampingFactor = 0.25;
		  controls.enableZoom = true;

		  /* Events */

		  window.addEventListener('resize', onWindowResize, false);
	}


	function onWindowResize() {

		  windowHalfX = container.left + container.offsetWidth / 2;
		  windowHalfY = container.top + container.offsetHeight / 2;

		  camera.aspect = container.offsetWidth / container.offsetHeight;
		  camera.updateProjectionMatrix();

		  renderer.setSize(container.offsetWidth, container.offsetHeight);

	}


	function animate() {

		  requestAnimationFrame(animate);

		  controls.update();

		  render();

	}


	function render() {

		  renderer.render(scene, camera);
		  
		  // dispatch event to enable snapshot button
		  window.dispatchEvent(new Event("three:render"));

	}
	
}



