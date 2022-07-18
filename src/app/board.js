

export default function Board(props) {

    scope.resize = function(w,h,type)
    {
      if(isNaN(w) || isNaN(h))
        {
            return;
        }
        background.scale.x = 1;
        background.scale.y = 1;

        background.width   = w;
        background.scale.y = background.scale.x;

        if(background.height < h)
        {
            background.height  = h;
            background.scale.x = background.scale.y;
        }
        background.x = (w /2);
        background.y = (h /2);

        ///////////////////////////////////////////
        var topScale    = w / 1020;
        var sideScale   = w / 1450;
        var bottomScale = w / (type != 'portrait' ? 1450 : 650);
        var offset      = type == "" ? 0 : 20;

        topScale    = topScale    > 1 ? 1 : topScale;
        sideScale   = sideScale   > 1 ? 1 : sideScale;
        bottomScale = bottomScale > 1 ? 1 : bottomScale;

        var maxWidth   = ((props.card.size.x + (props.container.container.gap * 2)) * props.container.container.maxSize.x);
        var maxHeight  = ((props.card.size.y + (props.container.container.gap * 2)) * props.container.container.maxSize.y);
        // var scale      = Math.min((maxWidth>w) ? w / maxWidth : 1,(maxHeight>h) ? h / maxHeight : 1);
        var scale      = Math.min((maxWidth>w) ? w / maxWidth - 0.05: 1,(maxHeight>h) ? h / maxHeight - 0.05 : 1);
        var takenCont  = props.container.takenContainer;

        playerCont.view().scale.set(scale,scale);
        playerCont.view().x = (w/2);
        playerCont.view().y = ((h - ((props.card.size.y * scale)/2))) - ((120+offset) * bottomScale);

        opponentCont.view().scale.set(scale,scale);
        opponentCont.view().x = (w/2);
        opponentCont.view().y = ((props.card.size.y * scale)/2) + ((type == "portrait"  ? 210 : 10) * topScale)

        playerTaken.view().scale.set(scale,scale);
        playerTaken.view().x = ((type != "portrait"  ? 250 : -50) * sideScale);
        playerTaken.view().y =  (type != "portrait"  ? (h +(playerCont.view().height/4))   : playerCont.view().y); //playerCont.view().y;
        playerTaken.labelPosition((type == "portrait" ? takenCont.playerPosition.labelPos : {x:50,y:-70}));
        playerTaken.rotate(takenCont.playerPosition.rotation);

    }

    init();
}