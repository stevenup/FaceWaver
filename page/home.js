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

		$interval(function(){
			m.loading_progress+=0.01;
			// console.log(m.loading_progress);
		},100)

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
			$s.anim_head_start();
			$s.anim_band_start();
			$s.anim_logo_start();
		}

		$s.reset_gyro=function(){
			m.alpha_init=undefined;
			m.beta_init=undefined;
			m.gamma_init=undefined;
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