ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('facewaver_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$q) {

	// init
		var $s=$scope;
		ecstore.scope.facewaver_ctrl=$s;
		$s.m={};
		var m=$s.m;

		fw.raycaster = new THREE.Raycaster();

	// $on
		$s.$on('$ionicView.afterEnter',function(){
			fw.on=true;
			am.camera.rotation.z=0;
		})
		$s.$on('$ionicView.beforeLeave',function(){
			fw.on=false;
		})

	// fn
		$s.init=function(){
			$q.all([
				$s.load_obj( 'model/head_4_long_face.obj'),
				// $s.loadSound($s.get_song_act().audio_file.url),
				$s.load_sound(ec.pm.playlist[0].audio_file.url),
				$s.load_image($s.get_photo_url()),
			])
			.then(function(res){

				var re=res[0]; //obj
					var object=re.object;
					fw.head_buffer_geometry=object.children[0].geometry;
					fw.head_geometry = new THREE.Geometry().fromBufferGeometry( fw.head_buffer_geometry );

				var re=res[1]; //sound
					var buffer=re.buffer;
					audio.source_act = audio.context.createBufferSource(); 
					audio.source_act.buffer = buffer;  

					audio.source_act.connect(audio.analyser);
					audio.analyser.connect(audio.context.destination);   

					audio.analyser.fftSize = 256; // best 256 
					audio.bufferLength = audio.analyser.frequencyBinCount;
					audio.dataArray = new Uint8Array(audio.bufferLength);

				var re=res[2]; //image
					var image=re.image;
					fw.head_texture = new THREE.Texture();
					fw.head_texture.image = image;
					fw.head_texture.needsUpdate = true;

				// after all
					$s.setting();
					$s.head_mesh();
					$s.orth_camera();
					$s.canvas_2d();
					$s.intersect_point_lv1s();
			})
			.finally(function(){
				$ionicLoading.hide();
			})
		}
		$s.intersect_point_lv1s=function(){
			m.intersect_point_lv1s=[];
			for(var x=-2;x<2;x+=fw.INTERSECT_POINT_LV1_SPAN_X){
				for(var y=-1;y<1;y+=fw.INTERSECT_POINT_LV1_SPAN_Y){


					var test_point=new THREE.Vector2(x,y);
					fw.raycaster.setFromCamera(test_point, fw.orth_camera );
					var intersects = fw.raycaster.intersectObject( fw.head_mesh , true );
					if ( intersects.length > 0 ) {
						var intersect_point=intersects[0].point;

						var vector2=vs.threejs.screen_xy(intersect_point, fw.orth_camera);
					    var color_data = fw.context_2d.getImageData(vector2.x, vector2.y, 1, 1).data; 

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
							var projector_x=x+fw.INTERSECT_POINT_LV1_SPAN_X*Math.random()-fw.INTERSECT_POINT_LV1_SPAN_X/2;
							var projector_y=y+fw.INTERSECT_POINT_LV1_SPAN_Y*Math.random()-fw.INTERSECT_POINT_LV1_SPAN_Y/2;
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
		}
		$s.setting=function(){
			fw.PARTICLE_SIZE=20;
			fw.INTERSECT_POINT_LV1_SPAN_X=0.04;
			fw.INTERSECT_POINT_LV1_SPAN_Y=0.02;
		}
		$s.head_mesh=function(){
			fw.head_material = new THREE.MeshBasicMaterial( {
				// color: 0xff0000,
				map:fw.head_texture,
			});
			fw.head_mesh = new THREE.Mesh( fw.head_buffer_geometry, fw.head_material );
			// fw.head_mesh.scale.set(10,10,10);
			// fw.head_mesh.position.x=0;
			// fw.head_mesh.position.y=50;
			// fw.head_mesh.position.z=0;
			am.scene.add( fw.head_mesh );
		}
		$s.light=function(){
			am.scene.add( new THREE.AmbientLight( 'rgb(180,180,180)' ) );
			am.light = new THREE.PointLight( 'rgb(128,128,128)' );
			am.light.position.set(-100,300,800);
			am.scene.add( am.light );
		}
		$s.canvas_2d=function(){
			fw.canvas_2d=document.createElement('canvas');
			fw.canvas_2d.width=window.innerWidth*window.devicePixelRatio;
			fw.canvas_2d.height=window.innerHeight*window.devicePixelRatio;
			fw.context_2d=fw.canvas_2d.getContext('2d');
			jq('.canvas_2d').append(fw.canvas_2d);

			am.scene.remove(am.waterMesh);
			am.renderer.render( am.scene, fw.orth_camera );
			fw.context_2d.fillStyle='black';
			fw.context_2d.fillRect(0,0,window.innerWidth,window.innerHeight);
			fw.context_2d.drawImage(am.renderer.domElement,0,0);
			am.scene.add(am.waterMesh);
		}
		$s.orth_camera=function(){
			fw.orth_camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000 );
			fw.orth_camera.position.z = 500;
		}

	// init
		$s.init();

})
