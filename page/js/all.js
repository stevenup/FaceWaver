ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('allCtrl',function($scope,$ionicLoading,$ionicActionSheet,$ionicPopup,ec,$q,$ionicSideMenuDelegate){

	// init
		var $s=$scope;
		ecstore.scope.all=$s;
		$s.am={};
		var am=$s.am;
		
		$s.config=config;
		$s.ec={};
		$s.ec.pm=ec.pm;
		


	// fn
		$s.is_new_message=function(){
			return localStorage.nzapp_is_new_message;
		}
		$s.toggle_left_side_menu=function() {
			$ionicSideMenuDelegate.toggleLeft();
		};
		$s.check_left_side_menu_open=function(){
			if($ionicSideMenuDelegate.isOpenLeft()){
				return true;
			}
			else{
				return false;
			}
		}
		$s.set_song_act=function(song){
			localStorage.facewaver_song_act=ng.toJson(song);
		}
		$s.get_song_act=function(){
			return ng.fromJson(localStorage.facewaver_song_act);
		}
		$s.set_photo_url=function(photo_url){
			localStorage.facewaver_photo_url=photo_url;
		}
		$s.get_photo_url=function(){
			return localStorage.facewaver_photo_url;
		}

})