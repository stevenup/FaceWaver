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

	// function
		var stop=function(){
			if(m.song_playing){
				m.audio_act.pause();
				m.audio_act.currentTime=0;
				m.song_playing=undefined;
			}
		}


	//fn songlist

		$s.add_to_playlist=function(){
			m.playlist=[];
			for(var i=0;i<m.songlist.length;i++){
				var song=m.songlist[i];
				if(song.act){
					m.playlist.push(ng.copy(song));
				}
			}
			$s.hide_songlist();
		}
		$s.hide_songlist=function(){
			stop();
			m.songlist_act=false;
		}
		$s.show_songlist=function(){
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
			m.songlist_act=true;
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
			$s.goto_facewaver(s.song);
		}
		$s.goto_facewaver=function(song){
			if(song){
				$s.set_song_act(ng.copy(song));
			}
			else{
				$s.set_song_act(ng.copy(m.playlist[0]));
			}
			// $ionicHistory.nextViewOptions({
			// 	disableAnimate:true,
			// })
			location='#/tab/facewaver';
		}

	// init
		$s.init();
	
})