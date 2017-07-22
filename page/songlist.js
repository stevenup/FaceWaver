ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('songlist_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.songlist_ctrl=$s;
		$s.m={};
		var m=$s.m;

		m.songs=[
			{
				name:'Refrain',
				author:'Anan Ryoko',
				url:'song/Anan Ryoko - Refrain.mp3',
			},
			{
				name:'Rage',
				author:'B Brightz,Julian Jordan,Firebeatz ',
				url:'song/B Brightz,Julian Jordan,Firebeatz - Rage(B Brightz Remix).mp3',
			},
			{
				name:'Calavera',
				author:'Klaas',
				url:'song/Klaas - Calavera (Original Edit)_clip.mp3',
			},
		]

		m.audio=jq('.page_songlist .audio')[0];

	// fn
		$s.play=function(){
			var s=this;
			m.song_playing=s.song;
		}
		$s.pause=function(){
			var s=this;
			m.song_playing={url:'/'};
		}

	
})