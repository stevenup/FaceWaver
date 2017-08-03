ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('home_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.home_ctrl=$s;
		$s.m={};
		var m=$s.m;

		m.anim_head_max=44;
		m.anim_head_index=0;
		m.anim_head_interval;

		m.anim_band_max=44;
		m.anim_band_index=0;
		m.anim_band_interval;

		m.anim_logo_max=34;
		m.anim_logo_index=0;
		m.anim_logo_interval;

	// $on
        $s.$on('$destroy', function() {
          $s.anim_head_stop();
          $s.anim_band_stop();
          $s.anim_logo_stop();
        });

    // event
		window.addEventListener('deviceorientation', handleOrientation);
		function handleOrientation(event) {
			debugger;
			// if(!m.is_touch){
				var x = event.gamma; // In degree in the range [-90,90]
				var y = event.beta;  // In degree in the range [-180,180]

				// Because we don't want to have the device upside down
				// We constrain the y value to the range [-90,90]
				if (y >  90) { y =  90};
				if (y < -90) { y = -90};

				y-=40;

				m.mouse_x= (window.innerWidth/2 * x) / 90; 
				m.mouse_y= (window.innerHeight/2 * y) / 90; 

				m.mouse_x*=5;
				// m.mouse_y*=8;

			// }

		}
	// fn
		$s.init=function(){
			$s.anim_head_start();
			$s.anim_band_start();
			$s.anim_logo_start();
		}

		$s.pad2=function(int){
			var str='0'+int;
			return str.slice(-2);
		}

		$s.anim_head_start=function(){
			m.anim_head_interval=$interval(function(){
				m.anim_head_index++;
				if(m.anim_head_index>m.anim_head_max){
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
				if(m.anim_band_index>m.anim_band_max){
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
				if(m.anim_logo_index>m.anim_logo_max){
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