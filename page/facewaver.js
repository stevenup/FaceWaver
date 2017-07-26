ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('facewaver_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.facewaver_ctrl=$s;
		$s.m={};
		var m=$s.m;

		window.s=$s;
		window.m=m;

		m.is_stop=false;

		m.type='sprite';
		// m.type='extrude'; m.extrude_meshes=[];	

		$ionicLoading.show();


	// enter leave
		$s.$on('$ionicView.beforeLeave',function(){
			clearInterval(m.audio.interval);
			m.is_stop=true;
			cancelAnimationFrame(m.requestAnimationFrame_id);
			m.audio.context.close();
		})

	// facewaver

		$timeout(function(){

			var generate_color_gradient=function(){
				var canvas=document.createElement('canvas');
				canvas.width=256;
				canvas.height=256;
				var context=canvas.getContext('2d');

				var img=document.createElement('img');
				img.src='img/gradient.png';
				img.onload=function(){
					context.drawImage(img,0,0);
					m.color_gradient=[];
					for(var i=0;i<256;i++){
						var color_gradient_data=context.getImageData(1,i,1,1).data;
						m.color_gradient.push([
							color_gradient_data[0],
							color_gradient_data[1],
							color_gradient_data[2]
						])
					}
				}
			}
			// generate_color_gradient();
			m.color_gradient=JSON.parse("[[1,0,1],[1,0,2],[1,0,3],[1,0,3],[1,0,5],[1,0,6],[1,0,7],[2,0,8],[1,0,10],[2,0,11],[3,0,12],[3,0,14],[3,0,16],[3,0,17],[3,0,18],[4,0,20],[4,0,22],[5,0,24],[5,0,25],[5,0,27],[5,0,29],[6,0,30],[6,0,32],[6,0,34],[6,0,36],[7,0,37],[7,0,40],[8,0,41],[8,0,43],[8,0,45],[8,0,46],[9,0,49],[10,0,50],[10,0,52],[10,0,54],[10,0,56],[10,0,58],[11,0,59],[11,0,62],[12,0,63],[11,0,65],[12,0,66],[12,0,69],[12,0,70],[12,0,71],[13,0,73],[13,0,75],[13,1,76],[13,1,78],[14,1,79],[14,2,81],[14,2,83],[14,3,84],[14,4,85],[14,5,87],[14,6,88],[15,7,90],[15,7,92],[15,8,93],[14,9,95],[15,10,97],[15,10,98],[15,11,99],[15,13,101],[15,14,102],[15,15,104],[16,16,105],[16,17,107],[16,19,109],[16,19,110],[16,21,112],[16,22,114],[16,23,115],[16,23,117],[16,25,118],[16,26,119],[16,27,121],[16,28,122],[16,30,123],[16,31,125],[16,32,127],[16,33,128],[16,34,130],[16,35,130],[16,37,132],[16,38,134],[16,39,135],[16,40,136],[16,41,137],[16,42,138],[16,43,140],[16,44,140],[16,45,141],[16,45,142],[16,47,143],[16,48,145],[16,48,146],[16,49,146],[16,50,148],[16,50,148],[15,52,149],[15,52,149],[15,52,149],[15,54,150],[15,54,151],[15,55,152],[15,56,152],[14,56,152],[14,57,152],[13,57,153],[13,58,154],[13,58,154],[12,58,154],[12,59,154],[11,59,155],[11,60,154],[11,61,155],[11,61,155],[10,62,155],[10,62,156],[9,63,156],[9,63,155],[9,63,155],[9,64,156],[8,64,156],[8,65,156],[7,65,157],[6,65,156],[6,66,157],[6,67,157],[6,67,156],[6,68,157],[5,69,157],[4,69,157],[4,69,158],[4,70,158],[3,71,158],[3,72,158],[3,72,158],[3,73,160],[2,74,159],[2,75,160],[2,75,160],[1,77,161],[1,78,161],[1,78,162],[1,79,162],[1,80,163],[1,81,164],[0,83,165],[0,83,166],[0,85,167],[0,86,168],[0,87,168],[0,89,169],[0,90,170],[0,92,172],[0,93,173],[0,94,174],[0,96,175],[0,98,177],[0,99,178],[0,101,180],[0,103,181],[0,104,182],[0,106,184],[0,108,185],[0,110,187],[0,111,188],[0,113,190],[0,115,192],[0,117,194],[0,118,195],[0,121,197],[0,122,198],[0,124,199],[0,127,201],[0,128,203],[0,131,204],[0,132,206],[0,134,207],[0,135,209],[0,138,211],[0,140,212],[0,141,214],[0,143,215],[0,145,217],[0,147,218],[0,149,220],[0,151,222],[0,152,223],[0,155,224],[0,156,226],[0,157,227],[0,160,229],[0,162,230],[0,163,231],[0,164,232],[0,166,233],[0,168,235],[0,169,236],[0,171,237],[0,172,238],[0,173,238],[0,175,239],[2,176,240],[4,177,241],[6,178,241],[8,180,242],[9,181,243],[12,182,244],[14,183,244],[16,185,245],[19,186,245],[22,187,246],[24,189,246],[26,190,247],[29,191,247],[32,192,247],[35,193,248],[39,194,249],[42,195,249],[45,196,249],[48,198,250],[51,199,250],[54,199,251],[57,201,251],[61,201,251],[64,202,251],[67,203,251],[71,205,251],[74,205,252],[77,206,252],[81,207,252],[84,208,252],[87,209,253],[90,210,252],[94,211,253],[97,211,252],[100,212,253],[103,213,254],[106,214,254],[109,214,253],[111,215,253],[115,216,254],[118,217,254],[120,217,254],[123,218,254],[125,218,254],[128,219,254],[129,220,254],[131,220,254],[133,221,255],[135,221,254],[137,222,254],[138,222,255]]");

			m.window_ratio=window.innerWidth/window.innerHeight;
			m.scale_xy=1;
			var camera;

			m.audio={};
			m.audio.sound_buffer = null;
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			m.audio.context = new AudioContext();
			m.audio.source;
			m.audio.analyser=m.audio.context.createAnalyser();
			m.audio.distortion = m.audio.context.createWaveShaper();

			m.audio.loadSound=function (url) {
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';

				request.onload = function() {
					m.audio.context.decodeAudioData(request.response, function(buffer) {
						m.audio.sound_buffer = buffer;
						m.audio.playSound(buffer);
						// animate();
					}, m.audio.onError);
				}
				request.send();
			} 

			m.audio.onError=function (e){
				console.log(e);
			}

			// m.audio.loadSound('song/Anan Ryoko - Refrain.mp3');
			// m.audio.loadSound('song/Ralvero,Karim Mika - Mad (Original Mix).mp3');
			// m.audio.loadSound('song/B Brightz,Julian Jordan,Firebeatz - Rage(B Brightz Remix).mp3');
			// m.audio.loadSound('song/Klaas - Calavera (Original Edit)_clip.mp3');
			// m.audio.loadSound('http://m2.music.126.net/hmZoNQaqzZALvVp0rE7faA==/0.mp3');
			// m.audio.loadSound('http://m2.music.126.net/2HLi_KTxW7zpdNVigoorCg==/7959364674897599.mp3');
			// m.audio.loadSound('http://101.227.176.68/m10.music.126.net/20170714153615/14030c809a28349b819ad1ebd0cb1874/ymusic/76af/e78f/3003/52e3a85ff7e6061b0597c041082fdfc5.mp3?wshc_tag=0&wsts_tag=59686e94&wsid_tag=b4a8078a&wsiphost=ipdbm');
			m.audio.loadSound($s.get_song_act().url);

			m.audio.playSound=function (buffer) {
				m.audio.source = m.audio.context.createBufferSource(); // creates a sound source
				m.audio.source.buffer = buffer;                    // tell the source which sound to play
				m.audio.source.connect(m.audio.analyser);
				m.audio.analyser.connect(m.audio.distortion);
				m.audio.distortion.connect(m.audio.context.destination);       // connect the source to the context's destination (the speakers)

				m.audio.analyser.fftSize = 32;
				m.audio.bufferLength = m.audio.analyser.frequencyBinCount;
				console.log('bufferLength',m.audio.bufferLength);
				m.audio.dataArray = new Uint8Array(m.audio.bufferLength);

				// init after audio loaded

					// var big_scale_ratio=.15;
					// for(var i=0,leni=m.scene.children.length;i<leni;i++){
					// 	if(m.scene.children[i].type=='Mesh'){
					// 		var mesh=m.scene.children[i];

					// 		var is_big_scale=Math.random()<big_scale_ratio;
					// 		if(is_big_scale){
					// 			mesh.extrude_ratio=1+Math.random()*2+.000001;
					// 		}
					// 		else{
					// 			mesh.extrude_ratio=1;
					// 		}
					// 	}
					// }

					// for(var i=0,leni=m.scene.children.length;i<leni;i++){
					// 	if(m.scene.children[i].type=='Mesh'){
					// 		var mesh=m.scene.children[i];

					// 		mesh.extrude_ratio=1+Math.random()*1.5+.000001;
					// 		mesh.extrude_direction=Math.floor(Math.random()*2)?1:-1;
					// 	}
					// }

					if(m.type=='extrude'){
						for(var i=0,leni=m.scene.children.length;i<leni;i++){
							if(m.scene.children[i].type=='Mesh'){
								var mesh=m.scene.children[i];

								mesh.audio_dataArray_index=Math.floor(Math.random()*m.audio.bufferLength);

							}
						}
					}

					if(m.type=='sprite'){
						for(var i=0,leni=m.gv_vertices.length;i<leni;i++){
							m.gv_vertices[i].audio_dataArray_index=Math.floor(Math.random()*m.audio.bufferLength);
						}
					}


			}

			m.audio.interval=setInterval(function(){
				if(m.audio.source){
					// jq('.loading').hide();
					$ionicLoading.hide();
					jq('.play').show();
					clearInterval(m.audio.interval);
				}
			},300)

			$s.play=function (){
				m.audio.source.start(0);
				m.is_playing=true;
				jq('.play').hide();
			}

			var canvas2d=document.createElement('canvas');
			canvas2d.width=window.innerWidth;
			canvas2d.height=window.innerHeight;
			var context2d=canvas2d.getContext('2d');

			var renderer, scene, camera, stats;

			var particles, uniforms ,geometry, mesh;
			var sphere_geometry,sphere_mesh,sphere_material;

			var PARTICLE_SIZE = 20;

			var raycaster, intersects;
			var mouse, INTERSECTED;

			var loader = new THREE.OBJLoader(  );
			// loader.load( 'model/head_3.obj', function ( object ) {
			loader.load( 'model/head_4_long_face.obj', function ( object ) {
			// loader.load( 'model/arthur_level_2.obj', function ( object ) {
				m.buffer_geometry=object.children[0].geometry;
				m.geometry = new THREE.Geometry().fromBufferGeometry( m.buffer_geometry );

				var loader = new THREE.ImageLoader(  );
				loader.load( $s.get_photo_url(), function ( image ) {

					m.texture = new THREE.Texture();
					m.texture.image = image;
					m.texture.needsUpdate = true;

					init();
					renderer.render(m.scene,m.camera);

					// init after first render

						m.particles.geometry.attributes.position.array_origin=ng.copy(m.particles.geometry.attributes.position.array);

					// true animate
						animate();

				});

			});


			function init() {

				var vertices_length=m.buffer_geometry.attributes.position.count;

				var container = document.getElementById( 'container' );

				m.scene = new THREE.Scene();

				m.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				m.camera.position.set(0,0,150);

				orth_camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000 );
				orth_camera.position.z = 100;

				// if(m.type=='extrude'){
					m.scene.add( new THREE.AmbientLight( 'rgb(180,180,180)' ) );

					var light = new THREE.PointLight( 'rgb(128,128,128)' );
					light.position.set(-100,300,800);
					m.scene.add( light );
				// }

				// var sphere_geometry = new THREE.SphereGeometry(10);
				// var sphere_material = new THREE.MeshBasicMaterial({color:'red'});
				// var sphere_mesh = new THREE.Mesh( sphere_geometry , sphere_material );
				// sphere_mesh.position.set(-100 , 300 , 800);
				// m.scene.add(sphere_mesh);

				// mesh 
					var material = new THREE.MeshBasicMaterial( {
						// color: 0xff0000,
						map:m.texture,
					});
					mesh = new THREE.Mesh( m.buffer_geometry, material );
					// mesh.scale.set(10,10,10);
					m.scene.add( mesh )

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( 1 );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				var controls = new THREE.OrbitControls( m.camera, renderer.domElement );

				//

				raycaster = new THREE.Raycaster();
				mouse = new THREE.Vector2();

				//

				renderer.render( m.scene, orth_camera );
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




				var generate_gv_vertices_by_intersect=function(){
					m.gv_vertices=[];

					var width_span_unit=0.04;
					var height_span_unit=0.02;

					m.gv_projector_xy_vertices=[];
					for(var x=-2;x<2;x+=width_span_unit){
						for(var y=-1;y<1;y+=height_span_unit){


							var test_point=new THREE.Vector2(
								x,
								y
							);
							raycaster.setFromCamera(test_point, orth_camera );
							intersects = raycaster.intersectObject( mesh , true );
							if ( intersects.length > 0 ) {
								var intersect_point=intersects[0].point;

								var position_2d=screenXY(intersect_point);
							    var color_data = context2d.getImageData(position_2d.x, position_2d.y, 1, 1).data; 

							    // set vertice color and num
							    var rgb=[];
							    var vertice_num=0;
								// steped grayscale
									var grayscale=Math.floor((color_data[0]+color_data[1]+color_data[2])/3);
								    if(grayscale>=42.5*5){
								    	vertice_num=3;
										// rgb=[140,223,255];
								    }
								    else if(grayscale>=42.5*4){
								    	vertice_num=2.5;
										// rgb=[0,174,239];
								    }
								    else if(grayscale>=42.5*3){
								    	vertice_num=2;
										// rgb=[0,84,166];
								    }
								    else if(grayscale>=42.5*2){
								    	vertice_num=1.5;
										// rgb=[46,49,146];
								    }
								    else if(grayscale>=42.5*1){
								    	vertice_num=1;
										// rgb=[13,0,76];
								    }
								   	else{
								   		vertice_num=.5;
										// rgb=[10,0,35];
								    };
								// vertice_num=3;

								// rgb=[
								// 	Math.floor(grayscale),
								// 	Math.floor(grayscale),
								// 	Math.floor(grayscale),
								// ]

								// rgb=[
								// 	color_data[0],
								// 	color_data[1],
								// 	color_data[2],
								// ]

								rgb=m.color_gradient[grayscale];


								var generate_gv_projector_xy_vertices=function(){
									var projector_x=x+width_span_unit*Math.random()-width_span_unit/2;
									var projector_y=y+height_span_unit*Math.random()-height_span_unit/2;
									m.gv_projector_xy_vertices.push({
										x:projector_x,
										y:projector_y,
										rgb:rgb,
										// size:vertice_num/10.0,
										size:.1+vertice_num/10.0,
										// size:.2,
									})
								}
								for(var i=0,leni=vertice_num;i<leni;i++){
									generate_gv_projector_xy_vertices();
								}
								var decimal=vertice_num-Math.floor(vertice_num);
								var is_decimal_create_mesh=Math.random()<decimal;

								if(is_decimal_create_mesh){
									generate_gv_projector_xy_vertices();
								}

							}
						}
					}

					for(var i=0,leni=m.gv_projector_xy_vertices.length;i<leni;i++){
						var projector_vertice=m.gv_projector_xy_vertices[i];

						var test_point=new THREE.Vector2(
							projector_vertice.x,
							projector_vertice.y
						);
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

						    var rgb=[];
						    // origin rgb
							    // var rgb=[
							    // 	color_data[0],
							    // 	color_data[1],
							    // 	color_data[2],
							    // ]
							// steped grayscale
								// var grayscale=(color_data[0]+color_data[1]+color_data[2])/3;
								// if(grayscale>=42.5*5){
								// 	// hex_color='#8cdfff';
								// 	rgb=[140,223,255];
								// }
								// else if(grayscale>=42.5*4){
								// 	// hex_color='#00aeef';
								// 	rgb=[0,174,239];
								// }
								// else if(grayscale>=42.5*3){
								// 	// hex_color='#0054a6';
								// 	rgb=[0,84,166];
								// }
								// else if(grayscale>=42.5*2){
								// 	// hex_color='#2e3192';
								// 	rgb=[46,49,146];
								// }
								// else if(grayscale>=42.5*1){
								// 	// hex_color='#0d004c';
								// 	rgb=[13,0,76];
								// }
							 	//   	else{
								// 	// hex_color='#181818';
								// 	rgb=[0,0,0];
								// }
							// grayscale
								var grayscale=(color_data[0]+color_data[1]+color_data[2])/3;
								rgb=[
									grayscale,
									grayscale,
									grayscale,
								]




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


							m.gv_vertices.push({
								point:intersect_point,
								rgb:projector_vertice.rgb,
								// color:rgbToHsl(rgb[0], rgb[1], rgb[2]),
								// size:Math.random()*8,
								size:projector_vertice.size,
							})






						}
					}
				}
				var generate_gv_vertices_by_model_wire=function(){
					m.gv_vertices=[];

					for(var i=0;i<m.geometry.vertices.length;i++){
						m.gv_vertices.push({
							point:m.geometry.vertices[i],
							rgb:[128,128,128],
							// color:rgbToHsl(rgb[0], rgb[1], rgb[2]),
							// size:Math.random()*8,
							size:.2,
						})
					}
				}
				generate_gv_vertices_by_intersect();
				// generate_gv_vertices_by_model_wire();




				if(m.type=='sprite'){
					var positions = new Float32Array( m.gv_vertices.length * 3 );
					var colors = new Float32Array( m.gv_vertices.length * 3 );
					var sizes = new Float32Array( m.gv_vertices.length );

					var vertex;
					var color = new THREE.Color();

					for ( var i = 0, leni = m.gv_vertices.length; i < leni; i ++ ) {

						vertex = m.gv_vertices[ i ].point;
						vertex.toArray( positions, i * 3 );

						// color.setHSL( m.gv_vertices[i].color[0] , m.gv_vertices[i].color[1] , m.gv_vertices[i].color[2] );
						color.setRGB( m.gv_vertices[i].rgb[0]/255 , m.gv_vertices[i].rgb[1]/255 , m.gv_vertices[i].rgb[2]/255 );
						color.toArray( colors, i * 3 );

						// sizes[ i ] = m.gv_vertices[i].size;
						sizes[ i ] = m.gv_vertices[i].size*20;
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

						m.particles = new THREE.Points( particle_geometry, particle_material );
						// m.particles.position.y=10;
						m.scene.add( m.particles );
						// m.particles.position.z=-180;

					//
				}
				else if(m.type=='extrude'){


					var extrudeSettings = {
						steps: 1,
						amount: 3,
						bevelEnabled: false,
					};

					for ( var i = 0, leni = m.gv_vertices.length; i < leni; i ++ ) {

						var gv_vertice=m.gv_vertices[i];


						var shape_size;
						// union size
							shape_size=gv_vertice.size;
						// grayscale size
						 //    if(grayscale>=42.5*5){
						 //    	shape_size=.6;
						 //    }
						 //    else if(grayscale>=42.5*4){
						 //    	shape_size=.5;
						 //    }
						 //    else if(grayscale>=42.5*3){
						 //    	shape_size=.4;
						 //    }
						 //    else if(grayscale>=42.5*2){
						 //    	shape_size=.3;
						 //    }
						 //    else if(grayscale>=42.5*1){
						 //    	shape_size=.2;
						 //    }
						 //   	else{
						 //    	shape_size=.1;
						 //    }
							// shape.absarc( 0, 0 , shape_size , 0 , Math.PI*2 , false );


						// extrude
							// var shape = new THREE.Shape();
							// shape.moveTo( 0,0 );
							// var grayscale=(gv_vertice.rgb[0]+gv_vertice.rgb[1]+gv_vertice.rgb[2])/3;
							// shape.absarc( 0, 0 , gv_vertice.size , 0 , Math.PI*2 , false );
							// var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

						// cylinder
							m.cylinder_height=3;
							var geometry = new THREE.CylinderBufferGeometry( shape_size, shape_size, m.cylinder_height, 5 );

						var material = new THREE.MeshLambertMaterial( { color: `rgb( ${gv_vertice.rgb[0]} , ${gv_vertice.rgb[1]} , ${gv_vertice.rgb[2]} )` } );
						m.a_mesh = new THREE.Mesh( geometry, material ) ;

						// for(var i=0;i<m.a_mesh.geometry.attributes.position.array.length;i++){
						// 	if(i%3==1){
						// 		m.a_mesh.geometry.attributes.position.array[i]+=m.cylinder_height/2;
						// 	}
						// }
						// m.a_mesh.geometry.attributes.position.needsUpdate=true
						m.a_mesh.rotateX(Math.PI/2);

						m.a_mesh.position.set(gv_vertice.point.x , gv_vertice.point.y , gv_vertice.point.z);
						m.extrude_meshes.push(m.a_mesh);
						m.scene.add( m.a_mesh );
						m.a_mesh.position_origin=new THREE.Vector3(
							m.a_mesh.position.x,
							m.a_mesh.position.y,
							m.a_mesh.position.z
						)
					}
				}


				m.scene.remove(mesh);
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

				m.camera.aspect = window.innerWidth / window.innerHeight;
				m.camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				render();

				if(!m.is_stop){
					m.requestAnimationFrame_id=requestAnimationFrame( animate );
				}

			}

			var frame_count=0;
			var is_frame_count_trigger=false;
			var fram_trigger_count=10;
			var step_count=0;
			var trigger_count=0;
			// var center=0;
			function render() {

				if(m.is_playing && m.audio.bufferLength&&m.audio.dataArray.length>0){
					is_frame_count_trigger=false;
					if(frame_count%fram_trigger_count==0){
						frame_count=0;
						is_frame_count_trigger=true;
					}
					frame_count++;
				}

				if(m.type=='sprite'){



					if(m.is_playing && m.audio.bufferLength&&m.audio.dataArray.length>0){

						// debugger;
						// m.audio.analyser.getByteTimeDomainData(m.audio.dataArray);
						m.current_dataArray=new Uint8Array(m.audio.bufferLength);
						m.audio.analyser.getByteFrequencyData(m.current_dataArray);

						if(!m.prev_dataArray){
							m.prev_dataArray=m.current_dataArray;
						}

						if(is_frame_count_trigger){
							m.gradient_dataArray=[];
							for(var i=0;i<m.audio.bufferLength;i++){
								m.gradient_dataArray.push({
									total:m.current_dataArray[i]-m.prev_dataArray[i],
									step:(m.current_dataArray[i]-m.prev_dataArray[i])/fram_trigger_count,
								})
							}
							m.result_dataArray=[];
							for(var i=0;i<m.audio.bufferLength;i++){
								m.result_dataArray.push(0);
							}
							step_count=0;
						}

							// m.result_dataArray=m.current_dataArray;

						if(trigger_count>2){
							if(step_count<fram_trigger_count/2){
								for(var i=0;i<m.audio.bufferLength;i++){
									m.result_dataArray[i]+=m.gradient_dataArray[i].step;
								}
							}
							else{
								for(var i=0;i<m.audio.bufferLength;i++){
									m.result_dataArray[i]-=m.gradient_dataArray[i].step;
								}
							}

							for(var i=0,leni=m.particles.geometry.attributes.size.array.length;i<leni;i++){

								// var scale=0.000001+m.result_dataArray[mesh.audio_dataArray_index]/255;
								var scale=0.000001+m.result_dataArray[m.gv_vertices[i].audio_dataArray_index]/255;
								scale*=10;

								var scale_x=1+Math.abs(scale)*2;
								var scale_y=1+Math.abs(scale)*2;
								var scale_z=scale*10;

								// debugger;
								m.particles.geometry.attributes.position.array[i*3+0]=m.particles.geometry.attributes.position.array_origin[i*3+0]+scale_x*1;
								m.particles.geometry.attributes.position.array[i*3+1]=m.particles.geometry.attributes.position.array_origin[i*3+1]+scale_y*1;
								m.particles.geometry.attributes.position.array[i*3+2]=m.particles.geometry.attributes.position.array_origin[i*3+2]+scale_z*1;

							}
							m.particles.geometry.attributes.position.needsUpdate=true;
						}

						if(is_frame_count_trigger){
							m.prev_dataArray=m.current_dataArray;
							trigger_count++;
						}
						step_count++;
					}


				}
				else if(m.type=='extrude'){

					if(m.is_playing && m.audio.bufferLength&&m.audio.dataArray.length>0){

						// debugger;
						// m.audio.analyser.getByteTimeDomainData(m.audio.dataArray);
						m.current_dataArray=new Uint8Array(m.audio.bufferLength);
						m.audio.analyser.getByteFrequencyData(m.current_dataArray);

						if(!m.prev_dataArray){
							m.prev_dataArray=m.current_dataArray;
						}

						if(is_frame_count_trigger){
							m.gradient_dataArray=[];
							for(var i=0;i<m.audio.bufferLength;i++){
								m.gradient_dataArray.push({
									total:m.current_dataArray[i]-m.prev_dataArray[i],
									step:(m.current_dataArray[i]-m.prev_dataArray[i])/fram_trigger_count,
								})
							}
							m.result_dataArray=[];
							for(var i=0;i<m.audio.bufferLength;i++){
								m.result_dataArray.push(0);
							}
							step_count=0;
						}

							// m.result_dataArray=m.current_dataArray;

						if(trigger_count>2){
							if(step_count<fram_trigger_count/2){
								for(var i=0;i<m.audio.bufferLength;i++){
									m.result_dataArray[i]+=m.gradient_dataArray[i].step;
								}
							}
							else{
								for(var i=0;i<m.audio.bufferLength;i++){
									m.result_dataArray[i]-=m.gradient_dataArray[i].step;
								}
							}
							
							var span_x=m.min_max_x.span/m.audio.bufferLength+0.000001;
							var span_y=m.min_max_y.span/m.audio.bufferLength+0.000001;

							for(var i=0,leni=m.scene.children.length;i<leni;i++){
								if(m.scene.children[i].type=='Mesh'){
									var mesh=m.scene.children[i];

									// by position
										// var position_x=mesh.position.x;
										// var position_y=mesh.position.y;

										// for(var j=0,lenj=m.audio.dataArray.length;j<lenj;j++){
										// 	if(position_x>=m.min_max_x.min + j*span_x&&position_x< m.min_max_x.min + (j+1)*span_x){
										// 		var ratio_x=m.audio.dataArray[j]/255;
										// 		mesh.$ratio_x=ratio_x;
										// 	}
										// }
										
										// for(var j=0,lenj=m.audio.dataArray.length;j<lenj;j++){
										// 	if(position_y>=m.min_max_y.min + j*span_y&&position_y< m.min_max_y.min + (j+1)*span_y){
										// 		var ratio_y=m.audio.dataArray[j]/255;
										// 		mesh.$ratio_y=ratio_y;
										// 	}
										// }


										// // if(is_frame_count_trigger){
										// // 	var big_scale_ratio=.1;
										// // 	var is_big_scale=Math.random()<big_scale_ratio;
										// // 	if(is_big_scale){
										// // 		mesh.extrude_ratio=.5+Math.random()*2+.000001;
										// // 	}
										// // 	else{
										// // 		mesh.extrude_ratio=1;
										// // 	}
										// // }

										// mesh.extrude_ratio=1;

										// var scale=.000001+mesh.$ratio_x*3+mesh.$ratio_y*3;
										// //
										// var scale_x=1;
										// var scale_y=1;
										// var scale_z=scale*mesh.extrude_ratio;

									// by random
										// var scale=0.000001+m.result_dataArray[mesh.audio_dataArray_index]/255;
										var scale=0.000001+m.result_dataArray[mesh.audio_dataArray_index]/255;
										scale*=10;

										// console.log(scale);
										var scale_x=1+Math.abs(scale)*2;
										var scale_y=1+Math.abs(scale)*2;
										var scale_z=scale*10;

									mesh.scale.set(
										scale_x,
										scale_z, // if cylinder this is z because rotate
										scale_y // if cylinder this is y because rotate
									);
									// mesh.scale.set(
									// 	m.scale_xy,
									// 	m.scale_xy,
									// 	.001+mesh.$ratio_x*3+mesh.$ratio_y*3
									// );
									// mesh.scale.set(m.scale_xy,m.scale_xy,.001+mesh.$ratio_y*3);

									// mesh.position.z=mesh.position_origin.z+m.cylinder_height/2*scale_z;

								}
							}
						}

						if(is_frame_count_trigger){
							m.prev_dataArray=m.current_dataArray;
							trigger_count++;
						}
						step_count++;
					}
				}

				renderer.render( m.scene, m.camera );

				// center-=.1;
				// if(center<-25){
				// 	center=25;
				// }

			}
		},100);


	
})