angular.module('starter.services', [])

.factory('ec', function($http,$ionicPopup,$q) {

	//***********************************************************************************************************************************************************************************************************************************************
	var pm={};//pm=param
	pm.url=config.url;
	pm.apiUrl=pm.url+'/index.php/api?';
	pm.apiUrlNoQuestionMark=pm.url+'/index.php/api';
	// pm.token='8f99bcbe3bea9070257e8e74581af7815ca89752d65c8f5b591febd9a7ac16a0';//果的
	pm.token='67e1a2ee70a3e1afc6de1d2e95f0083550f9f0ab46f48febc124e1a5afe196a4';//富国
	pm.api_version=201706141715;
	pm.api_version=201707151858;

	//***********************************************************************************************************************************************************************************************************************************************
	var api={};
	api.do=function(params){ 
		params.member_id=params.member_id||localStorage.nzapp_member_id;
		params.accesstoken=params.accesstoken||localStorage.nzapp_accesstoken;
		params.api_version=params.api_version||pm.api_version;
		params.app_platform=params.app_platform||ionic.Platform.platform();
		return $http({
			method: 'GET',
			url: pm.apiUrl+fn.getParams(params),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
	}
	api.get=function(params){
		params.member_id=localStorage.nzapp_member_id;
		params.accesstoken=localStorage.nzapp_accesstoken;
		params.api_version=pm.api_version;
		params.app_platform=ionic.Platform.platform();
		return $http({
			method: 'GET',
			url: pm.apiUrl+fn.getParams(params),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
	}
	api.post=function(params){ 
		params.member_id=localStorage.nzapp_member_id;
		params.accesstoken=localStorage.nzapp_accesstoken;
		params.api_version=pm.api_version;
		params.app_platform=ionic.Platform.platform();
		for(var k in params){
			if(typeof(params[k])=='undefined'||params[k]==''||params[k]==null){
				delete params[k];
			}
		}

		return $http({
			method:'POST',
			url:pm.apiUrlNoQuestionMark,
			data:fn.getParams(params),
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Accept':'*/*',
			},
		})
	}
	api.order_get_wap_order_detail=function(member_id,accesstoken,order_id){
		var params={
			method:'ecapp.order.get_wap_order_detail',
			order_id:order_id
		};
		params.member_id=localStorage.nzapp_member_id;
		params.accesstoken=localStorage.nzapp_accesstoken;
		params.api_version=pm.api_version;
		params.app_platform=ionic.Platform.platform();
		return $http({
			method: 'GET',
			url: pm.apiUrl+fn.getParams(params),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
	}
	api.payment_create=function(params){
		// var params=
		// {
		// 	method:'ecapp.payment.create',
		// 	order_bn:,   	//	string	Y	支付订单号 *
		// 	payment_id:,   	//	string	Y	支付单号 *
		// 	account:,   		//	string	N	收款账号
		// 	bank:,   		//	string	N	收款银行
		// 	pay_account:,   	//	string	N	付款账号
		// 	currency:,   	//	string	N	货币
		// 	money:,   		//	double	Y	支付金额 *
		// 	paycost:,   		//	string	N	支付网关费用
		// 	cur_money:,   	//	string	Y	支付货币金额 *
		// 	pay_type:,   	//	string	Y	支付类型(online在线支付 offline线下支付 deposit预存款支付) *
		// 	payment_tid:,   	//	string	Y	支付方式app名称 *
		// 	paymethod:,   	//	string	Y	支付接口名称 *
		// 	t_begin:,   		//	string	Y	支付开始时间 *
		// 	t_end:,   		//	string	Y	支付结束时间 *
		// 	ip:,   			//	string	Y	支付IP *
		// 	trade_no:,   	//	string	Y	支付单交易编号 *
		// }

		params.member_id=localStorage.nzapp_member_id;
		params.accesstoken=localStorage.nzapp_accesstoken;
		params.api_version=pm.api_version;
		params.app_platform=ionic.Platform.platform();
		return  $http({
			method: 'GET',
			url: pm.apiUrl+fn.getParams(params),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
	}



	//***********************************************************************************************************************************************************************************************************************************************
	var apip={};//api plus
	apip.get_payments_get_all=function(){
		var promise=api.do({
			method:'ectools.get_payments.get_all',
		});
		promise.then(function(data){
			pm.payments=data.data.data;
			pm.payment_first=pm.payments[Object.keys(pm.payments)[0]];
		})
		return promise;
	}
	apip.member_get_address=function(){
		var promise=api.do({
			method:'ecapp.member.get_address',
		});
		promise.then(function(data){
			pm.addresses={};
			//将地址数组转换成object
			if(data.data.data){
				for(var i=0;i<data.data.data.length;i++){
					pm.addresses[data.data.data[i].ship_id]=data.data.data[i];
				}
				//将默认收货地址设为选中状态
				if(!pm.addr_id_selected){
					for(key in pm.addresses){
						if(pm.addresses[key].is_default=='true'){
							pm.addr_id_selected=key;
						}
					}
					//没有默认收获地址，设置第一个收货地址为选中状态
					if(!pm.addr_id_selected){
						pm.addr_id_selected=Object.keys(pm.addresses)[0];
					}
				}
			}
		})
		return promise;
	}
	apip.member_get_cart_info=function(){
		var promise=api.do({
			method:'ecapp.member.get_cart_info',
			apply_platform:2,//2代表移动端促销规则
		});
		promise.then(function(re){
			pm.cart=re.data.data;
			pm.cart.subtotal_price=parseFloat(pm.cart.subtotal_price);
			pm.cart.order_discount=pm.cart.subtotal_goods_price-pm.cart.subtotal_price;
			// console.log(cart);
			pm.cart_total_quantity=0;
			if(pm.cart.object){
				
				//array
				// for(var i=0;i<pm.cart.object.goods.length;i++){
				// 	console.log(pm.cart.object.goods[i].quantity)
				// 	pm.cart_total_quantity+=pm.cart.object.goods[i].quantity;
				// }

				//object
				for(var key in pm.cart.object.goods){
					// console.log(pm.cart.object.goods[key].quantity)
					pm.cart_total_quantity+=pm.cart.object.goods[key].quantity;
					pm.cart.object.goods[key].single_goods_calculated_price=pm.cart.object.goods[key].price-pm.cart.object.goods[key].discount_price/pm.cart.object.goods[key].quantity;
				}
			}
		})
		return promise;
	}
	apip.member_get_dlytype=function(area_id){
		var promise=api.do({
			method:'ecapp.member.get_dlytype',
			area_id:area_id,
		});
		promise.then(function(data){
			pm.dlytypes=data.data.data;
			// console.log(pm.dlytypes);
			var dlytypes_temp={};
			for(var key in pm.dlytypes){
				dlytypes_temp[pm.dlytypes[key].dt_id]=pm.dlytypes[key];
			}
			pm.dlytypes=dlytypes_temp;
			pm.dlytype_first=pm.dlytypes[Object.keys(pm.dlytypes)[0]];
			for(var key in pm.dlytypes){
				// console.log(pm.dlytypes[key].money);
				// console.log(pm.dlytype_first.money);
				// console.log('')
				if(pm.dlytypes[key].money<pm.dlytype_first.money){
					pm.dlytype_first=pm.dlytypes[key];
				}
			}
		})
		return promise;
	}
	apip.member_get_member_info=function(){
		var promise=api.do({
			method:'ecapp.member.get_member_info',
		});
		promise.then(function(data){
			// console.log(data);
			pm.member_info=data.data.data;
		})
		return promise;
	}
	apip.member_signin=function(params){
		uname=params.uname;
		password=params.password;
		var password_encoded='';
		
		return api.do({method:'ecapp.member.get_encrypt_params',
				uname:uname,
			})
			.then(function(re){
				// debugger;
				// console.log(re);
				if(re.data.rsp=='succ'){//会员存在
					uname=re.data.data.account;
					password_encoded=fn.encode_password(password,uname,re.data.data.createtime)
					return api.do({method:'ecapp.member.signin',
						uname:uname,
						password:password_encoded,
					})
				}
				else{//include re.data.rsp=='false' 会员不存在等
					// console.log(re)
					$ionicPopup.alert({
						title: re.data.res,//include '该会员不存在'
						okText:'确认',
					});
					fn.logout();
					return $q.reject(re);
				}
			})
			.then(function(re){//signin
				// debugger;
				if(re.data.rsp=='succ'){
					if(re.data.data.status=='true'){//signin ok

						var member=re.data.data;

						fn.set_local_storage({
							uname:uname,
							password_encoded:password_encoded,
							member_id:member.member_id,
							accesstoken:member.accesstoken,
						});

						if(params.callback_promise){
							return params.callback_promise;
						}

					}
					else{//uname password error
						$ionicPopup.alert({title: re.data.data.message, okText:'确认'});
						return $q.reject(re);
					}
				}
				else{
					$ionicPopup.alert({title:re.data.res, okText:'确认', })
					return $q.reject(re);
				}
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
	ecstore.apip=apip;
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