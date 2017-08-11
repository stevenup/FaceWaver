ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('upload_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading,$ionicConfig) {

	// init
		var $s=$scope;
		ecstore.scope.upload_ctrl=$s;
		$s.m={};
		var m=$s.m;

		$ionicConfig.views.swipeBackEnabled(false);
		
		m.is_uploaded=false;
		m.scale=1;

		// jq('.vs_loading_repeat_wrap').show();

	// $on
		$s.$on('$ionicView.beforeEnter',function(){
			ec.pm.page_act='upload';
		})
		$s.$on('$ionicView.beforeLeave',function(){
			ec.pm.page_act='';
		})

	// cropper
		m.cropper={};

		jq('.cropper_wrap').width(window.innerWidth);
		jq('.cropper_wrap').height(window.innerWidth);
		
		$s.scale_big=function(){
			m.scale+=0.01;
			m.cropper.cropper.scaleY(m.scale);
		}
		$s.scale_small=function(){
			m.scale-=0.01;
			m.cropper.cropper.scaleY(m.scale);
		}
		$s.photo_upload=function(input_file){
			ec.api.img_upload(input_file)
			.then(function(re){
				debugger;
			})
		}
		$s.cropper_load_input=function(input){

			try{
				m.cropper.cropper.destroy();
			}
			catch(e){}

			m.scale=1;

			var url=URL.createObjectURL(input.files[0]);
			$s.cropper_load_img(url);
		}
		$s.cropper_load_img=function(url){
			var img=jq('.cropper_img')[0];
			img.src=url;
			img.onload=function(){
				m.cropper.cropper=new Cropper(img,{
					// aspectRatio: 16 / 9,
					// dragMode:'move',
					// guides:false,
					// cropBoxMovable:false,
					// minCropBoxWidth:100,
					// minCropBoxHeight:100,
					crop: function(e) {
					},
					ready:function(){
						m.cropper.cropper.setCropBoxData({
							left:0,
							right:0,
							width:window.innerWidth,
							height:window.innerWidth,
						})
						$s.$apply(function(){
							m.is_uploaded=true;
						})
							
					}
				});
			}

		}
		$s.cropper_finish=function(){
			var cropper_result_canvas=m.cropper.cropper.getCroppedCanvas({
				width:512,
				height:512,
			});
			var context=cropper_result_canvas.getContext('2d');
			var image_data=context.getImageData(0,0,cropper_result_canvas.width,cropper_result_canvas.height);
			var result_image_data=vs.contrastImage(image_data,30);
			context.putImageData(result_image_data,0,0);
			window.a=cropper_result_canvas;
			var url=cropper_result_canvas.toDataURL();
			$s.set_photo_url(url);
			location='#/tab/playlist';
		}

	// fn
		$s.init=function(){
			var photo_url=$s.get_photo_url();
			if(photo_url){
				$s.cropper_load_img(photo_url);
			}
		}

	// init
		$s.init();
})