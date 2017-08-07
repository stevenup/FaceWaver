angular.module('starter.services', [])

.factory('ec', function($http,$ionicPopup,$q) {

	//***********************************************************************************************************************************************************************************************************************************************
	var pm={};//pm=param


	//***********************************************************************************************************************************************************************************************************************************************
	var api={};
	api.do=function(params){ 
		return $http({
			method: 'POST',
			url: config.api_url+params.method,
			data:fn.getParams(params),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
	}
	api.img_upload=function(input_file){
		var form_data=new FormData();
		form_data.append('user_id','abc');
		form_data.append('face_pic',input_file.files[0]);
		return $http({
				method: 'POST',
	  			url: 'http://192.168.227.79:3000/api/v1/faces',
	  			url: config.api_url+'faces',
				data: form_data,
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			})
	}

	//***********************************************************************************************************************************************************************************************************************************************
	var fn={};//fn=function

	fn.set_local_storage=function(params){
		fn.logout();

		if(params.uname){localStorage.nzapp_uname=params.uname;}
		if(params.password_encoded){localStorage.nzapp_password_encoded=params.password_encoded;}

		if(params.wx_unionid){localStorage.nzapp_wx_unionid=params.wx_unionid;}

		if(params.member_id){localStorage.nzapp_member_id=params.member_id;}
		if(params.accesstoken){localStorage.nzapp_accesstoken=params.accesstoken;}

	}
	fn.logout=function(){
		delete localStorage.nzapp_uname;
		delete localStorage.nzapp_password_encoded;

		delete localStorage.nzapp_wx_unionid;

		delete localStorage.nzapp_member_id;
		delete localStorage.nzapp_accesstoken;
	}

	fn.encode_password=function(password,username,createtime){
		password=md5(md5(password)+username+createtime);
		password=password.substr(0,31);
		return 's'+password;
	}
	fn.getParams=function(params){
		// debugger;
		// params.xhprof=1;
		// console.log(params);
		// debugger;
		var result='';
		for(var k in params){
			if(typeof(params[k])==='undefined'||params[k]===''||params[k]===null){
				delete params[k];
			}
			else{
				result+=k+'='+params[k]+'&';
			}
		}
		// console.log(params);
		// debugger;
		return result+'sign='+fn.getSign(params,pm.token);
	}
	fn.getSign=function(params){
		var keys=Object.keys(params);
		keys.sort();
		var sign='';
		for(var i=0;i<keys.length;i++){
			sign+=keys[i]+params[keys[i]];
		}
		return md5(md5(sign).toUpperCase()+pm.token).toUpperCase();
	}
	fn.goto_and_check_signin=function(url){
		// if(pm.is_home_signined==false){//如果有localstorage，已经开始自动登录，但还未登录完成，则什么都不做
		// 	return;
		// }
		// 
		// if(pm.is_signin){//如果已登录
			// debugger
		if(
			(localStorage.nzapp_uname&&localStorage.nzapp_password_encoded)
			||localStorage.nzapp_wx_unionid
		){//如果已登录
			location=url;
		}
		else{//如果未登录
			location='#/tab/signin';
		}
	}
	fn.unicodeEncode=function(str) {
		var res=[];
		for(var i=0;i < str.length;i++)
				res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
		return "\\u"+res.join("\\u");
	}
	fn.parseEscapedJSON=function(json){
		json=json.replace('\\"','"');
		json=json.replace('\\\\','\\');
		return JSON.parse(json);
	}

	//***********************************************************************************************************************************************************************************************************************************************
	ecstore.api=api;
	ecstore.fn=fn;
	ecstore.pm=pm;

	return ecstore;
})

.factory('myHttpInterceptor', function ($q) {//check if is signin timeout (check all $http results)
	return {
		response: function (response) {
			// debugger;
			// console.log(response.headers());
			// do something on success
			if(response.headers()['content-type'] === "text/html"){
				// Validate response, if not ok reject
				// var data = examineJSONResponse(response); // assumes this function is available
				// console.log(response)

				if(response.data.data=='accesstoken fail'){
					console.log('accesstoken fail');
					debugger;
					location.reload();
					// location='#/tab/signin';
						// return $q.reject(response);
				}
			}
			return response;
		},
		responseError: function (response) {
			// do something on error
			return $q.reject(response);
		}
	};
})