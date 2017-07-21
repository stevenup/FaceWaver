ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('allCtrl',function($scope,$ionicLoading,$ionicActionSheet,$ionicPopup,ec,$q){

	// init
		var $s=$scope;
		ecstore.scope.all=$s;
		$s.m={};
		var m=$s.m;
		
		$s.ec={};
		$s.ec.pm=ec.pm;
		$s.config=config;

		if(localStorage.photo_data_url){
			ec.pm.photo_data_url=localStorage.photo_data_url;
		}

	// fn
		$s.is_new_message=function(){
			return localStorage.nzapp_is_new_message;
		}

})