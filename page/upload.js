ctrl

//***********************************************************************************************************************************************************************************************************************************************
.controller('upload_ctrl', function($scope,ec,$ionicPopup,$stateParams,$ionicNavBarDelegate,$ionicSlideBoxDelegate,$document,$timeout,$interval,$ionicLoading) {

	// init
		var $s=$scope;
		ecstore.scope.upload_ctrl=$s;
		$s.m={};
		var m=$s.m;

	// cropper
		m.cropper={};
		m.cropper.select_photo=function(){
			var img=document.createElement('img');
			img.src=URL.createObjectURL(input.files[0]);
			img.onload=function(){
				m.cropper.cropper=new Cropper(img,{
					// aspectRatio: 16 / 9,
					crop: function(e) {
					},
					ready:function(){
						m.cropper.cropper.setCropBoxData({
							left:0,
							right:0,
							width:window.innerWidth,
							height:window.innerWidth,
						})
					}
				});
			}
		}


	
})