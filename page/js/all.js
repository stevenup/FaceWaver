ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('allCtrl',function($scope,$ionicLoading,$ionicActionSheet,$ionicPopup,ec,$q){
	var $s=$scope;
	ecstore.scope.all=$s;
	$s.m={};
	var m=$s.m;
	
	$s.ec=ec;
	$s.config=config;

	$s.is_new_message=function(){
		return localStorage.nzapp_is_new_message;
	}

})