    // let resize = function(w, h, type) {
    //   if(isNaN(w) || isNaN(h))
    //   {
    //       return;
    //   }
    //   gameWrapper.scale.x = 1;
    //   gameWrapper.scale.y = 1;

    //   gameWrapper.width   = w;
    //   gameWrapper.scale.y = gameWrapper.scale.x;

    //   if(gameWrapper.height < h)
    //   {
    //     gameWrapper.height  = h;
    //     gameWrapper.scale.x = gameWrapper.scale.y;
    //   }
    //   gameWrapper.x = (w /2);
    //   gameWrapper.y = (h /2);

    //   ///////////////////////////////////////////
    //   var topScale    = w / 1020;
    //   var sideScale   = w / 1450;
    //   var bottomScale = w / (type != 'portrait' ? 1450 : 650);
    //   var offset      = type == "" ? 0 : 20;

    //   topScale    = topScale    > 1 ? 1 : topScale;
    //   sideScale   = sideScale   > 1 ? 1 : sideScale;
    //   bottomScale = bottomScale > 1 ? 1 : bottomScale;

    //   var maxWidth   = ((gameField.size.x + (gameField.container.container.gap * 2)) * gameField.container.container.maxSize.x);
    //   var maxHeight  = ((gameField.size.y + (gameField.container.container.gap * 2)) * gameField.container.container.maxSize.y);
    //   // var scale      = Math.min((maxWidth>w) ? w / maxWidth : 1,(maxHeight>h) ? h / maxHeight : 1);
    //   var scale      = Math.min((maxWidth>w) ? w / maxWidth - 0.05: 1,(maxHeight>h) ? h / maxHeight - 0.05 : 1);
    //   // var takenCont  = props.container.takenContainer;

    //   // playerCont.view().scale.set(scale,scale);
    //   // playerCont.view().x = (w/2);
    //   // playerCont.view().y = ((h - ((props.card.size.y * scale)/2))) - ((120+offset) * bottomScale);

    // }





























    //     let size = [1920, 1080];
// let ratio = size[0] / size[1];
// let renderer = pixi.autoDetectRenderer();
// let RenderTexture = pixi.RenderTexture.create({ width: size[0], height:size[1] })
// document.body.appendChild(renderer.view);
//     const r1 = new pixi.Graphics();
//     r1.beginFill(0x00ffff);
//     r1.drawRect(0, 0, 100, 100);
//     r1.endFill();
//   renderer.render(r1);
//   let block = new pixi.Sprite(RenderTexture);
//   block.position.x = 100;
//   block.position.y = 100;
//   block.anchor.x = .5;
//   block.anchor.y = .5;
//   app.stage.addChild(block);
//   requestAnimationFrame(animate);
//   resize();

//     function animate() {
//       requestAnimationFrame(animate);
//       block.rotation += .01;
//       renderer.render(app.stage);
//   }

  //   function resize() {
  //     if (window.innerWidth / window.innerHeight >= ratio) {
  //         var w = window.innerHeight * ratio;
  //         var h = window.innerHeight;
  //     } else {
  //         var w = window.innerWidth;
  //         var h = window.innerWidth / ratio;
  //     }
  //     renderer.view.style.width = w + 'px';
  //     renderer.view.style.height = h + 'px';
  // }
  // window.onresize = function(event) {
  //     resize();
  // };