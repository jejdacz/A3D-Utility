/*!
 * WebGL 3D Model Viewer Using three.js (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js)
 * Copyright (c) 2016 Manuel Wieser
 * Licensed under MIT (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js/blob/master/LICENSE)
 */

// Customize 3D model and material filenames at line 69 and 79.
						
		if (!Detector.webgl) {
    	Detector.addGetWebGLMessage();
    	$("#three-canvas-placeholder").text("WebGL 3D library is not supported by your system.");
    }

    
    const THREE_OPENFILE = "#three-openfile";
    const THREE_INPUTFILE = "#inputfile-three";    
    
    var container;
    
    var objectFileName;
    var materialFileName;
    
    var basePath = "/3dviewer/assets/";

    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;

    var windowHalfX;
    var windowHalfY;
    
    var mtlLoader = new THREE.MTLLoader();
    var objLoader = new THREE.OBJLoader();

    
    function init3dviewer() {			
				
			$(THREE_OPENFILE)
						
				.submit(function(e) {
						
						e.preventDefault();
						
					})										
				.change(function(e) {
					
					var fileList = $(THREE_INPUTFILE)[0].files;
					
					for ( var i = 0; i < fileList.length; i++ ) {
					
						var fileName = fileList[i].name;
						var extension = fileName.split('.').pop().toLowerCase();
						
						switch (extension) {
							
							case "obj":
								objectFileName = fileName;
								break;
								
							case "mtl":
								materialFileName = fileName;
								break;
						}
					
					}
					
					loadModel();
					//init();
  				animate();
								
				});
					
    	
    	// resize view on window resize
    	$(window).resize(function(){
				$("#three-canvas-placeholder").height(window.innerHeight * 0.9);
			});
	
			$("#three-canvas-placeholder").height(window.innerHeight * 0.9);
    	
			container = document.getElementById("three-canvas-placeholder");
			windowHalfX = container.left + container.offsetWidth / 2;
   		windowHalfY = container.top + container.offsetHeight / 2;
			
			init();
  		//animate();
  
		}

    function init() {

        /* Camera */

        camera = new THREE.PerspectiveCamera(15, container.offsetWidth / container.offsetHeight, 1, 1000);
        camera.position.z = 10;

        /* Scene */

        scene = new THREE.Scene();
        lighting = false;

        ambient = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambient);

        keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
        keyLight.position.set(-100, 0, 100);

        fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
        fillLight.position.set(100, 0, 100);

        backLight = new THREE.DirectionalLight(0xffffff, 1.0);
        backLight.position.set(100, 0, -100).normalize();

        if (objectFileName && materialFileName) loadModel();

        /* Renderer */

        renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});            
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

        container.appendChild(renderer.domElement);

        /* Controls */

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        /* Events */

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', onKeyboardEvent, false);

    }
    
    function loadModel() {
    		
    		/* Model */

        //var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl(basePath);            
        mtlLoader.setPath(basePath);
        mtlLoader.load(materialFileName, function (materials) {

            materials.preload();

            materials.materials.default.map.magFilter = THREE.NearestFilter;
            materials.materials.default.map.minFilter = THREE.LinearFilter;

            //var objLoader = new THREE.OBJLoader();            
            objLoader.setMaterials(materials);
            objLoader.setPath(basePath);                
            objLoader.load(objectFileName, function (object) {
            

                scene.add(object);

            });

        });		
    		
    }

    function onWindowResize() {

        windowHalfX = container.left + container.offsetWidth / 2;
        windowHalfY = container.top + container.offsetHeight / 2;

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.offsetWidth, container.offsetHeight);

    }

    function onKeyboardEvent(e) {

        if (e.code === 'KeyL') {

            lighting = !lighting;

            if (lighting) {

                ambient.intensity = 0.25;
                scene.add(keyLight);
                scene.add(fillLight);
                scene.add(backLight);

            } else {

                ambient.intensity = 1.0;
                scene.remove(keyLight);
                scene.remove(fillLight);
                scene.remove(backLight);

            }

        }

    }

    function animate() {

        requestAnimationFrame(animate);

        controls.update();

        render();

    }

    function render() {

        renderer.render(scene, camera);

    }
        

