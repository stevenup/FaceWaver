angular.module('starter.directives', [])

.directive('gvHref', ['$location', function ($location) {
	return{
		restrict: 'A',
		link: function (scope, element, attr) {
			element.attr('style', 'cursor:pointer');
			element.on('click', function(){
				if(attr.gvHref){
					location=attr.gvHref;
					scope.$apply();
				}
			});
		}
	}
}])

.directive('gvAudio', ['$document', function($document) {
	return {
		link: function(scope, element, attr) {
			scope.audio=element[0];
		}
	};
}])

.directive('vsLoadingProgress', ['$document', function($document) {
	return {
		scope:{
			progress:'=vsLoadingProgress',
			vsLoaded:'&',
		},
		link: function(scope, element, attr) {
			var canvas=element[0];
			var ctx=canvas.getContext('2d');

			var dot1=new THREE.Vector2(6,6);
			var dot2=new THREE.Vector2(48,29);
			var dot3=new THREE.Vector2(6,54);

			var color_bg='rgb(60,60,60)';
			var color_red='rgb(163,35,148)';
			var color_blue='rgb(4,229,231)';

			ctx.lineCap='round';

			var smooth_progress=0.0;

			var draw=function(cent){
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// bg
					ctx.lineWidth=10;
					ctx.strokeStyle=color_bg;

					ctx.beginPath();
					ctx.moveTo(dot1.x,dot1.y);
					ctx.lineTo(dot2.x,dot2.y);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(dot2.x,dot2.y);
					ctx.lineTo(dot3.x,dot3.y);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(dot3.x,dot3.y);
					ctx.lineTo(dot1.x,dot1.y);
					ctx.stroke();

				// color
				ctx.lineWidth=10;

				if(cent>0&&cent<=1.0/3.0){
					var dot1_r=dot1.clone().add(dot2.clone().sub(dot1).multiplyScalar((cent-1.0/3.0*0)*3));
					ctx.beginPath();
					ctx.moveTo(dot1.x,dot1.y);
					ctx.strokeStyle=color_red;
					ctx.lineTo(dot1_r.x,dot1_r.y);
					ctx.stroke();
				}
				else if(cent>1.0/3.0*0){
					ctx.beginPath();
					ctx.moveTo(dot1.x,dot1.y);
					ctx.strokeStyle=color_red;
					ctx.lineTo(dot2.x,dot2.y);
					ctx.stroke();
				}


				if(cent>1.0/3.0&&cent<=1.0/3.0*2.0){
					var dot2_r=dot2.clone().add(dot3.clone().sub(dot2).multiplyScalar((cent-1.0/3.0*1)*3));
					ctx.beginPath();
					var gradient=ctx.createLinearGradient(dot2.x,dot2.y,dot3.x,dot3.y);
					gradient.addColorStop("0",color_red);
					gradient.addColorStop(".1",color_red);
					gradient.addColorStop(".7",color_blue);
					gradient.addColorStop("1.0",color_blue);
					ctx.strokeStyle=gradient;
					ctx.moveTo(dot2.x,dot2.y);
					ctx.lineTo(dot2_r.x,dot2_r.y);
					ctx.stroke();
				}
				else if(cent>1.0/3.0*1){
					ctx.beginPath();
					var gradient=ctx.createLinearGradient(dot2.x,dot2.y,dot3.x,dot3.y);
					gradient.addColorStop("0",color_red);
					gradient.addColorStop(".1",color_red);
					gradient.addColorStop(".7",color_blue);
					gradient.addColorStop("1.0",color_blue);
					ctx.strokeStyle=gradient;
					ctx.moveTo(dot2.x,dot2.y);
					ctx.lineTo(dot3.x,dot3.y);
					ctx.stroke();
				}

				if(cent>1.0/3.0*2.0&&cent<=1.0/3.0*3.0){
					var dot3_r=dot3.clone().add(dot1.clone().sub(dot3).multiplyScalar((cent-1.0/3.0*2)*3));
					ctx.beginPath();
					ctx.moveTo(dot3.x,dot3.y);
					ctx.strokeStyle=color_blue;
					ctx.lineTo(dot3_r.x,dot3_r.y);
					ctx.stroke();
				}
				else if(cent>1.0/3.0*2){
					ctx.beginPath();
					ctx.moveTo(dot3.x,dot3.y);
					ctx.strokeStyle=color_blue;
					ctx.lineTo(dot1.x,dot1.y);
					ctx.stroke();
				}
			}

			draw(0.0);

			var step=function(){
				if(smooth_progress<scope.progress){
					smooth_progress+=0.008;
					draw(smooth_progress);
				}
				if(smooth_progress<1.0){
					requestAnimationFrame(step);
				}
				else if(smooth_progress>=1.0){
					scope.vsLoaded();
				}
				// console.log('step');
			}
			requestAnimationFrame(step);





		}
	};
}])

