var Village = function(endingLight){
  var endingLight = endingLight;
  var churchWidth = 50;
  var startChurchX= rightScreen - 60
  var endChurchX = startChurchX + churchWidth;

  var particleGroup = new SPE.Group({
    texture: new THREE.ImageUtils.loadTexture('assets/point.png'),
    maxAge: 30,
  });
  var groupTick = false;

  var currentHouseIndex =0;
  

  var housePositions = [];
  var numHouses = 5
  for(var x  = startChurchX; x < endChurchX; x+=10){
    var y = Math.sin(x) * 4;
    housePositions.push(new THREE.Vector3(x, y, 0));
  }

  //paint lots of house
  paintHouse();
  paintChurch();
  // var circleCenter = new THREE.Vector3(rightScreen - radius -15, skyHeight - radius - 1 );

  function paintChurch(){
    var firstTime = true;
    var firstTimeTower = true;
    var brushRadius = 0.08
    var brush = createHouseBrush(brushRadius);
    brush.position.set((startChurchX + endChurchX)/2, skyHeight+.4,0);
    brush.material.color.setHex(0x4e3620);
    brush.visible = true;
    brush.scale.x = 200
    var glassPos1 = new THREE.Vector3(startChurchX + brushRadius * brush.scale.x + 2, skyHeight + 10, 0);
    var glassPos2 = new THREE.Vector3(glassPos1.x + 14, skyHeight + 10, 0);
    paintStainedGlass(glassPos1);
    paintStainedGlass(glassPos2);
    groupTick = true;

    var csd = {
      y: brush.position.y

    }
    var fsd = {
      y: csd.y + 40
    }
    var roofPoint = (csd.y + fsd.y) * 0.57;
    var towerPoint = csd.y + 14;

    var strokeTween = new TWEEN.Tween(csd).
      to(fsd, 9000).
      easing(TWEEN.Easing.Quadratic.In).
      onUpdate(function(){
        brush.position.y = csd.y
        brush.material.color.offsetHSL(0, 0, .0002);
        if(csd.y > towerPoint && csd.y<roofPoint && firstTimeTower){
          brush.scale.x = 30
          firstTimeTower = false;
          brush.material.color.offsetHSL(randFloat(-.1, .1), 0, 0);
        }
        if(csd.y > roofPoint){
          if(firstTime){
            brush.material.color.setHex(0x432a22);
            brush.material.color.offsetHSL(0, .2, 0)
            firstTime = false;
          }
          brush.scale.x -= 0.6;
        }
      }).start();
  }

  function paintHouse(){
  	//pick a random point in the points array
  	var point = housePositions[currentHouseIndex]
  	var brush = createHouseBrush(.02);
  	brush.position.set(point.x, point.y + 1, 0);
    brush.visible = true;

  	var csd = {
  		y: brush.position.y,
  	}
  	var fsd = {
  		y: csd.y + 4,
  	}
    var roofColor = new THREE.Color(0x6d1403)
    var firstTime = true;
    var roofStart = (csd.y + fsd.y)/2;
  	var strokeTween = new TWEEN.Tween(csd).
  	  to(fsd, 3000).
  	  onUpdate(function(){
  	  	brush.position.y = csd.y;
        //we're greater than halfway so make roof
        if(csd.y > roofStart){
          if(firstTime){
            brush.material.color = roofColor
            firstTime = false;
          }
          brush.scale.x -=.6
        }
  	  }).start();

      strokeTween.onComplete(function(){
        currentHouseIndex++;
        if(currentHouseIndex < housePositions.length){
          paintHouse();
        }
      });
  }

  function createHouseBrush(radius){
    var brushGeo = new THREE.CircleGeometry(radius, 20);
    var color = new THREE.Color(0x704e0d);
    color.offsetHSL(randFloat(-.1, 0.01), randFloat(-.01, 0.01), 0);

    var brushMat = new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.6});
    var brush = new THREE.Mesh(brushGeo, brushMat);
    brush.scale.x = 70.
    brush.visible = false;
    scene.add(brush);
    return brush;
  }


  this.update = function(){
    if(!groupTick)return
    particleGroup.tick();
  }

  function createParams(position){
  var colorStart= new THREE.Color().setHSL(Math.random(), 1, 0.5); 
  var colorMiddle= new THREE.Color().setHSL(Math.random(), 1, 0.5);
  var colorEnd= new THREE.Color().setHSL(Math.random(), 1, 0.5);
  return {
    position: position,
    positionSpread: new THREE.Vector3(Math.random(), Math.random(), 0),
    velocitySpread: new THREE.Vector3(randFloat(.05, .1), randFloat(.025, .05), 0),
    accelerationSpread: new THREE.Vector3(.01, .01, 0),
    colorStart: colorStart,
    colorMiddle: colorMiddle,
    colorEnd: colorEnd,
    particleCount: 500,
    sizeStart: 1,
    sizeMiddle:1,
    sizeEnd: 20,
    opacityStart: 0.01
    
  }
}
function paintStainedGlass(position){
  var numEmitters = 3;
  var emitter1 = new SPE.Emitter(createParams(position));
  var emitter2 = new SPE.Emitter(createParams(position));
  emitter2.disable()
  var emitter3 = new SPE.Emitter(createParams(position));
  emitter3.disable();
  var emitter4 = new SPE.Emitter(createParams(position));
  emitter4.disable();

  setTimeout(function(){
    emitter2.enable();
    emitter1.disable()
  }, 5000);
  setTimeout(function(){
    emitter3.enable();
    emitter2.disable();
  }, 10000)
   setTimeout(function(){
    emitter4.enable();
    emitter3.disable();
  }, 14000)


  particleGroup.addEmitter(emitter1);
  particleGroup.addEmitter(emitter2);
  particleGroup.addEmitter(emitter3);
  scene.add(particleGroup.mesh);

}

}