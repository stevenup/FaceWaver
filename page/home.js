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

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			jq('.page_home .bg_wave').prepend( renderer.domElement);
			// document.body.appendChild( renderer.domElement );

			var controls = new THREE.OrbitControls(camera , renderer.domElement);

			scene.add( new THREE.AmbientLight( 0x888888 ) );

			var light = new THREE.PointLight( 0xffffff );
			light.position.set(-10,10,10);
			scene.add( light );



			var heartShape = new THREE.Shape();

			heartShape.moveTo( 0 , 0 );
			heartShape.lineTo( 0 , 10 );
			heartShape.lineTo( 30 , 10 );

			var extrudeSettings = { 
				steps: 2,
				amount: 8,
				bevelEnabled: false,
				// bevelSegments: 2,
				// bevelSize: 1,
				// bevelThickness: 1 ,
			};

			var geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );

			var material = new THREE.MeshLambertMaterial( { color: 'red', wireframe: false } );

			var mesh = new THREE.Mesh( geometry, material );

			scene.add(mesh);


			// helper
				var helper={};
				helper.gridHelper = new THREE.GridHelper( 20 , 20 );
				scene.add( helper.gridHelper );

				helper.geometry_x = new THREE.BoxGeometry( 10 , 0.1 , 0.1 );
				helper.material_x = new THREE.MeshBasicMaterial( {color:'red'});
				helper.mesh_x=new THREE.Mesh(helper.geometry_x,helper.material_x);
				helper.mesh_x.position.x=5;
				scene.add(helper.mesh_x);

				helper.geometry_y = new THREE.BoxGeometry( .1 , 10 , 0.1 );
				helper.material_y = new THREE.MeshBasicMaterial( {color:'green'});
				mesh_y=new THREE.Mesh(helper.geometry_y,helper.material_y);
				mesh_y.position.y=5;
				scene.add(mesh_y);

				helper.geometry_z = new THREE.BoxGeometry( .1 , .1 , 10 );
				helper.material_z = new THREE.MeshBasicMaterial( {color:'blue'});
				helper.mesh_z=new THREE.Mesh(helper.geometry_z,helper.material_z);
				helper.mesh_z.position.z=5;
				scene.add(helper.mesh_z);


			camera.position.z = 100;

			var animate = function () {
				requestAnimationFrame( animate );

				renderer.render(scene, camera);
			};

			animate();
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