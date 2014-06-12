var Sky = function(startingLight, endingLight){
  var strokeRange = 15;
  var skyBaseColor = new THREE.Color(0x01837f);
  var brush = brushFactory.createSkyBrush();
  brush.position.x = -1000
  var colors = [];



  firstLayer();

  function firstLayer(){
    //decide how much r and g to decrease by in total
    var rAdd = randFloat(0, 0.007);
    var gSub = randFloat(0, 0.004);
    var radius = 20;
    var hsl;
    var layerBrush = brushFactory.createLayerBrush(skyBaseColor, radius);
    layerBrush.position.y = (topScreen-skyHeight)/2 + radius/2;
    var csd = {
      x: leftScreen-10,
      light: layerBrush.material.color.getHSL().l
    };
    var fsd = {
      x: rightScreen,
      light: endingLight
    }
    var strokeTween = new TWEEN.Tween(csd).
      to(fsd, baseLayerTime).
      onUpdate(function(){
        var hsl = layerBrush.material.color.getHSL()
        layerBrush.material.color.setHSL(hsl.h, hsl.s, csd.light);
        layerBrush.material.color.r += rAdd;
        layerBrush.material.color.g -= gSub;
        colors.push(layerBrush.material.color.clone());


        layerBrush.position.x = csd.x;
      }).start();
      strokeTween.onComplete(function(){
        scene.remove(layerBrush);
        // stroke();
      });
  }

	//pick random points close to each other
	function stroke(){
    brush.material.color = _.sample(brush.colors);
    var csd = {
      x:randFloat(leftScreen, rightScreen),
      y: randFloat(skyHeight, topScreen)
    }
    var fsd = {
      x: csd.x + randFloat(-strokeRange, strokeRange),
      y: csd.y + randFloat(-strokeRange, strokeRange)
    }
    brush.visible = true;
    var strokeTween = new TWEEN.Tween(csd).
      to(fsd, 100).
      onUpdate(function(){
        csd.y = Math.max(skyHeight + 5, csd.y)

        brush.position.set(csd.x, csd.y, 0);
      }).start();
    strokeTween.onComplete(function(){
      stroke();
    })

	}

  this.colors = colors;
  
}