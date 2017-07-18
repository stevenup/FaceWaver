
var jq=jQuery;

// // clear.cache
// 	document.addEventListener('deviceready', function{
// 	    var success = function(status) {
// 	        alert('Message: ' + status);
// 	    }

// 	    var error = function(status) {
// 	        alert('Error: ' + status);
// 	    }

// 	    window.cache.clear( success, error );
// 	});

var ecstore={};
ecstore.scope={};

var ng=angular;
var ngs=function(elem){
return angular.element(elem).scope();
}

// 抛物线动画类
var funParabola=function(element, target, options) {
	/*
	 * 网页模拟现实需要一个比例尺
	 * 如果按照1像素就是1米来算，显然不合适，因为页面动不动就几百像素
	 * 页面上，我们放两个物体，200~800像素之间，我们可以映射为现实世界的2米到8米，也就是100:1
	 * 不过，本方法没有对此有所体现，因此不必在意
	*/
	
	var defaults = {
		// speed: 16.67, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
		speed: 32, // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
		curvature: 0.02,  // 实际指焦点到准线的距离，你可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
		progress: function() {},
		complete: function() {}
	};
	
	var params = {}; options = options || {};
	
	for (var key in defaults) {
		params[key] = options[key] || defaults[key];
	}
	
	var exports = {
		mark: function() { return this; },
		position: function() { return this; },
		move: function() { return this; },
		init: function() { return this; }
	};
	
	/* 确定移动的方式 
	 * IE6-IE8 是margin位移
	 * IE9+使用transform
	*/
	var moveStyle = "margin", testDiv = document.createElement("div");
	if ("oninput" in testDiv) {
		["", "ms", "webkit"].forEach(function(prefix) {
			var transform = prefix + (prefix? "T": "t") + "ransform";
			if (transform in testDiv.style) {
				moveStyle = transform;
			}
		});   
	}
	
	// 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）
	/* 公式： y = a*x*x + b*x + c;
	*/
	var a = params.curvature, b = 0, c = 0;
	
	// 是否执行运动的标志量
	var flagMove = true;
	
	if (element && target && element.nodeType == 1 && target.nodeType == 1) {
		var rectElement = {}, rectTarget = {};
		
		// 移动元素的中心点位置，目标元素的中心点位置
		var centerElement = {}, centerTarget = {};
		
		// 目标元素的坐标位置
		var coordElement = {}, coordTarget = {};
		
		// 标注当前元素的坐标
		exports.mark = function() {
			if (flagMove == false) return this;
			if (typeof coordElement.x == "undefined") this.position();
			element.setAttribute("data-center", [coordElement.x, coordElement.y].join());
			target.setAttribute("data-center", [coordTarget.x, coordTarget.y].join());
			return this;
		}
		
		exports.position = function() {
			if (flagMove == false) return this;
			
			var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
				scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			
			// 初始位置
			if (moveStyle == "margin") {
				element.style.marginLeft = element.style.marginTop = "0px";
			} else {
				element.style[moveStyle] = "translate(0, 0)";
			}
			
			// 四边缘的坐标
			rectElement = element.getBoundingClientRect();
			rectTarget = target.getBoundingClientRect();
			
			// 移动元素的中心点坐标
			centerElement = {
				x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
				y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
			};
			
			// 目标元素的中心点位置
			centerTarget = {
				x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
				y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop    
			};
			
			// 转换成相对坐标位置
			coordElement = {
				x: 0,
				y: 0  
			};
			coordTarget = {
				x: -1 * (centerElement.x - centerTarget.x),
				y:  -1 * (centerElement.y - centerTarget.y) 
			};
			
			/*
			 * 因为经过(0, 0), 因此c = 0
			 * 于是：
			 * y = a * x*x + b*x;
			 * y1 = a * x1*x1 + b*x1;
			 * y2 = a * x2*x2 + b*x2;
			 * 利用第二个坐标：
			 * b = (y2+ a*x2*x2) / x2
			*/
			// 于是
			b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x;  
			
			return this;
		};    
		
		// 按照这个曲线运动
		exports.move = function() {
			// 如果曲线运动还没有结束，不再执行新的运动
			if (flagMove == false) return this;
			
			var startx = 0, rate = coordTarget.x > 0? 1: -1;

			var step = function() {
				// 切线 y'=2ax+b
				var tangent = 2 * a * startx + b; // = y / x
				// y*y + x*x = speed
				// (tangent * x)^2 + x*x = speed
				// x = Math.sqr(speed / (tangent * tangent + 1));
				startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1));
				
				// 防止过界
				if ((rate == 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
					startx = coordTarget.x;
				}
				var x = startx, y = a * x * x + b * x;
				
				// 标记当前位置，这里有测试使用的嫌疑，实际使用可以将这一行注释
				// element.setAttribute("data-center", [Math.round(x), Math.round(y)].join());
				
				// x, y目前是坐标，需要转换成定位的像素值
				if (moveStyle == "margin") {
					element.style.marginLeft = x + "px";
					element.style.marginTop = y + "px";
				} else {
					element.style[moveStyle] = "translate("+ [x + "px", y + "px"].join() +")";
				}
				
				if (startx !== coordTarget.x) {
					params.progress(x, y);
					window.requestAnimationFrame(step); 
				} else {
					// 运动结束，回调执行
					params.complete();
					flagMove = true;  
				}
			};
			window.requestAnimationFrame(step);
			flagMove = false;
			
			return this;
		};
		
		// 初始化方法
		exports.init = function() {
			this.position().mark().move();
		};
	}
	
	return exports;
};

// dynamic load js css file
function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

//regin_Data
JSON.decode=function(data){//覆盖 /data/misc/region_data.js 里的 JSON.decode 方法，让它什么都不做
	return data;
}
// loadjscssfile(config.url+'/data/misc/region_data.js','js');
// loadjscssfile('page/js/region_data.js','js');

// //微信支付结果回调接收
// function wxresults(data){

// 	//  data           = 0,    /**< 成功    */
// 	//  data     = -1,   /**< 普通错误类型    */
// 	//  data = -2,   /**< 用户点击取消并返回    */
// 	//  data   = -3,   /**< 发送失败    */
// 	//  data   = -4,   /**< 授权失败    */
// 	// data  = -5,   /**< 微信不支持    */

// 	// var element = document.getElementById('wxpaytxt');
// 	// element.innerHTML = "微信支付结果:"+data;

// 	  // alert(data);
// 	if(data==0){
// 		ecstore.scope.payments.ec_pay_api('tenpay');
// 	}
// 	else{
// 		ecstore.scope.payments.wxpay_fail(data);
// 	}

// }

// zf 推送通知插件
	// function show_push(content){
	//     //h5自定义操作
	//     // alert(content);
	//     var messages=[];
	//     if(localStorage.nzapp_messages){
	//     	messages=JSON.parse(localStorage.nzapp_messages);
	//     }
	//     messages.unshift({
	//     	content:content,
	//     	receive_time:new Date().getTime(),
	//     })
	//     messages=messages.slice(0,10);
	//     localStorage.nzapp_messages=JSON.stringify(messages);
	// }

