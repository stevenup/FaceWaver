ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('facewaver_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.facewaver_ctrl=$s;
		$s.m={};
		var m=$s.m;

		m.is_stop=false;

		$ionicLoading.show();

	// facewaver


		$s.$on('$ionicView.beforeLeave',function(){
			clearInterval(audio.interval);
			m.is_stop=true;
			cancelAnimationFrame(m.requestAnimationFrame_id);
			audio.context.close();
		})

		m.window_ratio=window.innerWidth/window.innerHeight;
		m.scale_xy=1;
		var camera;

		var audio={};
		audio.sound_buffer = null;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audio.context = new AudioContext();
		audio.source;
		audio.analyser=audio.context.createAnalyser();
		audio.distortion = audio.context.createWaveShaper();

		audio.loadSound=function (url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			request.onload = function() {
				audio.context.decodeAudioData(request.response, function(buffer) {
					audio.sound_buffer = buffer;
					audio.playSound(buffer);
					// animate();
				}, audio.onError);
			}
			request.send();
		} 

		audio.onError=function (e){
			console.log(e);
		}

		// audio.loadSound('song/Anan Ryoko - Refrain.mp3');
		// audio.loadSound('song/Ralvero,Karim Mika - Mad (Original Mix).mp3');
		// audio.loadSound('song/B Brightz,Julian Jordan,Firebeatz - Rage(B Brightz Remix).mp3');
		// audio.loadSound('song/Klaas - Calavera (Original Edit)_clip.mp3');
		// audio.loadSound('http://m2.music.126.net/hmZoNQaqzZALvVp0rE7faA==/0.mp3');
		// audio.loadSound('http://m2.music.126.net/2HLi_KTxW7zpdNVigoorCg==/7959364674897599.mp3');
		// audio.loadSound('http://101.227.176.68/m10.music.126.net/20170714153615/14030c809a28349b819ad1ebd0cb1874/ymusic/76af/e78f/3003/52e3a85ff7e6061b0597c041082fdfc5.mp3?wshc_tag=0&wsts_tag=59686e94&wsid_tag=b4a8078a&wsiphost=ipdbm');
		audio.loadSound($s.get_song_act().url);

		audio.playSound=function (buffer) {
			audio.source = audio.context.createBufferSource(); // creates a sound source
			audio.source.buffer = buffer;                    // tell the source which sound to play
			audio.source.connect(audio.analyser);
			audio.analyser.connect(audio.distortion);
			audio.distortion.connect(audio.context.destination);       // connect the source to the context's destination (the speakers)

			audio.analyser.fftSize = 256;
			audio.bufferLength = audio.analyser.frequencyBinCount;
			// console.log(bufferLength);
			audio.dataArray = new Uint8Array(audio.bufferLength);



		}

		audio.interval=setInterval(function(){
			if(audio.source){
				// jq('.loading').hide();
				$ionicLoading.hide();
				jq('.play').show();
				clearInterval(audio.interval);
			}
		},300)

		$s.play=function (){
			audio.source.start(0);
			m.is_playing=true;
			jq('.play').hide();
		}

		var canvas2d=document.createElement('canvas');
		canvas2d.width=window.innerWidth;
		canvas2d.height=window.innerHeight;
		var context2d=canvas2d.getContext('2d');

		var renderer, scene, camera, stats;

		var particles, uniforms ,geometry,buffer_geometry, mesh;
		var sphere_geometry,sphere_mesh,sphere_material;

		var PARTICLE_SIZE = 20;

		var raycaster, intersects;
		var mouse, INTERSECTED;

		var loader = new THREE.OBJLoader(  );
		// loader.load( 'model/head_3.obj', function ( object ) {
		loader.load( 'model/head_4_long_face.obj', function ( object ) {
			buffer_geometry=object.children[0].geometry;
			geometry = new THREE.Geometry().fromBufferGeometry( buffer_geometry );

			var loader = new THREE.ImageLoader(  );
			loader.load( $s.get_photo_url(), function ( image ) {

				m.texture = new THREE.Texture();
				m.texture.image = image;
				m.texture.needsUpdate = true;

				init();
				renderer.render(scene,camera);

				// for(var i=0,len=scene.children.length;i<len;i++){
				// 	var mesh=scene.children[i];
				// 	if(mesh.type=='Mesh'){
				// 		var scale_xy=Math.random();
				// 		mesh.scale.set(scale_xy,scale_xy,1);
				// 	}
				// }

				m.get_min_max_x=function(){
					m.xs=[];
					var min=0;
					var max=0;
					for(var i=0;i<scene.children.length;i++){
						var mesh=scene.children[i];
						if(mesh.type=='Mesh'){
							// scene.children[i].scale.set(1,1,Math.random()*5);
							// console.log(scene.children[i].position);
							if(mesh.position.x<min){
								min=mesh.position.x;
							}
							if(mesh.position.x>max){
								max=mesh.position.x;
							}
						}
					}
					var span=max-min;
					return {
						min:min,
						max:max,
						span:span,
					}
				}
				m.min_max_x=m.get_min_max_x();

				m.get_min_max_y=function(){
					m.ys=[];
					var min=0;
					var max=0;
					for(var i=0;i<scene.children.length;i++){
						var mesh=scene.children[i];
						if(mesh.type=='Mesh'){
							// scene.children[i].scale.set(1,1,Math.random()*5);
							// console.log(scene.children[i].position);
							if(mesh.position.y<min){
								min=mesh.position.y;
							}
							if(mesh.position.y>max){
								max=mesh.position.y;
							}
						}
					}
					var span=max-min;
					return {
						min:min,
						max:max,
						span:span,
					}
				}
				m.min_max_y=m.get_min_max_y();


					particles.geometry.attributes.position.array_initial=jq.merge([],particles.geometry.attributes.position.array);
				// particles.geometry.attributes.position.array_max=[];					
				// particles.geometry.attributes.position.array_direction=[];					

				// var len=particles.geometry.attributes.size.array.length;
				// for(var i=0;i<len;i++){
				// 	particles.geometry.attributes.position.array_max[i*3+2]=particles.geometry.attributes.position.array_initial[i*3+2]+Math.random()*10;
				// 	particles.geometry.attributes.position.array_direction[i*3+2]='out';
				// }					

				// var len3=particles.geometry.attributes.position.array.length;
				// for(var i=0;i<len3;i++){
				// }

					m.get_min_max_x=function(){
						var min=0;
						var max=0;
						for(var i=0;i<particles.geometry.attributes.size.array.length;i++){
							var x=particles.geometry.attributes.position.array_initial[i*3];
							if(x<min){
								min=x;
							}
							if(x>max){
								max=x;
							}
						}
						var span=max-min;
						return {
							min:min,
							max:max,
							span:span,
						}
					}
					m.min_max_x=m.get_min_max_x();
					
					m.get_min_max_y=function(){
						var min=0;
						var max=0;
						for(var i=0;i<particles.geometry.attributes.size.array.length;i++){
							var y=particles.geometry.attributes.position.array_initial[i*3+1];
							if(y<min){
								min=y;
							}
							if(y>max){
								max=y;
							}
						}
						var span=max-min;
						return {
							min:min,
							max:max,
							span:span,
						}
					}
					m.min_max_y=m.get_min_max_y();

					animate();

			});

		});


		function init() {

			var vertices_length=buffer_geometry.attributes.position.count;

			var container = document.getElementById( 'container' );

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.set(0,0,150);

			orth_camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000 );
			orth_camera.position.z = 100;

			// scene.add( new THREE.AmbientLight( 0x888888 ) );

			// var light = new THREE.PointLight( 'rgb(128,128,128)' );
			// light.position.set(-100,300,800);
			// scene.add( light );

			// var sphere_geometry = new THREE.SphereGeometry(10);
			// var sphere_material = new THREE.MeshBasicMaterial({color:'red'});
			// var sphere_mesh = new THREE.Mesh( sphere_geometry , sphere_material );
			// sphere_mesh.position.set(-100 , 300 , 800);
			// scene.add(sphere_mesh);

			// mesh 
				var material = new THREE.MeshBasicMaterial( {
					// color: 0xff0000,
					map:m.texture,
				});
				mesh = new THREE.Mesh( buffer_geometry, material );
				// mesh.scale.set(10,10,10);
				scene.add( mesh )

			//

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( 1 );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );

			var controls = new THREE.OrbitControls( camera, renderer.domElement );

			//

			raycaster = new THREE.Raycaster();
			mouse = new THREE.Vector2();

			//

			renderer.render( scene, orth_camera );
			context2d.fillStyle='black';
			context2d.fillRect(0,0,window.innerWidth,window.innerHeight);
			context2d.drawImage(renderer.getContext().canvas,0,0);

			function screenXY(obj){

			  var vector = obj.clone();

			  var widthHalf = (window.innerWidth/2);
			  var heightHalf = (window.innerHeight/2);

			  vector.project(orth_camera);

			  vector.x = ( vector.x * widthHalf ) + widthHalf;
			  vector.y = - ( vector.y * heightHalf ) + heightHalf;
			  vector.z = 0;

			  return vector;

			};

			function createCanvasMaterial(color, size) {
			  var matCanvas = document.createElement('canvas');
			  matCanvas.width = matCanvas.height = size;
			  var matContext = matCanvas.getContext('2d');
			  var texture = new THREE.Texture(matCanvas);
			  var center = size / 2;
			  matContext.beginPath();
			  matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
			  matContext.closePath();
			  matContext.fillStyle = color;
			  matContext.fill();
			  texture.needsUpdate = true;
			  return texture;
			}





			var gv_vertices=[];
			// for(var x=-2;x<2;x+=0.04){
			// 	for(var y=-1;y<1;y+=.03*m.window_ratio){
			var width_span_unit=window.innerWidth/41400*2.3;
			var height_span_unit=window.innerWidth/41400*m.window_ratio*1;
			for(var x=-2;x<2;x+=width_span_unit){
				for(var y=-1;y<1;y+=height_span_unit){
					var test_point=new THREE.Vector2(x,y);
					raycaster.setFromCamera(test_point, orth_camera );
					intersects = raycaster.intersectObject( mesh , true );
					if ( intersects.length > 0 ) {
						var intersect_point=intersects[0].point;

						function findPos(obj) {
						    var curleft = 0, curtop = 0;
						    if (obj.offsetParent) {
						        do {
						            curleft += obj.offsetLeft;
						            curtop += obj.offsetTop;
						        } while (obj = obj.offsetParent);
						        return { x: curleft, y: curtop };
						    }
						    return undefined;
						}
						function rgbToHex(r, g, b) {
						    if (r > 255 || g > 255 || b > 255)
						        throw "Invalid color component";
						    return ((r << 16) | (g << 8) | b).toString(16);
						}
						var position_2d=screenXY(intersect_point);
					    var color_data = context2d.getImageData(position_2d.x, position_2d.y, 1, 1).data; 
						    var rgb=[
						    	color_data[0]/255,
						    	color_data[1]/255,
						    	color_data[2]/255,
						    ]

					    // var rgb=[];

					    // if(color_data[1]>=42.5*5){
					    // 	// hex_color='#8cdfff';
					    // 	rgb=[140,223,255];
					    // }
					    // else if(color_data[1]>=42.5*4){
					    // 	// hex_color='#00aeef';
					    // 	rgb=[0,174,239];
					    // }
					    // else if(color_data[1]>=42.5*3){
					    // 	// hex_color='#0054a6';
					    // 	rgb=[0,84,166];
					    // }
					    // else if(color_data[1]>=42.5*2){
					    // 	// hex_color='#2e3192';
					    // 	rgb=[46,49,146];
					    // }
					    // else if(color_data[1]>=42.5*1){
					    // 	// hex_color='#0d004c';
					    // 	rgb=[13,0,76];
					    // }
					   	// else{
					    // 	// hex_color='#181818';
					    // 	rgb=[10,10,10];
					    // }




					    // var rgb=hexToRgb(hex_color);

						function hexToRgb(hex) {
						    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
						    // return result ? {
						    //     r: parseInt(result[1], 16),
						    //     g: parseInt(result[2], 16),
						    //     b: parseInt(result[3], 16)
						    // } : null;
						    return result ? [
						        parseInt(result[1], 16),
						        parseInt(result[2], 16),
						        parseInt(result[3], 16)
						    ] : null;
						}
						function rgbToHsl(r, g, b) {
						  r /= 255, g /= 255, b /= 255;

						  var max = Math.max(r, g, b), min = Math.min(r, g, b);
						  var h, s, l = (max + min) / 2;

						  if (max == min) {
						    h = s = 0; // achromatic
						  } else {
						    var d = max - min;
						    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

						    switch (max) {
						      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
						      case g: h = (b - r) / d + 2; break;
						      case b: h = (r - g) / d + 4; break;
						    }

						    h /= 6;
						  }

						  return [ h, s, l ];
						}
				  		// var hsl=rgbToHsl(rgb[0] , rgb[1] , rgb[2] );


					  		// particle
								gv_vertices.push({
									point:intersect_point,
									color:rgb,
									// color:rgbToHsl(rgb[0], rgb[1], rgb[2]),
									// size:Math.random()*8,
									// size:8,
								})






					}
				}
			}

			var positions = new Float32Array( gv_vertices.length * 3 );
			var colors = new Float32Array( gv_vertices.length * 3 );
			var sizes = new Float32Array( gv_vertices.length );

			var vertex;
			var color = new THREE.Color();

			for ( var i = 0, l = gv_vertices.length; i < l; i ++ ) {

				vertex = gv_vertices[ i ].point;
				vertex.toArray( positions, i * 3 );

					// color.setHSL( gv_vertices[i].color[0] , gv_vertices[i].color[1] , gv_vertices[i].color[2] );
					color.setRGB( gv_vertices[i].color[0] , gv_vertices[i].color[1] , gv_vertices[i].color[2] );
					color.toArray( colors, i * 3 );

				// sizes[ i ] = gv_vertices[i].size;
				sizes[ i ] = 8;

			}


				var particle_geometry = new THREE.BufferGeometry();
				particle_geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				particle_geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
				particle_geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

			//

				var particle_material = new THREE.ShaderMaterial( {

					uniforms: {
						color:   { value: new THREE.Color( 0xffffff ) },
						texture: { value: new THREE.TextureLoader().load( "img/disc.png" ) }
					},
					vertexShader: document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

					alphaTest: 0.9,

				} );

				//



			//

				particles = new THREE.Points( particle_geometry, particle_material );
				particles.position.y=10;
				scene.add( particles );

			//

			scene.remove(mesh);
			console.log('ok');
			// jq('.loading').hide();

			//

			window.addEventListener( 'resize', onWindowResize, false );
			document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		}

		function onDocumentMouseMove( event ) {

			event.preventDefault();

			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			render();

			if(!m.is_stop){
				m.requestAnimationFrame_id=requestAnimationFrame( animate );
			}

		}

		var frame_count=0;
		// var center=0;
		function render() {

			// if(audio.bufferLength&&audio.dataArray){
			// 	audio.analyser.getByteFrequencyData(audio.dataArray);

			// 	var len=particles.geometry.attributes.size.array.length;
			// 	var len3=particles.geometry.attributes.position.array.length;

			// 	var span=25.0/audio.bufferLength;
			// 	for(var i=0;i<len;i++){

			// 		var arr=particles.geometry.attributes.position.array;
			// 		var arr_initial=particles.geometry.attributes.position.array_initial;


			// 		for(var j=0;j<audio.bufferLength;j++){
			// 			if(Math.abs(center+arr[i*3])>span*j&&Math.abs(center+arr[i*3])<span*(j+1)){
			// 				arr[i*3+2]=arr_initial[i*3+2]+audio.dataArray[j]/30.0;
			// 			}
			// 		}

			// 		if(frame_count%5==0){
			// 			particles.geometry.attributes.size.array[i]=Math.random()*8;
			// 			particles.geometry.attributes.size.needsUpdate=true;
			// 			frame_count=0;
			// 		}
			// 	}

			// 	particles.geometry.attributes.position.needsUpdate=true;
			// }


			if(frame_count%5==0){
				for(var i=0;i<particles.geometry.attributes.size.array.length;i++){
					particles.geometry.attributes.size.array[i]=2+Math.random()*5;
				}
				particles.geometry.attributes.size.needsUpdate=true;
				frame_count=0;
			}



			if(m.is_playing && audio.bufferLength&&audio.dataArray.length>0){

				audio.analyser.getByteTimeDomainData(audio.dataArray);

				for(var i=0;i<particles.geometry.attributes.size.array.length;i++){

					var position_x=particles.geometry.attributes.position.array_initial[i*3];
					var position_y=particles.geometry.attributes.position.array_initial[i*3+1];





					var span_x=m.min_max_x.span/audio.bufferLength+0.000001;
					for(var j=0,lenj=audio.dataArray.length;j<lenj;j++){
						var data=audio.dataArray[j];
						var ratio_x=data/255;

						// debugger;

						if(position_x>=m.min_max_x.min + j*span_x&&position_x< m.min_max_x.min + (j+1)*span_x){
							particles.geometry.attributes.position.array[i*3+2]=
							particles.geometry.attributes.position.array_initial[i*3+2]
							+ratio_x*10;
						}
					}
					
					var span_y=m.min_max_y.span/audio.bufferLength+0.000001;
					for(var j=0,lenj=audio.dataArray.length;j<lenj;j++){
						var data=audio.dataArray[j];
						var ratio_y=data/255;

						// debugger;

						if(position_y>=m.min_max_y.min + j*span_y&&position_y< m.min_max_y.min + (j+1)*span_y){

							// particles.geometry.attributes.position.array[i*3+2]=
							// particles.geometry.attributes.position.array_initial[i*3+2]
							// +ratio_y*10;

							particles.geometry.attributes.position.array[i*3+2]+=
							+ratio_y*10;
						}
					}



					// var span_x=m.min_max_x.span/audio.bufferLength;
					// var span_y=m.min_max_y.span/audio.bufferLength;
					// for(var j=0,lenj=audio.dataArray.length;j<lenj;j++){
					// 	var data=audio.dataArray[j];
					// 	var ratio=data/255;

					// 	var intensity=0;

					// 	// debugger;

					// 	if(
					// 		position_x>m.min_max_x.min + j*span_x&&position_x<= m.min_max_x.min + (j+1)*span_x
					// 		&&
					// 		position_y>m.min_max_y.min + j*span_y&&position_y<= m.min_max_y.min + (j+1)*span_y
					// 	){
					// 		particles.geometry.attributes.position.array[i*3+2]=
					// 		particles.geometry.attributes.position.array_initial[i*3+2]
					// 		+ratio*10;
					// 	}
					// }



				}

				particles.geometry.attributes.position.needsUpdate=true;
			}



			renderer.render( scene, camera );

			frame_count++;
			// center-=.1;
			// if(center<-25){
			// 	center=25;
			// }
		}


	
})