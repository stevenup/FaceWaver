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
}]);