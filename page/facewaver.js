ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('facewaver_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$q) {

	// init
		var $s=$scope;
		ecstore.scope.facewaver_ctrl=$s;
		$s.m={};
		var m=$s.m;

		var am=$s.am;
		var audio=$s.audio;

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
			})
			.finally(function(){
				$ionicLoading.hide();
			})
		}
		$s.setting=function(){
			fw.PARTICLE_SIZE=20;
		}
		$s.head_mesh=function(){
			fw.head_material = new THREE.MeshBasicMaterial( {
				// color: 0xff0000,
				map:fw.head_texture,
			});
			fw.head_mesh = new THREE.Mesh( fw.head_buffer_geometry, fw.head_material );
			// fw.head_mesh.scale.set(10,10,10);
			fw.head_mesh.position.y=15;
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
			fw.canvas_2d.width=window.innerWidth;
			fw.canvas_2d.height=window.innerHeight;
			fw.context_2d=fw.canvas_2d.getContext('2d');
		}
		$s.orth_camera=function(){
			orth_camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000 );
			orth_camera.position.z = 500;
		}

	// init
		$s.init();

})
