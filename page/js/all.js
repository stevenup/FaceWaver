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


		ec.pm.songlist=[
			{
				title:'Refrain',
				artist:'Anan Ryoko',
				audio_file:{
					url:'song/Anan Ryoko - Refrain_clip.mp3',
				},
			},
			{
				title:'Rage',
				artist:'B Brightz,Julian Jordan,Firebeatz ',
				audio_file:{
					url:'song/B Brightz,Julian Jordan,Firebeatz - Rage(B Brightz Remix)_clip.mp3',
				},
			},
			{
				title:'Calavera',
				artist:'Klaas',
				audio_file:{
					url:'song/Klaas - Calavera (Original Edit)_clip.mp3',
				},
			},
		]

		ec.pm.playlist=ng.copy(ec.pm.songlist);

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
			if(!localStorage.facewaver_song_act){
				location='#/tab/home';
				return;
			}
			return ng.fromJson(localStorage.facewaver_song_act);
		}
		$s.set_photo_url=function(photo_url){
			localStorage.facewaver_photo_url=photo_url;
		}
		$s.get_photo_url=function(){
			if(!localStorage.facewaver_photo_url){
				location='#/tab/home';
				return;
			}
			return localStorage.facewaver_photo_url;
		}

})