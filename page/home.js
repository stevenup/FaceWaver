ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('home_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.home_ctrl=$s;
		$s.m={};
		var m=$s.m;

		// m.is_loaded=true;

		m.loading_progress=.0;

		// $interval(function(){
		// 	if(m.loading_progress>1.0){
		// 		m.loading_progress=0.0;
		// 	}
		// 	else{
		// 		m.loading_progress+=0.01;
		// 	}
		// 	// console.log(m.loading_progress);
		// },10)

		m.anim_head_num=44;
		m.anim_head_index=0;
		m.anim_head_interval;

		m.anim_band_num=44;
		m.anim_band_index=0;
		m.anim_band_interval;

		m.anim_logo_num=34;
		m.anim_logo_index=0;
		m.anim_logo_interval;


		m.total_pic_count=m.anim_head_num+m.anim_band_num+m.anim_logo_num;
		m.loaded_pic_count=0;

	// $on
        $s.$on('$destroy', function() {
          $s.anim_head_stop();
          $s.anim_band_stop();
          $s.anim_logo_stop();
        });

    // event
		window.addEventListener('deviceorientation', handleOrientation);
		function handleOrientation(event) {
			$s.$apply(function(){

				if(!m.alpha_init){
					m.alpha_init=event.alpha;
					m.beta_init=event.beta;
					m.gamma_init=event.gamma;
				}

				m.alpha=event.alpha;
				m.beta=event.beta;
				m.gamma=event.gamma;

				m.alpha_result=event.alpha;
				m.beta_result=event.beta-m.beta_init;
				m.gamma_result=event.gamma-m.gamma_init;
			})
		}
	// fn
		$s.init=function(){

			// if(localStorage.facewaver_wx_code){
			// 	ec.api.do({method:'/users',
			// 		code:localStorage.facewaver_wx_code,
			// 	})
			// }
			$s.bg_wave();
			$s.anim_head_start();
			$s.anim_band_start();
			$s.anim_logo_start();
			$s.load_imgs();
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

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.set( 0, 200, 350 );

				scene = new THREE.Scene();

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
				jq('.page_home .bg_wave').append( renderer.domElement );

				// controls = new THREE.OrbitControls( camera, renderer.domElement );



				// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				// document.addEventListener( 'touchmove', onDocumentTouchMove, false );

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

				var geometry = new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH -1 );

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
						texture:{value:new THREE.TextureLoader().load('/test/threejs/shader_point_size/spark1.png')},
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

				waterMesh = new THREE.Points( geometry, material );
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
				heightmapVariable.material.uniforms.mouseSize = { value: 20.0 };
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

			function render() {

				// Set uniforms: mouse interaction
				var uniforms = heightmapVariable.material.uniforms;
				if ( mouseMoved ) {

					this.raycaster.setFromCamera( mouseCoords, camera );

					var intersects = this.raycaster.intersectObject( meshRay );

					if ( intersects.length > 0 ) {
					    var point = intersects[ 0 ].point;
					    uniforms.mousePos.value.set( point.x, point.z );

					}
					else {
					    uniforms.mousePos.value.set( 10000, 10000 );
					}

					mouseMoved = false;
				}
				else {
					uniforms.mousePos.value.set( 10000, 10000 );
				}

				// Do the gpu computation
				gpuCompute.compute();

				// Get compute output in custom uniform
				waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget( heightmapVariable ).texture;

				// Render
				renderer.render( scene, camera );

			}
		}
		$s.load_imgs=function(){

			for(let i=0;i<m.anim_head_num;i++){
				var img=jq('<img src="img/anim_head/head_'+$s.pad2(i)+'.png"/>');

				jq(img)
				.on('load',function(){
					m.loaded_pic_count++;
					m.loading_progress=m.loaded_pic_count/m.total_pic_count;
					if(m.loaded_pic_count == m.total_pic_count){
						m.is_loaded=true;
						setTimeout(function() {
							$s.set_transition();
						}, 0);
					}
					$s.$apply();
				})
				.each(function() {
				  if(this.complete) jq(this).trigger('load');
				});
			}
			for(let i=0;i<m.anim_band_num;i++){
				var img=jq('<img src="img/anim_band/飘带_'+$s.pad2(i)+'.png"/>');

				jq(img)
				.on('load',function(){
					m.loaded_pic_count++;
					m.loading_progress=m.loaded_pic_count/m.total_pic_count;
					if(m.loaded_pic_count == m.total_pic_count){
						m.is_loaded=true;
						setTimeout(function() {
							$s.set_transition();
						}, 0);
					}
					$s.$apply();
				})
				.each(function() {
				  if(this.complete) jq(this).trigger('load');
				});
			}
			for(let i=0;i<m.anim_logo_num;i++){
				var img=jq('<img src="img/anim_logo/标题_'+$s.pad2(i)+'.png"/>');

				jq(img)
				.on('load',function(){
					m.loaded_pic_count++;
					m.loading_progress=m.loaded_pic_count/m.total_pic_count;
					if(m.loaded_pic_count == m.total_pic_count){
						m.is_loaded=true;
						setTimeout(function() {
							$s.set_transition();
						}, 0);
					}
					$s.$apply();
				})
				.each(function() {
				  if(this.complete) jq(this).trigger('load');
				});
			}
		}
		$s.reset_gyro=function(){
			$s.remove_transition();
			m.alpha_init=undefined;
			m.beta_init=undefined;
			m.gamma_init=undefined;
			$s.set_transition();
		}
		$s.pad2=function(int){
			var str='0'+int;
			return str.slice(-2);
		}
		$s.set_transition=function(){
			// jq('.anim_head').css('transition','transform .3s');
			// jq('.anim_band').css('transition','transform .3s');
			// jq('.anim_logo').css('transition','transform .3s');
		}
		$s.remove_transition=function(){
			// jq('anim_head').css('transition','');
			// jq('anim_band').css('transition','');
			// jq('anim_logo').css('transition','');
		}

		$s.anim_head_start=function(){
			m.anim_head_interval=$interval(function(){
				m.anim_head_index++;
				if(m.anim_head_index>m.anim_head_num-1){
					m.anim_head_index=0;
				}
			},66.6)
		}
		$s.anim_head_stop=function(){
			if(ng.isDefined(m.anim_head_interval)){
				$interval.cancel(m.anim_head_interval);
				m.anim_head_interval=undefined;
			}
		}

		$s.anim_band_start=function(){
			m.anim_band_interval=$interval(function(){
				m.anim_band_index++;
				if(m.anim_band_index>m.anim_band_num-1){
					m.anim_band_index=0;
				}
			},66.6)
		}
		$s.anim_band_stop=function(){
			if(ng.isDefined(m.anim_band_interval)){
				$interval.cancel(m.anim_band_interval);
				m.anim_band_interval=undefined;
			}
		}

		$s.anim_logo_start=function(){
			m.anim_logo_interval=$interval(function(){
				m.anim_logo_index++;
				if(m.anim_logo_index>m.anim_logo_num-1){
					m.anim_logo_index=0;
				}
			},66.6)
		}
		$s.anim_logo_stop=function(){
			if(ng.isDefined(m.anim_logo_interval)){
				$interval.cancel(m.anim_logo_interval);
				m.anim_logo_interval=undefined;
			}
		}

	// init
		$s.init();

	
})