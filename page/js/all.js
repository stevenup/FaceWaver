ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('allCtrl',function($scope,$ionicLoading,$ionicActionSheet,$ionicPopup,ec,$q,$ionicSideMenuDelegate,$interval){

	// init
		var $s=$scope;
		ecstore.scope.all=$s;
		$s.am={};
		var am=window.am=$s.am;
		
		$s.config=config;
		$s.ec={};
		$s.ec.pm=ec.pm;


		ec.pm.songlist=[
			{
				title:'Refrain',
				artist:'Anan Ryoko',
				audio_file:{
					url:'song/Anan Ryoko - Refrain_clip.mp3',
				},
			},
			{
				title:'Rage',
				artist:'B Brightz,Julian Jordan,Firebeatz ',
				audio_file:{
					url:'song/B Brightz,Julian Jordan,Firebeatz - Rage(B Brightz Remix)_clip.mp3',
				},
			},
			{
				title:'Calavera',
				artist:'Klaas',
				audio_file:{
					url:'song/Klaas - Calavera (Original Edit)_clip.mp3',
				},
			},
		]

		ec.pm.playlist=ng.copy(ec.pm.songlist);

	// fn
		$s.init=function(){
			$s.bg_wave();
		}
		$s.bg_wave=function(){


			var hash = document.location.hash.substr( 1 );
			if ( hash ) hash = parseInt( hash, 0 );

			// Texture width for simulation
			var WIDTH = hash || 128;
			var NUM_TEXELS = WIDTH * WIDTH;

			// Water size in system units
			var BOUNDS = 512;
			var BOUNDS_HALF = BOUNDS * 0.5;

			var container, stats;
			var camera, scene, renderer, controls;
			var mouseMoved = false;
			var mouseCoords = new THREE.Vector2();
			var raycaster = new THREE.Raycaster();

			var waterMesh;
			var meshRay;
			var gpuCompute;
			var heightmapVariable;
			var waterUniforms;
			var smoothShader;

			var simplex = new SimplexNoise();

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


			function change(n) {
				location.hash = n;
				location.reload();
				return false;
			}


			var options = '';
			for ( var i = 4; i < 10; i++ ) {
				var j = Math.pow( 2, i );
				options += '<a href="#" onclick="return change(' + j + ')">' + j + 'x' + j + '</a> ';
			}
			// document.getElementById('options').innerHTML = options;

			init();
			animate();

			function init() {

				camera = am.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 3000 );
				// camera.position.set( 0, 200, 350 );
				// camera.setRotationFromQuaternion(JSON.parse('{"_x":-0.03990439489501756,"_y":0,"_z":0,"_w":0.9992035024298417}'));

				scene = new THREE.Scene();
				// scene.fog = new THREE.Fog( 0, 0, 100  );

				var sun = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
				sun.position.set( 300, 400, 175 );
				scene.add( sun );

				var sun2 = new THREE.DirectionalLight( 0x40A040, 0.6 );
				sun2.position.set( -100, 350, -200 );
				scene.add( sun2 );

				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0x000000 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				// container.appendChild( renderer.domElement );
				jq('.bg_wave').append( renderer.domElement );

				// controls = new THREE.OrbitControls( camera, renderer.domElement );



				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				// document.addEventListener( 'keydown', function( event ) {

				// 	// W Pressed: Toggle wireframe
				// 	if ( event.keyCode === 87 ) {

				// 		waterMesh.material.wireframe = ! waterMesh.material.wireframe;
				// 		waterMesh.material.needsUpdate = true;

				// 	}

				// } , false );

				window.addEventListener( 'resize', onWindowResize, false );


				// var gui = new dat.GUI();

				// var effectController = {
				// 	mouseSize: 20.0,
				// 	viscosity: 0.03
				// };

				// var valuesChanger = function() {

				// 	heightmapVariable.material.uniforms.mouseSize.value = effectController.mouseSize;
				// 	heightmapVariable.material.uniforms.viscosityConstant.value = effectController.viscosity;

				// };

				// gui.add( effectController, "mouseSize", 1.0, 100.0, 1.0 ).onChange( valuesChanger );
				// gui.add( effectController, "viscosity", 0.0, 0.1, 0.001 ).onChange( valuesChanger );
				// var buttonSmooth = {
				//     smoothWater: function() {
				// 	smoothWater();
				//     }
				// };
				// gui.add( buttonSmooth, 'smoothWater' );


				initWater();

				// valuesChanger();

			}


			function initWater() {

				var materialColor = 0x0040C0;

				var geometry=am.geometry=new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH -1 );
				// var geometry1 =am.geometry1= new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, 1, 1 );
				// var geometry=am.geometry=vs.threejs.remove_same_point(geometry1);
				// var geometry=geometry1;

				// material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
				var material = new THREE.ShaderMaterial( {
					// uniforms: THREE.UniformsUtils.merge( [
					// 	THREE.ShaderLib[ 'phong' ].uniforms,
					// 	{
					// 		heightmap: { value: null },
					// 		texture:{value:new THREE.TextureLoader().load('/test/threejs/shader_point_size/spark1.png')},
					// 	}
					// ] ),
					uniforms:{
						heightmap: { value: null },
						texture:{value:new THREE.TextureLoader().load('img/spark1.png')},
					},
					vertexShader: document.getElementById( 'waterVertexShader' ).textContent,
					// fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ],
					fragmentShader: document.getElementById('fragmentshader').textContent,
					depthTest:false,
					blending:THREE.AdditiveBlending,
					transparent:true,

				} );

				// material.lights = true;

				// Material attributes from MeshPhongMaterial
				material.color = new THREE.Color( materialColor );
				material.specular = new THREE.Color( 0x111111 );
				material.shininess = 50;

				// Sets the uniforms with the material values
				// material.uniforms.diffuse.value = material.color;
				// material.uniforms.specular.value = material.specular;
				// material.uniforms.shininess.value = Math.max( material.shininess, 1e-4 );
				// material.uniforms.opacity.value = material.opacity;

				// Defines
				material.defines.WIDTH = WIDTH.toFixed( 1 );
				material.defines.BOUNDS = BOUNDS.toFixed( 1 );

				waterUniforms = material.uniforms;

				waterMesh = am.waterMesh = new THREE.Points( geometry, material );
				waterMesh.rotation.x = - Math.PI / 2;
				waterMesh.matrixAutoUpdate = false;
				waterMesh.updateMatrix();

				scene.add( waterMesh );

				// Mesh just for mouse raycasting
				var geometryRay = new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, 1, 1 );
				meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
				meshRay.rotation.x = - Math.PI / 2;
				meshRay.matrixAutoUpdate = false;
				meshRay.updateMatrix();
				scene.add( meshRay );


				// Creates the gpu computation class and sets it up

				gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

				var heightmap0 = gpuCompute.createTexture();

				fillTexture( heightmap0 );

				heightmapVariable = gpuCompute.addVariable( "heightmap", document.getElementById( 'heightmapFragmentShader' ).textContent, heightmap0 );

				gpuCompute.setVariableDependencies( heightmapVariable, [ heightmapVariable ] );

				heightmapVariable.material.uniforms.mousePos = { value: new THREE.Vector2( 10000, 10000 ) };
				heightmapVariable.material.uniforms.mouseSize = { value: 70.0 };
				heightmapVariable.material.uniforms.viscosityConstant = { value: 0.03 };
				heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed( 1 );

				var error = gpuCompute.init();
				if ( error !== null ) {
				    console.error( error );
				}

				// Create compute shader to smooth the water surface and velocity
				smoothShader = gpuCompute.createShaderMaterial( document.getElementById( 'smoothFragmentShader' ).textContent, { texture: { value: null } } );

			}

			function fillTexture( texture ) {

				var waterMaxHeight = 10;

				function noise( x, y, z ) {
					var multR = waterMaxHeight;
					var mult = 0.025;
					var r = 0;
					for ( var i = 0; i < 15; i++ ) {
						r += multR * simplex.noise( x * mult, y * mult );
						multR *= 0.53 + 0.025 * i;
						mult *= 1.25;
					}
					return r;
				}

				var pixels = texture.image.data;

				var p = 0;
				for ( var j = 0; j < WIDTH; j++ ) {
					for ( var i = 0; i < WIDTH; i++ ) {

						var x = i * 128 / WIDTH;
						var y = j * 128 / WIDTH;

					        pixels[ p + 0 ] = noise( x, y, 123.4 );
						pixels[ p + 1 ] = 0;
						pixels[ p + 2 ] = 0;
						pixels[ p + 3 ] = 1;

						p += 4;
					}
				}

			}

			function smoothWater() {

				var currentRenderTarget = gpuCompute.getCurrentRenderTarget( heightmapVariable );
				var alternateRenderTarget = gpuCompute.getAlternateRenderTarget( heightmapVariable );

				for ( var i = 0; i < 10; i++ ) {

					smoothShader.uniforms.texture.value = currentRenderTarget.texture;
					gpuCompute.doRenderTarget( smoothShader, alternateRenderTarget );

					smoothShader.uniforms.texture.value = alternateRenderTarget.texture;
					gpuCompute.doRenderTarget( smoothShader, currentRenderTarget );

				}
				
			}


			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function setMouseCoords( x, y ) {

				mouseCoords.set( ( x / renderer.domElement.clientWidth ) * 2 - 1, - ( y / renderer.domElement.clientHeight ) * 2 + 1 );
				mouseMoved = true;

			}

			function onDocumentMouseMove( event ) {

				setMouseCoords( event.clientX, event.clientY );

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );


				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );


				}

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				// stats.update();

			}

			am.is_first_render=true;

			am.random_push_count=0;
			$interval(function(){ // random water push
				am.random_push_x=Math.random()*512-256;
				am.ramdom_push_z=Math.random()*11.2e-14-5.6e-14;

				am.random_push_count=8;

			},1000)

			function render() {

				// Set uniforms: mouse interaction
				var uniforms = heightmapVariable.material.uniforms;

				var mouse_push=false;
				if ( mouseMoved ) {

					raycaster.setFromCamera( mouseCoords, camera );

					var intersects = raycaster.intersectObject( meshRay );

					if ( intersects.length > 0 ) {
					    var point = intersects[ 0 ].point;
					    uniforms.mousePos.value.set( point.x, point.z );
					    mouse_push=true;
					}
					else {
					    uniforms.mousePos.value.set( 10000, 10000 );
					}

					mouseMoved = false;
				}
				else {
					uniforms.mousePos.value.set( 10000, 10000 );
				}

				if(!mouse_push&&am.random_push_count>0){
				    uniforms.mousePos.value.set( am.random_push_x, am.ramdom_push_z );
				}
				if(am.random_push_count>0){
					am.random_push_count--;
				}

				// Do the gpu computation
				gpuCompute.compute();

				// Get compute output in custom uniform
				waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget( heightmapVariable ).texture;

				// Render
				renderer.render( scene, camera );

				if(am.is_first_render){
					camera.position.set( 0, 40, 280 );
					camera.lookAt(new THREE.Vector3(0,60,0));
					am.is_first_render=false;
				}

				var gamma_radius=-am.gamma*Math.PI/180;
				camera.rotation.z+=(gamma_radius-camera.rotation.z)/100;
				// console.log(am.gamma);

			}
		}
		$s.is_new_message=function(){
			return localStorage.nzapp_is_new_message;
		}
		$s.toggle_left_side_menu=function() {
			$ionicSideMenuDelegate.toggleLeft();
		};
		$s.check_left_side_menu_open=function(){
			if($ionicSideMenuDelegate.isOpenLeft()){
				return true;
			}
			else{
				return false;
			}
		}
		$s.set_song_act=function(song){
			localStorage.facewaver_song_act=ng.toJson(song);
		}
		$s.get_song_act=function(){
			if(!localStorage.facewaver_song_act){
				location='#/tab/home';
				return;
			}
			return ng.fromJson(localStorage.facewaver_song_act);
		}
		$s.set_photo_url=function(photo_url){
			localStorage.facewaver_photo_url=photo_url;
		}
		$s.get_photo_url=function(){
			if(!localStorage.facewaver_photo_url){
				location='#/tab/home';
				return;
			}
			return localStorage.facewaver_photo_url;
		}

	// init
		$s.init();

})