.directive('vsLoadingRepeat', ['$document', function($document) {
	return {
		link: function(scope, element, attr) {
			var canvas=element[0];
			var ctx=canvas.getContext('2d');

			var dot1=new THREE.Vector2(6,6);
			var dot2=new THREE.Vector2(48,29);
			var dot3=new THREE.Vector2(6,54);

			var color_bg='rgb(60,60,60)';
			var color_red='rgb(163,35,148)';
			var color_blue='rgb(4,229,231)';

			ctx.lineCap='round';

			var smooth_progress=0.0;

			var draw=function(cent){
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// bg
					ctx.lineWidth=10;
					ctx.strokeStyle=color_bg;

					ctx.beginPath();
					ctx.moveTo(dot1.x,dot1.y);
					ctx.lineTo(dot2.x,dot2.y);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(dot2.x,dot2.y);
					ctx.lineTo(dot3.x,dot3.y);
					ctx.stroke();

					ctx.beginPath();
					ctx.moveTo(dot3.x,dot3.y);
					ctx.lineTo(dot1.x,dot1.y);
					ctx.stroke();

				// color
				ctx.lineWidth=10;

				if(cent>0&&cent<=1.0/3.0){
					var dot1_r=dot1.clone().add(dot2.clone().sub(dot1).multiplyScalar((cent-1.0/3.0*0)*3));
					ctx.beginPath();
					ctx.moveTo(dot1.x,dot1.y);
					ctx.strokeStyle=color_red;
					ctx.lineTo(dot1_r.x,dot1_r.y);
					ctx.stroke();
				}
				else if(cent>1.0/3.0*0){
					ctx.beginPath();
					ctx.moveTo(dot1.x,dot1.y);
					ctx.strokeStyle=color_red;
					ctx.lineTo(dot2.x,dot2.y);
					ctx.stroke();
				}


				if(cent>1.0/3.0&&cent<=1.0/3.0*2.0){
					var dot2_r=dot2.clone().add(dot3.clone().sub(dot2).multiplyScalar((cent-1.0/3.0*1)*3));
					ctx.beginPath();
					var gradient=ctx.createLinearGradient(dot2.x,dot2.y,dot3.x,dot3.y);
					gradient.addColorStop("0",color_red);
					gradient.addColorStop(".1",color_red);
					gradient.addColorStop(".7",color_blue);
					gradient.addColorStop("1.0",color_blue);
					ctx.strokeStyle=gradient;
					ctx.moveTo(dot2.x,dot2.y);
					ctx.lineTo(dot2_r.x,dot2_r.y);
					ctx.stroke();
				}
				else if(cent>1.0/3.0*1){
					ctx.beginPath();
					var gradient=ctx.createLinearGradient(dot2.x,dot2.y,dot3.x,dot3.y);
					gradient.addColorStop("0",color_red);
					gradient.addColorStop(".1",color_red);
					gradient.addColorStop(".7",color_blue);
					gradient.addColorStop("1.0",color_blue);
					ctx.strokeStyle=gradient;
					ctx.moveTo(dot2.x,dot2.y);
					ctx.lineTo(dot3.x,dot3.y);
					ctx.stroke();
				}

				if(cent>1.0/3.0*2.0&&cent<=1.0/3.0*3.0){
					var dot3_r=dot3.clone().add(dot1.clone().sub(dot3).multiplyScalar((cent-1.0/3.0*2)*3));
					ctx.beginPath();
					ctx.moveTo(dot3.x,dot3.y);
					ctx.strokeStyle=color_blue;
					ctx.lineTo(dot3_r.x,dot3_r.y);
					ctx.stroke();
				}
				else if(cent>1.0/3.0*2){
					ctx.beginPath();
					ctx.moveTo(dot3.x,dot3.y);
					ctx.strokeStyle=color_blue;
					ctx.lineTo(dot1.x,dot1.y);
					ctx.stroke();
				}
			}


			var step=function(){
				if(smooth_progress>1.0){
					smooth_progress=0.0;
					draw(smooth_progress);
				}
				else{
					smooth_progress+=0.008;
					draw(smooth_progress);
				}
				requestAnimationFrame(step);
			}
			requestAnimationFrame(step);





		}
	};
}])