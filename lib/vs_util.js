
var vs={};

vs.getQueryStringByName=function(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

vs.threejs={};
vs.threejs.remove_same_point=function(buffer_geometry){
	var geometry=new THREE.Geometry().fromBufferGeometry(buffer_geometry);
	console.log(geometry.vertices.length);
	var vertices=[];
	for(var i=0,leni=geometry.vertices.length;i<leni;i++){
		var is_same=false;
		for(var j=0,lenj=vertices.length;j<lenj;j++){
			if(
				geometry.vertices[i].x==vertices[j].x
				&&geometry.vertices[i].y==vertices[j].y
				&&geometry.vertices[i].z==vertices[j].z
			){
				is_same=true;
				break;
			}
		}
		if(!is_same){
			vertices.push(ng.copy(geometry.vertices[i]));
		}
	}

	var buffer_geometry=new THREE.BufferGeometry();
	var positions=new Float32Array(vertices.length*3);
	for(var i=0,i3=0,leni=vertices.length;i<leni;i++,i3+=3){
		positions[i3]=vertices[i].x;
		positions[i3+1]=vertices[i].y;
		positions[i3+2]=vertices[i].z;
	}
	buffer_geometry.addAttribute('position',positions,3);
	return buffer_geometry;
}
vs.threejs.screen_xy=function(vector3,camera){

	var vector = vector3.clone();

	var widthHalf = (window.innerWidth/2);
	var heightHalf = (window.innerHeight/2);

	vector.project(camera);

	vector.x = ( vector.x * widthHalf ) + widthHalf;
	vector.y = - ( vector.y * heightHalf ) + heightHalf;
	vector.z = 0;

	return new THREE.Vector2(vector.x, vector.y);

};