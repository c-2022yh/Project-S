
var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");

var LTime = Date.now();
var RTime =0;

var a=1;
var deltaTime = 0.016;

var imageList = {};

var Lkeys = {};

var keys = {};

var keyDownFunc =function(e)
{
    Lkeys[e.code]=1;
    if(!keys.hasOwnProperty(e.code))
        keys[e.code]=0;
}
var keyUpFunc =function(e)
{
    Lkeys[e.code]=-1;
}
var updateKeys =function()
{
    for(code in keys)
    {
        if(Lkeys[code]==1 && keys[code]==0)
        {
            keys[code]=1;
        }
        else if(Lkeys[code]==1 && keys[code]==1)
        {
            keys[code]=2;
        }
        else if(Lkeys[code]==-1 && keys[code]==-1)
        {
            keys[code]=0;
            Lkeys[code]=0;
        }
        else if(Lkeys[code]==-1)
        {
            keys[code]=-1;
        }
         
    }
}


document.addEventListener("keydown",keyDownFunc,false);
document.addEventListener("keyup",keyUpFunc,false);

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

var update =function()
{
    nowScene.update();
}
var render=function()
{
    nowScene.render();
}
var gameloop=function()
{   
    RTime =Date.now();
    deltaTime =(RTime-LTime)/1000;
    LTime =RTime;

    updateKeys();
    update();
    ctx.resetTransform();
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    render();
}


setInterval(gameloop,deltaTime);