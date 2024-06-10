var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");
var LTime = Date.now();
var RTime =0;
var deltaTime = 0.0001;

var mouseX=0;
var mouseY=0;


//자바스크립트 이미지 호출
var imageList = {};
var preloadImage =function(path)
{
    let _image = new Image();
    _image.src=path;
    imageList[path]={image:_image, isLoaded:false};

    _image.addEventListener('load',function(){
    imageList[path].isLoaded=true;
    },false);

}

//이미지 컨트롤 클래스
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
        this.reversalLR=1;
        this.reversalTB=1;
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
        ctx.translate(this.pos.x,this.pos.y);
        ctx.rotate(this.rot);
        ctx.scale(this.reversalLR,this.reversalTB);
        ctx.transform(this.scale.x,0,0,this.scale.y,-dx * this.scale.x,-dy * this.scale.y);
    
        ctx.drawImage(this.image, 0, 0);
    }

    setZ(_z)
    {
        this.z=_z;
    }
}

var nowScene=undefined;

//씬 클래스
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
                return;
            }
                
        }
    }
    render()
    {
        this.SceneImageList.sort(function(a,b)
        {
            return b.z-a.z;
        });
        for(let i=0;i<this.SceneImageList.length;i++)
            this.SceneImageList[i].render();
    }

    mouseMove(_x, _y)
    {

    }
    mouseClick()
    {

    }
    mouseUp()
    {

    }
}
var nullScene=new Scene();




class MainScene extends Scene
{
    constructor()
    {
        super();
        this.player;
        this.enemyList = [];

        this.ismouseClick = 0;
        
        this.shootDelay=0;
        this.SHOOTDELAY=200;
        this.shootable=0;
    }
    

    init()
    {
        preloadImage("images/11.png");
        preloadImage("images/12.png");
        preloadImage("images/13.png");
        preloadImage("images/14.png");

    
    
        //this.enemyList.push(new Enemy(600, 400));
        
        this.player = this.addImage(new GameImage("images/12.png"));
        this.player.setZ(-1);

        this.makeEnemy();
    
    }
    update()
    {
        this.gameManeger();
        
    }

    makeEnemy()
    {
        for(let i=0;i<10;i++)
        {
            let e = new Enemy(-100,-100);
            nowScene.deleteImage(e);
            let rx = Math.floor(Math.random()*myCanvas.width-e.gImage.image.width - 200)+e.gImage.image.width + 200;
            let ry = Math.floor(Math.random()*myCanvas.height-e.gImage.image.height - 200)+e.gImage.image.height + 200;
            e = new Enemy(rx,ry);
            nowScene.deleteImage(e);
            this.enemyList.push(e);
        }
    }

    gameManeger()
    {
        this.shootDelay++;
        if(this.shootDelay >= this.SHOOTDELAY)
        {
            this.shootable=1;
        }
        for(let i=0;i<this.enemyList.length;i++)
        {
            
            this.enemyList[i].move();
            this.enemyList[i].moveAnimation();
            
            if(this.enemyList[i].HP<=0)
            {
                this.enemyList[i].dead();
                nowScene.deleteImage(this.enemyList[i].gImage);
                this.enemyList.splice(i,1);
            }
        }
    }
    shoot()
    {
        if(this.shootable==1)
        {
            this.shootDelay=0;
            this.shootable=0;
            for(let i=0;i<this.enemyList.length;i++)
            {
                let m = (this.enemyList[i].gImage.image.width + this.enemyList[i].gImage.image.height)/2;
                let d = Math.pow(Math.pow(this.player.pos.x - this.enemyList[i].x, 2) + Math.pow(this.player.pos.y - this.enemyList[i].y, 2), 0.5);
                if(d <= m*2)
                {
                    this.enemyList[i].hit();
                    break;
                }
            }
            
        }
    }
    mouseMove(_x, _y)
    {
       
        this.player.pos.x = _x;
        this.player.pos.y = _y;
    
    }

    mouseClick()
    {
        this.ismouseClick = 1;
        this.shoot();
        console.log("X:"+this.player.pos.x);
        console.log("Y:"+this.player.pos.y);

    }
    mouseUp()
    {
        this.ismouseClick = 0;
    }

}
class Enemy
{
    constructor(_x,_y)
    {
        this.HP=1;
        this.random=0;

        this.x=_x;
        this.y=_y;

        let r = Math.random();
        if(r>=0.5) this.dx=1;
        else this.dx=-1;//-1 left, 1 right
        this.dy=1;

        this.ANIMATIONDELAY = 100;

        this.animationDelay=0;
        this.animationNumber=1;

        this.moveSpeed = Math.floor(Math.random()*200)+1;
        this.gImage=nowScene.addImage(new GameImage("images/12.png"));
        this.gImage.pos.x=_x;
        this.gImage.pos.y=_y;
    }

    move()
    {
        if(this.gImage.pos.x + this.gImage.image.width >= myCanvas.width || 
            this.gImage.pos.x - this.gImage.image.width <= 0)
        {
            this.dx*=-1;
            this.gImage.pos.x += this.gImage.width;
        }
        if(this.gImage.pos.y + this.gImage.image.height >= myCanvas.height || 
            this.gImage.pos.y - this.gImage.image.height <= 0)
        {
            this.dy*=-1;
        }
        
        this.x += this.dx * this.moveSpeed * deltaTime;
        this.y += this.dy * this.moveSpeed * deltaTime;

        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
        
        this.gImage.reversalLR = this.dx * -1;

    }

    moveAnimation()
    {
        this.animationDelay++;

        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            nowScene.deleteImage(this.gImage);

            if(this.animationNumber == 1)
            {
                this.gImage = nowScene.addImage(new GameImage("images/11.png"));
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = nowScene.addImage(new GameImage("images/12.png"));
                this.animationNumber=1;
            }
            

            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    deadAnimation()
    {

    }

    hit()
    {
        this.HP--;
    }

    dead()
    {
        console.log("KILL");
    }

}


var mainScene = new MainScene();







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

var mouseMoveFunc = function(e)
{
    mouseX = e.clientX-myCanvas.offsetLeft;
    mouseY = e.clientY-myCanvas.offsetLeft;

    nowScene.mouseMove(mouseX, mouseY);
}

var mouseClickFunc = function(e)
{
    nowScene.mouseClick();
}

var mouseUpFunc = function(e)
{
    nowScene.mouseUp();
}



myCanvas.addEventListener("mousemove",mouseMoveFunc,false);
myCanvas.addEventListener("mousedown",mouseClickFunc,false);
myCanvas.addEventListener("mouseup",mouseUpFunc,false);


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
    RTime = Date.now();
    deltaTime = (RTime-LTime)/1000;
    LTime = RTime;

    //updateKeys();
    update();
    ctx.resetTransform();
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    render();
}


mainScene.start();
setInterval(gameloop,deltaTime);