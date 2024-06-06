var myCanvas = document.getElementById("myCanvas");

var LTime = Date.now();
var RTime =0;

var deltaTime = 0.0001;

var mouseX=0;
var mouseY=0;

var imageList = {};


var enemyList=[];


var preloadImage =function(path)
{
    let _image = new Image();
    _image.src=path;
    imageList[path]={image:_image, isLoaded:false};

    _image.addEventListener('load',function(){
    imageList[path].isLoaded=true;
    },false);

}

class GameImage
{
    constructor(path)
    {
        this.path=path;
        this.pos={x:0,y:0};
        this.scale={x:1,y:1};
        this.rot=0;
        this.z=0;
        this.rand=0;
        this.anchor = {x:0.5 , y:0.5};

        if(imageList[path]==undefined)
        {
            this.image = new Image();
            this.image.src = path;
            imageList[path]={image:this.image, isLoaded:false};

            this.image.addEventListener('load',function(){
            imageList[path].isLoaded=true;
            },false);
        }
        else
        {
            this.image=imageList[path].image;
        }
    }
    render()
    {
        if(!imageList[this.path].isLoaded)
            return;
        let dx= this.image.width * this.anchor.x;
        let dy= this.image.height * this.anchor.y;
        ctx.resetTransform();
        ctx.translate(this.pos.x+dx,this.pos.y+dy);
        ctx.rotate(this.rot);
        ctx.transform(this.scale.x,0,0,this.scale.y,-dx * this.scale.x,-dy * this.scale.y);
    
        ctx.drawImage(this.image,0,0);
    }

    setZ(newZ)
    {
        this.z=newZ;
        nowScene.SceneImageList.sort(function(a,b)
    {
        return b.z-a.z;
    });
    }
}

var nowScene=undefined;

class Scene
{
    constructor()
    {
        this.SceneImageList=[];
    }
    init()
    {

    }
    addImage(image)
    {
        this.SceneImageList.push(image);
        return image;
    }
    start()
    {
        nowScene = this;
        this.init();
    }
    update()
    {

    }
    addImage(image)
    {
        this.SceneImageList.push(image);
        return image;
    }
    deleteImage(image)
    {
        for(let i =0; i<this.SceneImageList.length;i++)
        {
            if(Object.is(this.SceneImageList[i],image))
            {
                this.SceneImageList.splice(i,1);
                return ;
            }
                
        }
    }
    render()
    {
        for(let i=0;i<this.SceneImageList.length;i++)
        this.SceneImageList[i].render();
    }
}
var nullScene=new Scene();



var enemyManager = function()
{

}


var set360Angle = function(a)
{
    if(a<=0) a*=-1;
    else a = 360-a;
    return a;
}

var setLessThan360Angle = function(a)
{
    while(a<0) a+=360;
    while(a>360) a-=360;
    return a;
}

//세팅
var setting = function()
{

}
//렌더링
var render = function()
{

}
//업데이트
var update = function()
{

}
//메인루프
var gameLoop = function()
{
    RTime = Date.now();
    deltaTime = (RTime-LTime)/10000;
    LTime = RTime;



    update();
    render();
}






var mouseMoveFunc = function(e)
{
    mouseX = e.clientX-myCanvas.offsetLeft;
    mouseY = e.clientY-myCanvas.offsetLeft;
    console.log("X:"+mouseX);
    console.log("Y:"+mouseY);

}

var mouseClickFunc = function(e)
{
    console.log("Click");
}

var mouseUpFunc = function(e)
{
    console.log("Up");

}



myCanvas.addEventListener("mousemove",mouseMoveFunc,false);
myCanvas.addEventListener("mousedown",mouseClickFunc,false);
myCanvas.addEventListener("mouseup",mouseUpFunc,false);

var GAMESTART = function()
{
    setting();
    setInterval(gameLoop,deltaTime);
}

GAMESTART();
