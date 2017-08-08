// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
	'ionic',
	'starter.controllers',
	'starter.services',
	'starter.directives',
])

.run(function($ionicPlatform,$rootScope,ec) {

	var wx_code=vs.getQueryStringByName('code');
	if(wx_code){
		localStorage.facewaver_wx_code=wx_code;
		location=location.origin+location.pathname;
	}

	// if(!localStorage.nzapp_is_new_starter||localStorage.nzapp_is_new_starter==true){
	// 	location='#/tab/starter';
	// 	localStorage.nzapp_is_new_starter=false;
	// }
	// else{
		// location='#/tab/home';
	// }


	// jq(window).resize(function(){
	// 	$rootScope.windowWidth=jq(window).width();
	// })
	// jq(window).resize();
	

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

	});
})

.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'page/tab.html?version=201708082012',
		controller:'tab_ctrl',
	})

	.state('tab.home', {
		url: '/home',
		views: {
			'tab-home': {
				templateUrl: 'page/home.html?version=201708082012',
				controller: 'home_ctrl'
			}
		}
	})




	.state('tab.facewaver', {
		url: '/facewaver',
		views: {
			'tab-home': {
				templateUrl: 'page/facewaver.html?version=201708082012',
				controller: 'facewaver_ctrl'
			}
		}
	})

	.state('tab.playlist', {
		url: '/playlist',
		views: {
			'tab-home': {
				templateUrl: 'page/playlist.html?version=201708082012',
				controller: 'playlist_ctrl'
			}
		}
	})

	// .state('tab.songlist', {
	// 	url: '/songlist',
	// 	views: {
	// 		'tab-home': {
	// 			templateUrl: 'page/songlist.html?version=201708082012',
	// 			controller: 'songlist_ctrl'
	// 		}
	// 	}
	// })

	.state('tab.upload', {
		url: '/upload',
		views: {
			'tab-home': {
				templateUrl: 'page/upload.html?version=201708082012',
				controller: 'upload_ctrl'
			}
		}
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/home');

})

.config(function ($httpProvider) {//check if is signin timeout (check all $http result)
    $httpProvider.interceptors.push('myHttpInterceptor');
})

.config(function($ionicConfigProvider){
	$ionicConfigProvider.backButton.text('');
	$ionicConfigProvider.scrolling.jsScrolling(true);
	$ionicConfigProvider.views.swipeBackEnabled(false);
	// $ionicConfigProvider.views.transition('none');
})

.constant('$ionicLoadingConfig',{
  // delay:500,
  noBackdrop:true,
  hideOnStateChange:true,
  // template:'<ion-spinner></ion-spinner><div onclick="history.go(-1)">返回</div>'
  // template:'<ion-spinner></ion-spinner><div onclick="location.reload()">刷新</div>'
  template:'<ion-spinner></ion-spinner>'
  // template:'<img src="img/loading2.gif">'
})
.config(function($sceDelegateProvider) {  
	$sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading from our assets domain. **.
	    // 'http://ergast.com/**'
	    config.url+'/**',
	]);
})