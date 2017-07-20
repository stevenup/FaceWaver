ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('upload_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.upload_ctrl=$s;
		$s.m={};
		var m=$s.m;

		m.is_uploaded=false;

	// cropper
		m.cropper={};

		$s.cropper_load_photo=function(input){

			try{
				m.cropper.cropper.destroy();
			}
			catch(e){}

			var img=jq('.cropper_img')[0];
			img.src=URL.createObjectURL(input.files[0]);
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
			var url=cropper_result_canvas.toDataURL();
			ec.pm.photo_data_url=url;
			location='#/tab/facewaver';
		}

	
})