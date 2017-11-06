/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

$(function(){

   	var imeControls = document.getElementById("imeControls");
   	
   	var canvas2d = document.getElementById("canvas2d");

   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
	
	/*** IME INIT ***/
		
	var ime = new ImageEditor(canvas2d);
	
	/* move to factory method later? */
	var m = new Meter(ime);
	ime._tools.set('meter', m);
	var tb = new ToggleButton(() => ime.selectTool('meter'), () => ime.selectTool(null));
	
	$("#meter").click(function () {
		tb.click();
		$(this).toggleClass('active');
	});
	
	// enable controls IME callback
	ime.enableControls = function(){
		console.log('controls.enabled');
		$("#meter, #test2").prop('disabled', false);		
	}
	
	// disable controls IME callback
	ime.disableControls = function(){
		console.log('controls disabled');
		$("#meter, #test2").prop('disabled', true);
	}
	
	
	// TODO factory helper class for buttons and controls
	// build (configure) tools helpers and controls outside IME
	// editorInitFunction
	/*
		var m = new Meter(ime);
		
		VER1:
		var mtb = new ToggleButton(m.enable, m.disable);
		
		$("#button").click(function () {
		var r = mtb.click();
		if (r) add style-class on else off				
		});
		
		********************
		
		VER2:
		var mtb = new ToggleButton(m.enable, m.disable); //configure element inside
		$("#controlsForm fieldset div.form-group").append(mtb.toHTML());
		// user can specify additional CSS ... like bootstrap classes
		// <button class=\"on\" type=\"button\">meter</button>
		
		$('.btn').click(function() {
    		$(this).toggleClass('active');
		});
		
		*****************
		user specifies controls on its own ... for similar problems can use factory methods
		
				
		ime.addTool('meter', m);
		ime.addControl('meterButton', mtb);
	*/
	/*	
	$("#test").click(function () {tb.click();});
	
	var b = $().add('<button class=\"form-control\" type=\"button\">meter</button>').click(ime._tools.get('meter').disable);
	
	$("#controlsForm fieldset div.form-group").append(b);*/	
				
	fileForm.onsubmit = function(e) {e.preventDefault();}
	
	// on file select				
	fileInput.onchange = function(e) {
			
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
