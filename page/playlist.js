ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('playlist_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$ionicModal,$ionicHistory) {

	// init
		var $s=$scope;
		ecstore.scope.playlist_ctrl=$s;
		$s.m={};
		var m=$s.m;

		m.songlist=ec.pm.songlist;
		m.playlist=ec.pm.playlist;

		// m.audio=jq('.page_songlist .audio')[0];

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
					if(song_of_songlist.title==song_of_playlist.title){
						song_of_songlist.act=true;
						break;
					}
				}
			}
			m.modal_songlist.show();
		}

	// function
		var stop=function(){
			if(m.song_playing){
				m.audio_act.pause();
				m.audio_act.currentTime=0;
				m.song_playing=undefined;
			}
		}

	// fn
		$s.init=function(){
			// ec.api.do({method:'/api/v1/audios'})
			// .then(function(re){
			// 	if(re.data.result.status=='SUCCESS'){
			// 		var songlist=re.data.result.data;
			// 		for(var i=0;i<songlist.length;i++){
			// 			songlist[i].audio_file.url=config.url+songlist[i].audio_file.url;
			// 		}
			// 		m.songlist=m.songlist.concat(songlist);
			// 		m.songlist=m.playlist.concat(songlist);
			// 	}
			// 	else{
			// 		$ionicPopup.alert('api error');
			// 	}
			// })
		}
		$s.play=function(){
			try{
				var s=this;
				stop();
				m.song_playing=s.song;
				m.audio_act=s.audio;
				m.audio_act.play();
			}
			catch(e){
				alert(e);
			}
		}
		$s.stop=function(){
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

	// init
		$s.init();
	
})