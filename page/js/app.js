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

	// if(!localStorage.nzapp_is_new_starter||localStorage.nzapp_is_new_starter==true){
	// 	location='#/tab/starter';
	// 	localStorage.nzapp_is_new_starter=false;
	// }
	// else{
		// location='#/tab/home';
	// }

	if(config.is_test){
		
	}
	else{
		location='#/tab/home';
	}


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

		// is use weixin

			if(config.is_test){
				ec.pm.is_use_weixin=1;
			}
			else{

				ec.pm.is_use_weixin=1;
				
				if(ionic.Platform.platform()=='ios'){

					// ec.api.do({method:'ecapp.setting.get_app_info'})
					// .then(function(re){
					// 	if(re.data.rsp=='succ'){
					// 		ec.pm.is_use_weixin=re.data.data.is_use_weixin;
					// 	}
					// })

					if(window.wxpay){
						wxpay.payment({
								// appid: 'wx56d0c3bf83db50e5',
							},
							function(succ) { 
								// alert('succ callback');
								// alert(succ);
								// ec.pm.is_use_weixin=1;
							},
							function(fail){
								// alert('fail callback');
								// alert(fail);
								ec.pm.is_use_weixin=0;
							},
							'hasInstalledWeChat'
						);
					}

				}
			}

		// jpush official 推送通知插件
		(function(){
		    var onDeviceReady = function() {
		        // alert("JPushPlugin:Device ready!");
		        initiateUI();
		    };
		    var getRegistrationID = function() {
		        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
		    };
		    var onGetRegistrationID = function(data) {
		    	// alert('onGetRegistrationID');
		        try {
		            // alert("JPushPlugin:registrationID is " + data);
		            if (data.length == 0) {
		                var t1 = window.setTimeout(getRegistrationID, 1000);
		            }
		            // alert(data);
		        } catch (exception) {
		            // alert(exception);
		        }
		    };
		    var onTagsWithAlias = function(event) {
		    	// alert('onTagsWithAlias');
		        try {
		            // alert("onTagsWithAlias");
		            var result = "result code:" + event.resultCode + " ";
		            result += "tags:" + event.tags + " ";
		            result += "alias:" + event.alias + " ";
		            // alert(result);
		        } catch (exception) {
		            // alert(exception)
		        }
		    };
		    var onOpenNotification = function(event) {
		    	// alert('onOpenNotification');
		        try {
		            var alertContent;
		            if (device.platform == "Android") {
		                alertContent = event.alert;
		            } else {
		                alertContent = event.aps.alert;
		            }
		            // alert("open Notification:" + alertContent);
		        } catch (exception) {
		            // alert("JPushPlugin:onOpenNotification" + exception);
		        }
		    };
		    var onReceiveNotification = function(event) {
		    	// alert('onReceiveNotification');
		        try {
		            var alertContent;
		            if (device.platform == "Android") {
		                alertContent = event.alert;
		            } else {
		                alertContent = event.aps.alert;
		            }
		            // alert(alertContent);

		            store_message(alertContent);

		        } catch (exception) {
		            // alert(exception)
		        }
		    };
		    var onReceiveMessage = function(event) {
		    	// alert('onReceiveMessage');
		        try {
		            var message;
		            if (device.platform == "Android") {
		                message = event.message;
		            } else {
		                message = event.content;
		            }
		            // alert(message);
		        } catch (exception) {
		            // alert("JPushPlugin:onReceiveMessage-->" + exception);
		        }
		    };
		    var initiateUI = function() {
		    	// alert('initiateUI');
		        try {
		            window.plugins.jPushPlugin.init();
		            window.setTimeout(getRegistrationID, 1000);
		            if (device.platform != "Android") {
		                window.plugins.jPushPlugin.setDebugModeFromIos();
		                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
		            } else {
		                window.plugins.jPushPlugin.setDebugMode(true);
		                window.plugins.jPushPlugin.setStatisticsOpen(true);
		            }
		        } catch (exception) {
		            // alert(exception);
		        }
		        // $("#setTagWithAliasButton").click(function(ev) {
		        //     try {
		        //         var tag1 = $("#tagText1").attr("value");
		        //         var tag2 = $("#tagText2").attr("value");
		        //         var tag3 = $("#tagText3").attr("value");
		        //         var alias = $("#aliasText").attr("value");
		        //         var tags = [];
		        //         if (tag1 != "") {
		        //             tags.push(tag1);
		        //         }
		        //         if (tag2 != "") {
		        //             tags.push(tag2);
		        //         }
		        //         if (tag3 != "") {
		        //             tags.push(tag3);
		        //         }
		        //         window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
		        //     } catch (exception) {
		        //         alert(exception);
		        //     }
		        // })
		    };
		    document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
		    document.addEventListener("deviceready", onDeviceReady, false);
		    document.addEventListener("jpush.openNotification", onOpenNotification, false);
		    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
		    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);

		    var store_message=function(alertContent){
			    var messages=[];
			    if(localStorage.nzapp_messages){
			    	messages=JSON.parse(localStorage.nzapp_messages);
			    }
			    messages.unshift({
			    	content:alertContent,
			    	receive_time:new Date().getTime(),
			    })
			    messages=messages.slice(0,10);
			    localStorage.nzapp_messages=JSON.stringify(messages);
			    localStorage.nzapp_is_new_message=true;
		    }
		})();

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
		templateUrl: 'page/tab.html',
		controller:'tabCtrl',
	})

	// .state('tab.starter', {
	// 	// url: '/starter?need_login',
	// 	url: '/starter',
	// 	views: {
	// 		'tab-home': {
	// 			templateUrl: 'page/starter.html',
	// 			controller: 'StarterCtrl'
	// 		}
	// 	}
	// })

	.state('tab.home', {
		url: '/home',
		views: {
			'tab-home': {
				templateUrl: 'page/home.html',
				controller: 'HomeCtrl'
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
