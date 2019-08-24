ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('all_ctrl',function($scope,$ionicLoading,$ionicActionSheet,$ionicPopup,ec,$q,$ionicSideMenuDelegate,$interval){

	// init
		var $s=$scope;
		ecstore.scope.all_ctrl=$s;

		$s.am={};
		var am=window.am=$s.am;

		am.gyro={};



		$s.fw={};
		var fw=window.fw=$s.fw;



		$s.audio={};
		var audio=window.audio=$s.audio;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audio.context = new AudioContext();
		audio.analyser=audio.context.createAnalyser();


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


    // event
		window.addEventListener('deviceorientation', handleOrientation);
		function handleOrientation(event) {
			$s.$apply(function(){

				if(!am.gyro.alpha_init){
					am.gyro.alpha_init=event.alpha;
					am.gyro.beta_init=event.beta;
					am.gyro.gamma_init=event.gamma;
				}

				am.gyro.alpha=event.alpha;
				am.gyro.beta=event.beta;
				am.gyro.gamma=event.gamma;

				am.gyro.alpha_result=event.alpha;
				am.gyro.beta_result=event.beta-am.gyro.beta_init;
				am.gyro.gamma_result=event.gamma-am.gyro.gamma_init;
			})
		}
	// fn
		$s.init=function(){
			am.gyro.alpha=0;
			am.gyro.beta=0;
			am.gyro.gamma=0;
			$s.bg_wave();
			jq('body').show();
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

				camera = am.camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 3000 );
				// camera.position.set( 0, 200, 350 );
				// camera.setRotationFromQuaternion(JSON.parse('{"_x":-0.03990439489501756,"_y":0,"_z":0,"_w":0.9992035024298417}'));

				scene = am.scene = new THREE.Scene();
				// scene.fog = new THREE.Fog( 0, 0, 100  );

				// var sun = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
				// sun.position.set( 300, 400, 175 );
				// scene.add( sun );

				// var sun2 = new THREE.DirectionalLight( 0x40A040, 0.6 );
				// sun2.position.set( -100, 350, -200 );
				// scene.add( sun2 );

				renderer = am.renderer = new THREE.WebGLRenderer({
					alpha:true, 
					// antialias:true,
				});
				renderer.setClearColor( 0x000000 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				// container.appendChild( renderer.domElement );
				jq('.bg_wave').append( renderer.domElement );



				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				window.addEventListener( 'resize', onWindowResize, false );


				initWater();

				// valuesChanger();

				// am.stats=new Stats();
				// jq('body').append(am.stats.dom);
				// jq(am.stats.dom).addClass('stats');

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
					depthWrite:false,
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
				waterMesh.renderOrder=999;

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
				heightmapVariable.material.uniforms.mouseSize = { value: 50.0 };
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
				// am.stats.update();

			}

			am.is_first_render=true;

			am.random_push_count=0;
			$interval(function(){ // random water push
				am.random_push_x=Math.random()*512-256;
				am.ramdom_push_z=Math.random()*11.2e-14-5.6e-14;

				am.random_push_count=6;

			},800)

			function render() {

				if(am.is_first_render){
					// camera.position.set( 0, 40, 280 );
					camera.position.set( 0, 30, 320 );
					camera.lookAt(new THREE.Vector3(0,60,0));

					// controls = new THREE.OrbitControls( camera, renderer.domElement );
					// jq('ion-side-menus').css('point-events','all');

					am.is_first_render=false;
				}

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

				if(fw.on){
					fw.is_frame_count_trigger=false;
					if(fw.frame_count%5==0){
						fw.frame_count=0;
						fw.is_frame_count_trigger=true;
					}
					fw.frame_count++;

					if(fw.is_playing && audio.bufferLength&&audio.dataArray.length>0){


						audio.analyser.getByteTimeDomainData(audio.dataArray);
						var col_datas=[];
						for(var i=0,leni=audio.dataArray.length;i<leni;i++){
							col_datas.push(audio.dataArray[i]);
						}


						var span_x=fw.min_max_x.span/audio.bufferLength+0.000001;
						var span_y=fw.min_max_y.span/audio.bufferLength+0.000001;

						for(var i=0,leni=fw.result_head.children.length;i<leni;i++){
							if(fw.result_head.children[i].is_head_mesh){
								var mesh=fw.result_head.children[i];

								var position_x=mesh.position.x;
								var position_y=mesh.position.y;

								for(var j=0,lenj=audio.bufferLength;j<lenj;j++){
									if(position_x>=fw.min_max_x.min + j*span_x&&position_x< fw.min_max_x.min + (j+1)*span_x){
										var ratio_x=audio.dataArray[j]/255;
										mesh.$ratio_x=ratio_x;
									}
								}
								
								for(var j=0,lenj=audio.bufferLength;j<lenj;j++){
									if(position_y>=fw.min_max_y.min + j*span_y&&position_y< fw.min_max_y.min + (j+1)*span_y){
										var ratio_y=audio.dataArray[j]/255;
										mesh.$ratio_y=ratio_y;
									}
								}


								if(fw.is_frame_count_trigger){
									var big_scale_ratio=.1;
									var is_big_scale=Math.random()<big_scale_ratio;
									if(is_big_scale){
										mesh.extrude_ratio=.5+Math.random()*2+.000001;
									}
									else{
										mesh.extrude_ratio=1;
									}
								}

								var scale=.000001+(mesh.$ratio_x+mesh.$ratio_y);
								//
								var scale_x=scale/0.8;
								var scale_y=scale/0.8;
								var scale_z=scale*6*mesh.extrude_ratio;
								//
								mesh.scale.set(
									scale_x,
									scale_z, // if cylinder this is z because rotate
									scale_y // if cylinder this is y because rotate
								);

							}
						}

					}
				}
				else{
					var gamma_radius=-am.gyro.gamma*Math.PI/180;
					camera.rotation.z+=(gamma_radius-camera.rotation.z)/100;
					// console.log(am.gyro.gamma);
				}

			}
		}
		$s.reset_gyro=function(){
			am.gyro.alpha_init=undefined;
			am.gyro.beta_init=undefined;
			am.gyro.gamma_init=undefined;
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
		$s.load_obj=function(obj_name){
			var deferred=$q.defer();
			var loader = new THREE.OBJLoader();
			loader.load(obj_name,function(object){
				deferred.resolve({object:object});
			},function(){
				// onprogress
			},function(){
				deferred.reject();
			})

			return deferred.promise;
		}
		$s.load_sound=function(url){
			var deferred=$q.defer();
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			request.onload = function() {
				audio.context.decodeAudioData(request.response, function(buffer) {
					deferred.resolve({buffer:buffer});
				}, function(){
					deferred.reject();
				});
			}
			request.send();

			return deferred.promise;
		}
		$s.load_image=function(url){
			var deferred=$q.defer();
			var loader = new THREE.ImageLoader();
			loader.load(url,function(image){
				deferred.resolve({image:image});
			},function(){
				// onprogress
			},function(){
				deferred.reject();
			})

			return deferred.promise;
		}

	// init
		$s.init();

})