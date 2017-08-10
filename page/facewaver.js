ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('facewaver_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$q) {

	// init
		var $s=$scope;
		ecstore.scope.facewaver_ctrl=$s;
		$s.m={};
		var m=$s.m;


	// $on
		$s.$on('$ionicView.afterEnter',function(){
			fw.on=true;
			am.camera.rotation.z=0;
		})
		$s.$on('$ionicView.afterLeave',function(){
			fw.on=false;
			am.scene.remove(fw.result_head);
			try{
				audio.source_act.disconnect(audio.analyser);
			}catch(e){}
			for(var key in fw){
				delete fw[key];
			}
		})

	// fn
		$s.init=function(){
			jq('.bg_wave').hide();
			jq('.vs_loading_repeat_wrap').show();
			$q.all([
				$s.load_obj( 'model/head_4_long_face.obj'),
				$s.load_sound($s.get_song_act().audio_file.url),
				// $s.load_sound(ec.pm.playlist[0].audio_file.url),
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
					$s.fw_init();
					$s.head_mesh();
					$s.orth_camera();
					$s.canvas_2d();
					$s.projector_points();
					$s.intersect_points();
					am.scene.remove(fw.head_mesh);
					$s.result_head();
					$s.min_max();

					fw.is_inited=true;
					jq('.vs_loading_repeat_wrap').hide();
					requestAnimationFrame(function(){
						jq('.bg_wave').show();
						am.camera.rotation.z=0;
					})
			})
			.finally(function(){
				jq('.vs_loading_repeat_wrap').hide();
			})
		}
		$s.min_max=function(){
			fw.get_min_max_x=function(){
				fw.xs=[];
				var min=0;
				var max=0;
				for(var i=0;i<fw.result_head.children.length;i++){
					var mesh=fw.result_head.children[i];
					if(mesh.is_head_mesh){
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
			fw.min_max_x=fw.get_min_max_x();

			fw.get_min_max_y=function(){
				fw.ys=[];
				var min=0;
				var max=0;
				for(var i=0;i<fw.result_head.children.length;i++){
					var mesh=fw.result_head.children[i];
					if(mesh.is_head_mesh){
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
			fw.min_max_y=fw.get_min_max_y();
		}
		$s.result_head=function(){

			fw.result_head=new THREE.Group();

			for ( var i = 0, leni = fw.intersect_points.length; i < leni; i ++ ) {

				var intersect_point=fw.intersect_points[i];


				var shape_size=intersect_point.size;

				var cylinder_height=2;
				var geometry = new THREE.CylinderBufferGeometry( shape_size, shape_size, cylinder_height, 5 );

				var material = new THREE.MeshLambertMaterial( { 
					color: `rgb( ${intersect_point.rgb[0]} , ${intersect_point.rgb[1]} , ${intersect_point.rgb[2]} )` ,
				});
				var a_mesh = new THREE.Mesh( geometry, material ) ;

				a_mesh.rotateX(Math.PI/2);

				a_mesh.position.set(intersect_point.point.x , intersect_point.point.y , intersect_point.point.z);
				a_mesh.is_head_mesh=true;
				fw.result_head.add(a_mesh );
				a_mesh.position_origin=new THREE.Vector3(
					a_mesh.position.x,
					a_mesh.position.y,
					a_mesh.position.z
				)
			}
			fw.result_head.position.x=0;
			// fw.result_head.position.y=60;
			fw.result_head.position.z=130;
			// fw.result_head.rotateX(Math.PI/180*6.5);
			am.scene.add(fw.result_head);
		}
		$s.intersect_points=function(){
			fw.intersect_points=[];
			for(var i=0,leni=fw.projector_points.length;i<leni;i++){
				var projector_point=fw.projector_points[i];

				var test_point=new THREE.Vector2(
					projector_point.x,
					projector_point.y
				);
				fw.raycaster.setFromCamera(test_point, fw.orth_camera );
				var intersects = fw.raycaster.intersectObject( fw.head_mesh , true );
				if ( intersects.length > 0 ) {
					var intersect_point=intersects[0].point;

					var vector2=vs.threejs.screen_xy(intersect_point, fw.orth_camera);
					// console.log(vector2);
				    var color_data = fw.context_2d.getImageData(Math.floor(vector2.x)*window.devicePixelRatio, Math.floor(vector2.y)*window.devicePixelRatio, 1, 1).data; 
					// console.log(color_data);

				    var rgb=[];
					// grayscale
						var grayscale=(color_data[0]+color_data[1]+color_data[2])/3;
						rgb=[
							grayscale,
							grayscale,
							grayscale,
						]


					fw.intersect_points.push({
						point:intersect_point,
						rgb:projector_point.rgb,
						size:projector_point.size,
					})
				}
			}
			// fw.intersect_points=fw.intersect_points.slice(0,1000);
		}
		$s.projector_points=function(){
			fw.projector_points=[];
			for(var x=-2;x<2;x+=fw.INTERSECT_POINT_LV1_SPAN_X){
				for(var y=-1;y<1;y+=fw.INTERSECT_POINT_LV1_SPAN_Y){


					var test_point=new THREE.Vector2(x,y);
					fw.raycaster.setFromCamera(test_point, fw.orth_camera );
					var intersects = fw.raycaster.intersectObject( fw.head_mesh , true );
					if ( intersects.length > 0 ) {
						var intersect_point=intersects[0].point;

						var vector2=vs.threejs.screen_xy(intersect_point, fw.orth_camera);
					    var color_data = fw.context_2d.getImageData(Math.floor(vector2.x)*window.devicePixelRatio, Math.floor(vector2.y)*window.devicePixelRatio, 1, 1).data; 

					    var rgb=[];
					    var vertice_num=0;

						var grayscale=Math.floor((color_data[0]+color_data[1]+color_data[2])/3);
					    if(grayscale>=42.5*5){
					    	vertice_num=3/3;
					    }
					    else if(grayscale>=42.5*4){
					    	vertice_num=2.5/3;
					    }
					    else if(grayscale>=42.5*3){
					    	vertice_num=2/3;
					    }
					    else if(grayscale>=42.5*2){
					    	vertice_num=1.5/3;
					    }
					    else if(grayscale>=42.5*1){
					    	vertice_num=1/3;
					    }
					   	else{
					   		vertice_num=.5/3;
					    };

						rgb=fw.COLOR_GRADIENT[grayscale];


						var generate_projector_points=function(){
							var projector_x=x+fw.INTERSECT_POINT_LV1_SPAN_X*Math.random()-fw.INTERSECT_POINT_LV1_SPAN_X/2;
							var projector_y=y+fw.INTERSECT_POINT_LV1_SPAN_Y*Math.random()-fw.INTERSECT_POINT_LV1_SPAN_Y/2;
							fw.projector_points.push({
								x:projector_x,
								y:projector_y,
								rgb:rgb,
								// size:vertice_num/10.0,
								size:.1+vertice_num/3.0,
								// size:.2,
							})
						}
						for(var i=0,leni=vertice_num;i<leni;i++){
							generate_projector_points();
						}
						var decimal=vertice_num-Math.floor(vertice_num);
						var is_decimal_create_mesh=Math.random()<decimal;

						if(is_decimal_create_mesh){
							generate_projector_points();
						}

					}
				}
			}
		}
		$s.fw_init=function(){
			fw.PARTICLE_SIZE=20;
			fw.INTERSECT_POINT_LV1_SPAN_X=0.04;
			fw.INTERSECT_POINT_LV1_SPAN_Y=0.02;
			fw.raycaster = new THREE.Raycaster();
			fw.frame_count=0;
			fw.is_frame_count_trigger=false;

			fw.song_index=0;
			var song_act=$s.get_song_act();
			for(var i=0;i<ec.pm.playlist.length;i++){
				if(song_act.title==ec.pm.playlist[i].title){
					fw.song_index=i;
					break;
				}
			}

			fw.COLOR_GRADIENT=JSON.parse(
				
				"[[1,0,1],[1,0,2],[1,0,3],[1,0,3],[1,0,5],[1,0,6],[1,0,7],[2,0,8],[1,0,10],[2,0,11],[3,0,12],[3,0,14],[3,0,16],[3,0,17],[3,0,18],[4,0,20],[4,0,22],[5,0,24],[5,0,25],[5,0,27],[5,0,29],[6,0,30],[6,0,32],[6,0,34],[6,0,36],[7,0,37],[7,0,40],[8,0,41],[8,0,43],[8,0,45],[8,0,46],[9,0,49],[10,0,50],[10,0,52],[10,0,54],[10,0,56],[10,0,58],[11,0,59],[11,0,62],[12,0,63],[11,0,65],[12,0,66],[12,0,69],[12,0,70],[12,0,71],[13,0,73],[13,0,75],[13,1,76],[13,1,78],[14,1,79],[14,2,81],[14,2,83],[14,3,84],[14,4,85],[14,5,87],[14,6,88],[15,7,90],[15,7,92],[15,8,93],[14,9,95],[15,10,97],[15,10,98],[15,11,99],[15,13,101],[15,14,102],[15,15,104],[16,16,105],[16,17,107],[16,19,109],[16,19,110],[16,21,112],[16,22,114],[16,23,115],[16,23,117],[16,25,118],[16,26,119],[16,27,121],[16,28,122],[16,30,123],[16,31,125],[16,32,127],[16,33,128],[16,34,130],[16,35,130],[16,37,132],[16,38,134],[16,39,135],[16,40,136],[16,41,137],[16,42,138],[16,43,140],[16,44,140],[16,45,141],[16,45,142],[16,47,143],[16,48,145],[16,48,146],[16,49,146],[16,50,148],[16,50,148],[15,52,149],[15,52,149],[15,52,149],[15,54,150],[15,54,151],[15,55,152],[15,56,152],[14,56,152],[14,57,152],[13,57,153],[13,58,154],[13,58,154],[12,58,154],[12,59,154],[11,59,155],[11,60,154],[11,61,155],[11,61,155],[10,62,155],[10,62,156],[9,63,156],[9,63,155],[9,63,155],[9,64,156],[8,64,156],[8,65,156],[7,65,157],[6,65,156],[6,66,157],[6,67,157],[6,67,156],[6,68,157],[5,69,157],[4,69,157],[4,69,158],[4,70,158],[3,71,158],[3,72,158],[3,72,158],[3,73,160],[2,74,159],[2,75,160],[2,75,160],[1,77,161],[1,78,161],[1,78,162],[1,79,162],[1,80,163],[1,81,164],[0,83,165],[0,83,166],[0,85,167],[0,86,168],[0,87,168],[0,89,169],[0,90,170],[0,92,172],[0,93,173],[0,94,174],[0,96,175],[0,98,177],[0,99,178],[0,101,180],[0,103,181],[0,104,182],[0,106,184],[0,108,185],[0,110,187],[0,111,188],[0,113,190],[0,115,192],[0,117,194],[0,118,195],[0,121,197],[0,122,198],[0,124,199],[0,127,201],[0,128,203],[0,131,204],[0,132,206],[0,134,207],[0,135,209],[0,138,211],[0,140,212],[0,141,214],[0,143,215],[0,145,217],[0,147,218],[0,149,220],[0,151,222],[0,152,223],[0,155,224],[0,156,226],[0,157,227],[0,160,229],[0,162,230],[0,163,231],[0,164,232],[0,166,233],[0,168,235],[0,169,236],[0,171,237],[0,172,238],[0,173,238],[0,175,239],[2,176,240],[4,177,241],[6,178,241],[8,180,242],[9,181,243],[12,182,244],[14,183,244],[16,185,245],[19,186,245],[22,187,246],[24,189,246],[26,190,247],[29,191,247],[32,192,247],[35,193,248],[39,194,249],[42,195,249],[45,196,249],[48,198,250],[51,199,250],[54,199,251],[57,201,251],[61,201,251],[64,202,251],[67,203,251],[71,205,251],[74,205,252],[77,206,252],[81,207,252],[84,208,252],[87,209,253],[90,210,252],[94,211,253],[97,211,252],[100,212,253],[103,213,254],[106,214,254],[109,214,253],[111,215,253],[115,216,254],[118,217,254],[120,217,254],[123,218,254],[125,218,254],[128,219,254],[129,220,254],[131,220,254],[133,221,255],[135,221,254],[137,222,254],[138,222,255]]"
			);
		}
		$s.head_mesh=function(){
			fw.head_material = new THREE.MeshBasicMaterial( {
				// color: 0xff0000,
				map:fw.head_texture,
			});
			fw.head_mesh = new THREE.Mesh( fw.head_buffer_geometry, fw.head_material );
			// fw.head_mesh.scale.set(10,10,10);
			// fw.head_mesh.position.x=0;
			fw.head_mesh.position.y=60;
			// fw.head_mesh.position.z=0;
			am.scene.add(fw.head_mesh );
		}
		$s.canvas_2d=function(){
			fw.canvas_2d=document.createElement('canvas');
			fw.canvas_2d.width=window.innerWidth*window.devicePixelRatio;
			fw.canvas_2d.height=window.innerHeight*window.devicePixelRatio;
			fw.context_2d=fw.canvas_2d.getContext('2d');
			jq('.canvas_2d').append(fw.canvas_2d);

			// am.scene.remove(am.waterMesh);
			am.renderer.render( am.scene, fw.orth_camera );
			fw.context_2d.fillStyle='black';
			fw.context_2d.fillRect(0,0,window.innerWidth,window.innerHeight);
			fw.context_2d.drawImage(am.renderer.domElement,0,0);
			// am.scene.add(am.waterMesh);
		}
		$s.orth_camera=function(){
			fw.orth_camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000 );
			fw.orth_camera.position.y = 60;
			fw.orth_camera.position.z = 500;
		}
		$s.play=function(){
			audio.source_act.connect(audio.analyser);
			audio.source_act.loop=true;
			try{
				audio.source_act.start(0);
			}catch(e){}
			fw.is_playing=true;
		}
		$s.pause=function(){
			try{
				audio.source_act.disconnect(audio.analyser);
			}catch(e){}
			fw.is_playing=false;
		}
		$s.prev_song=function(){
			jq('.vs_loading_repeat_wrap').show();
			fw.song_index--;
			if(fw.song_index<0){
				fw.song_index=ec.pm.playlist.length-1;
			}
			var song=ec.pm.playlist[fw.song_index];
			$s.load_sound(song.audio_file.url)
			.then(function(re){
				$s.set_song_act(song);
				var buffer=re.buffer;
				audio.source_prev = audio.context.createBufferSource(); // creates a sound source
				audio.source_prev.buffer = buffer;  

				try{
					audio.source_act.disconnect(audio.analyser);
				}catch(e){}
				audio.source_prev.connect(audio.analyser);
				fw.is_playing=true;

				audio.source_prev.start(0);                

				audio.source_act=audio.source_prev;
				audio.source_act.loop=true;
			})
			.finally(function(){
				jq('.vs_loading_repeat_wrap').hide();
			})
		}
		$s.next_song=function(){
			jq('.vs_loading_repeat_wrap').show();
			fw.song_index++;
			if(fw.song_index>ec.pm.playlist.length-1){
				fw.song_index=0;
			}
			var song=ec.pm.playlist[fw.song_index];
			$s.load_sound(song.audio_file.url)
			.then(function(re){
				$s.set_song_act(song);
				var buffer=re.buffer;
				audio.source_next = audio.context.createBufferSource(); // creates a sound source
				audio.source_next.buffer = buffer;  

				try{
					audio.source_act.disconnect(audio.analyser);
				}catch(e){}
				audio.source_next.connect(audio.analyser);
				fw.is_playing=true;

				audio.source_next.start(0);                

				audio.source_act=audio.source_next;
				audio.source_act.loop=true;
			})
			.finally(function(){
				jq('.vs_loading_repeat_wrap').hide();
			})
		}

	// init
		$s.init();

		$interval(function(){
			audio.audio_act_current_time=audio.context.currentTime;
		},500);

})
