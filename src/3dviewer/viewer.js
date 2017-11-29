/* Modified version of:
 *
 * WebGL 3D Model Viewer Using three.js (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js)
 * Copyright (c) 2016 Manuel Wieser
 * Licensed under MIT (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js/blob/master/LICENSE)
 */						
		    
    const THREE_OPENFILE = "#three-openfile";
    const THREE_INPUTFILE = "#inputfile-three";
    const THREE_PLACEHOLDER = "#three-canvas-placeholder";     
    
    var container;
    
    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;

    var windowHalfX;
    var windowHalfY;
    
    var objFile;
     

    function init3dviewer() {
    
    		if (!Detector.webgl) {
					Detector.addGetWebGLMessage();
					$(THREE_PLACEHOLDER).text("WebGL 3D library is not supported by your system.");
				}			
				
				// resize view on window resize
				$(window).resize(function(){
					$(THREE_PLACEHOLDER).height(window.innerHeight * 0.9);
				});

				$(THREE_PLACEHOLDER).height(window.innerHeight * 0.9);
				
    
    		var reader = new FileReader();
    		
    		$(THREE_OPENFILE)
						
				.submit(function(e) {
						
						e.preventDefault();
						
					})
															
				.change(function(e) {
											
					reader.onload = function(){
						
						$(THREE_PLACEHOLDER).empty();
						
						objFile = reader.result;
						
						init();
						animate();
						
						$(THREE_OPENFILE)[0].reset();						
						
					}
					
					reader.readAsText($(THREE_INPUTFILE)[0].files[0]);
								
				});
				
				container = $(THREE_PLACEHOLDER)[0];
				windowHalfX = container.left + container.offsetWidth / 2;
		 		windowHalfY = container.top + container.offsetHeight / 2;
    		
		 }
		 		
		 	function init() {

        camera = new THREE.PerspectiveCamera( 15, container.offsetWidth / container.offsetHeight, 1, 2000 );
				camera.position.z = 1000;
				camera.position.y = 100;
				
				
				ambient = new THREE.AmbientLight(0xffffff, 0.4);        
				
				keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 30%, 75%)'), 0.9);
        keyLight.position.set(-500, 100, 100);

        fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 50%, 75%)'), 0.45);
        fillLight.position.set(500, 0, 100);

        backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(500, 100, -500).normalize();
        
        
        //keyLight.castShadow = true;
				//keyLight.shadow.mapSize.width = 2048;
				//keyLight.shadow.mapSize.height = 2048;
        

				scene = new THREE.Scene();
				
				scene.add( ambient );
				scene.add( keyLight );
				scene.add( fillLight );
				scene.add( backLight );
				
				//scene.add( hemiLight );
				//scene.add( dirLight );					
				scene.add( camera );
						

        
        var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var textureLoader = new THREE.TextureLoader( manager );
				var texture = textureLoader.load( '/3dviewer/obj/marble.jpg' );
    		
    		var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
    		
    		var onError = function ( xhr ) {
				};

        //var mat = new THREE.MeshLambertMaterial( { color: 0xbbaaaa, overdraw: 0.9 } );
        var mat = new THREE.MeshStandardMaterial( { color: 0xf3eedd, roughness: 0.08, metalness: 0.05 } );
        //mat.map = texture;
        
        var object = new THREE.OBJLoader().parse( objFile );
				
							object.traverse( function ( child ) {

								if ( child instanceof THREE.Mesh ) {

									child.material = mat;									
									//child.recieveShadow = true;
									
									child.material.map = texture;

								}
								
												
							scene.add( object );

						}, onProgress, onError );

				
				/*
				
				var loader = new THREE.OBJLoader( manager );
				loader.load( '/3dviewer/obj/male02.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material = mat;

						}

					} );

					object.position.y = - 95;
					scene.add( object );

				}, onProgress, onError );*/
				

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

                ambient.intensity = 0.4;
                //scene.add(keyLight);
                //scene.add(fillLight);
                //scene.add(backLight);

            } else {

                ambient.intensity = 1.0;
                //scene.remove(keyLight);
                //scene.remove(fillLight);
                //scene.remove(backLight);

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
        

