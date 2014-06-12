var Grapes = function( vinePositions, scale, color){
	//a bunch of grapes 
  populateVine(); 
  function populateVine(){
    var vinePosition = _.sample(vinePositions);
    vinePositions.splice(vinePositions.indexOf(vinePosition), 1)
    paintBushel(vinePosition, scale, color);
    setTimeout(function(){
      if(vinePositions.length > 0){
        populateVine();
      }
    }, 100)
      
  }
}
  
function paintBushel(position, scale, color){

  var brush = brushFactory.createGrapeBrush();
  brush.material.color = color;
  brush.scale.set(scale, scale, scale);
  var opacity = brush.material.opacity;
  var scale = scale;
  brush.scale.multiplyScalar(scale);
  brush.position = position.clone();
  brush.scale.x = scale * 0.7
  brush.visible = true
  var radius = brush.geometry.boundingSphere.radius * scale;
  //Use recursive algorithms to create grapes- nucleus's which others spawn from
  var nucleus = {position: brush.position.clone(), radius: brush.geometry}
  var numGrapes = 10;
  var thetaLength = Math.PI * 2;
  var points  = [];
  for(var i =0; i < numGrapes; i++){
    var segment = 0 + i / numGrapes * thetaLength;
      var x = Math.cos(segment) * (radius) + brush.position.x;
      var y = Math.sin(segment) * (radius) * 1.5 + brush.position.y;
      points.push(new THREE.Vector2(x, y));
      x = Math.cos(segment) * (radius * 2) + brush.position.x;
      y = Math.sin(segment) * (radius*2) * 1.5 + brush.position.y;
      points.push(new THREE.Vector2(x, y));
      if(Math.random() > 0.5){
        x = Math.cos(segment) * (radius * 3) + brush.position.x;
        y = Math.sin(segment) * (radius*3) * 1.5 + brush.position.y;
        points.push(new THREE.Vector2(x, y));
      }
      // x = Math.cos(segment) * (radius * 4) + brush.position.x;
      // y = Math.sin(segment) * (radius*4) * 1.5 + brush.position.y;
      // points.push(x, y);

  }

  //just to let first stroke render in right spot
  setTimeout(function(){
    spawnGrape();
  }, 10)
  function spawnGrape(){
    //pick any angle
    var point = _.sample(points);
    points.splice(points.indexOf(point), 1);
    brush.position.set(point.x, point.y, 0);
    var tempColor = color.clone();
    tempColor.r += randFloat(-.1, .1)
    tempColor.b += randFloat(-.1, .1)
    var tempScale = scale + randFloat(-.1, .1);
    brush.scale.set(tempScale * 0.8, tempScale, tempScale);
    brush.material.color = tempColor;
    brush.material.opacity = opacity + randFloat(-.3, 0.3);
    // brush.position.x += randFloat(-.2, .2)
    // brush.position.y += randFloat(-.2, .2)
    setTimeout(function(){
      if(points.length > 0){
        spawnGrape();
      }
      //We've finished this vine, now remove brush
      else{
        scene.remove(brush);

      }
    }, 50)

  }

}
