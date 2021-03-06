ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('home_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$ionicConfig) {

	// init
		var $s=$scope;
		window.home_ctrl=ecstore.scope.home_ctrl=$s;
		$s.m={};
		var m=window.m=$s.m;

		m.is_loaded=false;

		$ionicConfig.views.swipeBackEnabled(false);

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
	// fn
		$s.init=function(){

			// if(localStorage.facewaver_wx_code){
			// 	ec.api.do({method:'/users',
			// 		code:localStorage.facewaver_wx_code,
			// 	})
			// }


			$s.anim_head_start();
			$s.anim_band_start();
			$s.anim_logo_start();
			$s.load_imgs();
		}

		$s.load_imgs=function(){

			for(let i=0;i<m.anim_head_num;i++){
				var img=jq('<img src="img/anim_head/head_'+$s.pad2(i)+'.png"/>');

				jq(img)
				.on('load',function(){
					$s.set_loading_progress();
				})
				.each(function() {
				  if(this.complete) jq(this).trigger('load');
				});
			}
			for(let i=0;i<m.anim_band_num;i++){
				var img=jq('<img src="img/anim_band/飘带_'+$s.pad2(i)+'.png"/>');

				jq(img)
				.on('load',function(){
					$s.set_loading_progress();
				})
				.each(function() {
				  if(this.complete) jq(this).trigger('load');
				});
			}
			for(let i=0;i<m.anim_logo_num;i++){
				var img=jq('<img src="img/anim_logo/标题_'+$s.pad2(i)+'.png"/>');

				jq(img)
				.on('load',function(){
					$s.set_loading_progress();
				})
				.each(function() {
				  if(this.complete) jq(this).trigger('load');
				});
			}
		}
		$s.set_loading_progress=function(){
			$s.$apply(function(){
				m.loaded_pic_count++;
				m.loading_progress=m.loaded_pic_count/m.total_pic_count;
				// if(m.loaded_pic_count == m.total_pic_count){
					// m.is_loaded=true;
				// }
				// console.log(m.loading_progress);
			})
		}
		$s.pad2=function(int){
			var str='0'+int;
			return str.slice(-2);
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