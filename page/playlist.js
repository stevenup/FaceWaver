ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('playlist_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$ionicModal,$ionicHistory) {

	// init
		var $s=$scope;
		ecstore.scope.playlist_ctrl=$s;
		$s.m={};
		var m=$s.m;

		m.songlist=[
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

		// m.songlist=[];
		// for(var i=0;i<3;i++){
		// 	m.songlist=m.songlist.concat(ng.copy(songlist));
		// }

		m.playlist=[
			{
				name:'Refrain',
				author:'Anan Ryoko',
				url:'song/Anan Ryoko - Refrain.mp3',
			},
			{
				name:'Calavera',
				author:'Klaas',
				url:'song/Klaas - Calavera (Original Edit)_clip.mp3',
			},
		];

		m.audio=jq('.page_songlist .audio')[0];

	//modal songlist
		$ionicModal.fromTemplateUrl('page/modal_songlist.html', {
			scope: $s
		}).then(function(modal) {
			m.modal_songlist = modal;
		});

		$s.add_to_playlist=function(){
			m.playlist=[];
			for(var i=0;i<m.songlist.length;i++){
				var song=m.songlist[i];
				if(song.act){
					m.playlist.push(ng.copy(song));
				}
			}
			$s.close_modal_songlist();
		}
		$s.close_modal_songlist=function(){
			stop();
			m.modal_songlist.hide();
		}
		$s.show_modal_songlist=function(){
			stop();
			for(var i=0;i<m.songlist.length;i++){
				var song_of_songlist=m.songlist[i];
				delete song_of_songlist.act;
				for(var j=0;j<m.playlist.length;j++){
					var song_of_playlist=m.playlist[j];
					if(song_of_songlist.name==song_of_playlist.name){
						song_of_songlist.act=true;
						break;
					}
				}
			}
			m.modal_songlist.show();
		}

	// function
		var stop=function(){
			m.song_playing={url:'/'};
		}

	// fn
		$s.play=function(){
			var s=this;
			m.song_playing=s.song;
		}
		$s.stop=function(){
			var s=this;
			stop();
		}
		$s.song_of_playlist_click=function(){
			var s=this;
			$s.set_song_act(ng.copy(s.song));
			$ionicHistory.nextViewOptions({
				disableAnimate:true,
			})
			location='#/tab/facewaver';
		}

	
})