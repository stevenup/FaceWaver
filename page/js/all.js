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

		if(localStorage.photo_data_url){
			ec.pm.photo_data_url=localStorage.photo_data_url;
		}


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

})