ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('HomeCtrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {
	// console.log($stateParams);

	// init
		var $s=$scope;
		ecstore.scope.home=$s;
		$s.m={};
		var m=$s.m;
		$s.ec=ec;
		m.is_show_starter=false;
		// $s.is_signining=false;

		m.main_slider_options={
			loop:true,
		}

		m.free_slider_options={
			freeMode:true,
			slidesPerView:'auto',
		}

	// fn
		$s.search_keypress=function($event){
			if($event.keyCode==13){//enter
				if(m.search_keywords.trim()==''){
					$s.search_palceholder='请输入关键字';
					return;
				}
				// location='#/tab/gallery/search_keywords/'+m.search_keywords+'/'+m.search_keywords;
				location='#/tab/gallery?search='+m.search_keywords;
			}
		}
		$s.clear_search_keywords=function(e){
			m.search_keywords='';
			setTimeout(function(){
				jq(e.target).siblings('input').focus();
			},0);
		}
		$s.starter_show=function(){
			m.is_show_starter=true;
			$ionicNavBarDelegate.showBar(false);
		}
		$s.starter_hide=function(){
			m.is_show_starter=false;
			$ionicNavBarDelegate.showBar(true);
		}
		$s.starterSlideChanged=function(index){
			// console.log(index);
		}
		$s.test=function(){
			// $ionicNavBarDelegate.showBar(true);
		}
		$s.refresh_cart=function(){
			ec.apip.member_get_cart_info()
			.then(function(){
				$s.cart=ec.pm.cart;
				$s.cart_total_quantity=ec.pm.cart_total_quantity;	
			})
		}
		$s.starter_slide_click=function(){
			var s=this;
			if(s.$last){
				$s.starter_hide();
			}
		}

	// init
		setTimeout(function(){
			// $ionicNavBarDelegate.showBar(false);
		},0);

		jq('.no_network_wrap').hide();

		$ionicLoading.show();
		ec.api.do({
			method:'ecapp.setting.get_index',
		})
		.then(function(re){
			$s.homeConfig=re.data.data;
			// $ionicSlideBoxDelegate.$getByHandle('mainSlide').update();
			if(
				$s.homeConfig.starter_slides
				&&$s.homeConfig.starter_slides.length>0
				&&(
					!localStorage.nzapp_starter_version
					||localStorage.nzapp_starter_version<parseInt($s.homeConfig.starter_version)
				)
			){
				// $s.starter_show();
				localStorage.nzapp_starter_version=parseInt($s.homeConfig.starter_version);
			}
		},function(fail){
			location='#/tab/network_fail';
		})
		.finally(function(re){
			$ionicLoading.hide();
		})

		ec.api.do({
			method:'ecapp.goods.search_properties_goods',
			page_num:1,
			page_size:16,
			cat_id:1,
			// brand_id:,
			// search_keywords:'皮质彩色水钻装饰腕带'
			// specs:,
			// props:,
			// orderBy_id:
		})
		.then(function(data){
			// console.log(data);
			var gallery=data.data.data.goods;
			for(var i=0;i<gallery.length;i++){
				if(gallery[i].image&&gallery[i].image.s_url.indexOf('http://')<0){
					gallery[i].image.s_url=config.url+gallery[i].image.s_url;
				}
			}
			$s.gallery=gallery;
		});

		$s.$on('$ionicView.beforeEnter',function(){
			jq('body').addClass('bodyHome');

			// 自动登录并刷新accesstoken
			if(localStorage.nzapp_uname&&localStorage.nzapp_password_encoded){
				ec.api.do({method:'ecapp.member.signin',
					uname:localStorage.nzapp_uname,
					password:localStorage.nzapp_password_encoded,
				})
				.then(function(re){
					if(re.data.data.status=='true'){//signin ok
						var member=re.data.data;
						ec.fn.set_local_storage({
							uname:localStorage.nzapp_uname,
							password_encoded:localStorage.nzapp_password_encoded,
							member_id:member.member_id,
							accesstoken:member.accesstoken,
						});
						$s.refresh_cart();
					}
					else{//uname password error
						ec.fn.logout();
					}
				})
			}
			else if(localStorage.nzapp_wx_unionid){
				ec.api.do({method:'ecapp.member.bind_weixin',
					unionid:localStorage.nzapp_wx_unionid,
				})
				.then(function(re){
					if(re.data.rsp=='succ'){
						// unionid 已绑定, 自动登录
						var member=re.data.data;
						ec.fn.set_local_storage({
							wx_unionid:localStorage.nzapp_wx_unionid,
							accesstoken:re.data.data.accesstoken,
							member_id:re.data.data.member_id,
						});
						$s.refresh_cart();
					}
					else{
						ec.fn.logout();
					}
				})
			}

		})

		$s.$on('$ionicView.beforeLeave',function(){
			jq('body').removeClass('bodyHome');
		})

		// m.token_time=0;
		// $interval(function(){
		// 	m.token_time++;
		// },1000)




	
})