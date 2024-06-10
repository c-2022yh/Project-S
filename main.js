var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");
var LTime = Date.now();
var RTime =0;
var deltaTime = 0.0001;

var mouseX=0;
var mouseY=0;

var score = 0;

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
}

var nowScene=undefined;

//씬 클래스
class Scene
{
    constructor() { }
    init() { }
    
    update() { }
    render() { }
    mouseMove(_x, _y) { }
    mouseClick() { }
    mouseUp() { }
    start()
    {
        nowScene = this;
        this.init();
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
        this.SHOOTDELAY=40;
        this.shootable=0;

        this.isHit=0;
        this.hitDelay=0;
    }
    

    init()
    {
        preloadImage("images/bg.png");
        preloadImage("images/bg2.png");


        preloadImage("images/11.png");
        preloadImage("images/12.png");
        preloadImage("images/13.png");
        preloadImage("images/14.png");
        preloadImage("images/15.png");
        preloadImage("images/16.png");

        preloadImage("images/21.png");
        preloadImage("images/22.png");
        preloadImage("images/23.png");
        preloadImage("images/24.png");
        preloadImage("images/25.png");
        preloadImage("images/26.png");
        preloadImage("images/27.png");
        preloadImage("images/28.png");

        preloadImage("images/31.png");
        preloadImage("images/32.png");
        preloadImage("images/33.png");
        preloadImage("images/34.png");
        preloadImage("images/35.png");

        preloadImage("images/41.png");
        preloadImage("images/42.png");
        preloadImage("images/43.png");
        preloadImage("images/44.png");
        preloadImage("images/45.png");
        preloadImage("images/46.png");

        preloadImage("images/51.png");
        preloadImage("images/52.png");
        preloadImage("images/53.png");
        preloadImage("images/54.png");
        preloadImage("images/55.png");
        preloadImage("images/56.png");
        preloadImage("images/57.png");
        preloadImage("images/58.png");

        preloadImage("images/aim.png");

        preloadImage("images/hit1.png");
        preloadImage("images/hit2.png");
        preloadImage("images/hit3.png");



        this.bg = new GameImage("images/bg.png");
        this.bg.pos.x= myCanvas.width/2;
        this.bg.pos.y= myCanvas.height/2;


        this.player = new GameImage("images/aim.png");
        this.hitEffect = undefined;
        this.hitX=0;
        this.hitY=0;

        this.makeEnemy();

    }
    update()
    {
        this.gameManeger();
        
    }
    render()
    {
        this.bg.render();        
        this.enemyList.sort(function(a,b){
            return b.gImage.z - a.gImage.z;
        })
        for(let i=0;i<this.enemyList.length;i++)
            this.enemyList[i].gImage.render();
        if(this.hitEffect != undefined) this.hitEffect.render();
        this.player.render();
    }

    makeEnemy()
    {
        for(let i=0;i<20;i++)
        {
            let rx = Math.floor(Math.random() * myCanvas.width / 3) + myCanvas.width / 3;
            let ry = Math.floor(Math.random() * myCanvas.height / 3) + myCanvas.height / 3;
            let e= undefined;
            
            if(i<6)
            {
                e = new OrangeMushroom(rx,ry);
            }
            else if(i<12)
            {
                e = new Slime(rx,ry);
            }
            else if(i<15)
            {
                e = new RedSnail(rx,ry);
            }
            else if(i<18)
            {
                e = new Stump(rx,ry);
            }
            else
            {
                e = new RibbonPig(rx,ry);
            }
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
            this.enemyList[i].onMoveFunction();
            if(this.enemyList[i].HP > 0)  
            {
                if(this.enemyList[i].onMove == 1)
                {
                    this.enemyList[i].move();
                    this.enemyList[i].moveAnimation();
                }
                else if(this.enemyList[i].onMove == 0)
                {
                    this.enemyList[i].stopAnimation();
                }
            }
            
            if(this.enemyList[i].HP<=0)
            {
                this.enemyList[i].deadAnimation();
            }
            if(this.enemyList[i].isDead == 1)
            {
                this.enemyList[i].dead();
                this.enemyList.splice(i,1);
            }
        }
        if(this.isHit == 1)
        {
            this.hitDelay++;
            
            if(this.hitDelay <= 40)
            {
                this.hitEffect = new GameImage("images/hit1.png");
                this.hitEffect.pos.x = this.hitX;
                this.hitEffect.pos.y = this.hitY;
            }
            else if(this.hitDelay <= 80)
            {
                this.hitEffect = new GameImage("images/hit2.png");
                this.hitEffect.pos.x = this.hitX;
                this.hitEffect.pos.y = this.hitY;
            }
            else if(this.hitDelay <= 120)
            {
                this.hitEffect = new GameImage("images/hit3.png");
                this.hitEffect.pos.x = this.hitX;
                this.hitEffect.pos.y = this.hitY;
            }
            else
            {
                this.isHit = 0;
                this.hitEffect=undefined;
                this.hitDelay=0;
            }

        }

        if(score>=20)
        {
            nowScene = nullScene;
            alert("clear");
            if(confirm("restart?"))
            {
                location.reload(true);
            }
            else
            {
                location.reload(true);
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
                if(d <= m * 0.5 && this.enemyList[i].isDead == 0)
                {
                    this.enemyList[i].hit();
                    this.isHit=1;
                    this.hitX=this.player.pos.x;
                    this.hitY=this.player.pos.y;
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

        this.x=_x;
        this.y=_y;

        let r = Math.random();
        if(r>=0.5) this.dx=1;
        else this.dx=-1;//-1 left, 1 right
        this.dy=1;
        

        this.onMove = 1;
        this.moveSpeed = undefined;
        this.gImage = undefined;

        this.animationDelay=0;
        this.animationNumber=0;
        this.ANIMATIONDELAY =0;

        this.isDead=0;
        this.deadAnimationDelay=0;
        this.deadAnimationNumber=1;

        this.wallHit = 0;

        this.setDY();
        
    }

    setDY()
    {
        let r = Math.floor(Math.random()*3)-1.5;
        if(r>=0 && r<=0.3) r = 0.3;
        else if(r<=0 && r>=-0.3) r = -0.3;
        this.dy = r;
    }

    move()
    {
        if(this.gImage.pos.x + this.gImage.image.width >= myCanvas.width)
        {
            this.dx = -1;
            this.gImage.reversalLR = 1;
            this.wallHit++;
        } 
        else if(this.gImage.pos.x - this.gImage.image.width <= 0)
        {
            this.dx = 1;
            this.gImage.reversalLR = -1;
            this.wallHit++;
        }

        if(this.wallHit>2)
        {
            this.wallHit=0;
            this.setDY();
        }   

        if(this.gImage.pos.y + this.gImage.image.height >= myCanvas.height)
        {
            this.dy *= -1;
        }
        else if(this.gImage.pos.y - this.gImage.image.height <= 0)
        {
            this.dy *= -1;
        }

        this.x += this.dx * this.moveSpeed * deltaTime;
        this.y += this.dy * this.moveSpeed * deltaTime;

        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;

    }

    onMoveFunction() { }

    moveAnimation() { }
    deadAnimation() { }
    stopAnimation() { }


    hit()
    {
        this.HP--;
    }

    dead()
    {
        score++;
    }


}


class OrangeMushroom extends Enemy
{
    constructor(_x, _y)
    {
        super(_x, _y);
        this.gImage= new GameImage("images/11.png");
        this.gImage.pos.x=this.x;
        this.gImage.pos.y=this.y;

        this.ANIMATIONDELAY = 50;
        this.animationNumber = Math.floor(Math.random()*4)+1;
        this.moveSpeed = Math.floor(Math.random()*50)+100;
        
        this.gImage.reversalLR = this.dx *-1;
    }
    moveAnimation()
    {
        this.animationDelay++;
        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            let r = this.gImage.reversalLR;
            if(this.animationNumber == 1)
            {
                this.gImage = new GameImage("images/11.png");
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = new GameImage("images/12.png");
                this.animationNumber=3;
            }
            else if(this.animationNumber == 3)
            {
                this.gImage = new GameImage("images/13.png");
                this.animationNumber=4;
            }
            else if(this.animationNumber == 4)
            {
                this.gImage = new GameImage("images/11.png");
                this.animationNumber=5;
            }
            else if(this.animationNumber == 5)
            {
                this.gImage = new GameImage("images/12.png");
                this.animationNumber=1;
            }
            this.gImage.reversalLR = r;
            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    deadAnimation()
    {
        this.deadAnimationDelay++;
        let r = this.gImage.reversalLR;
        if(this.deadAnimationDelay <= 40)
        {
            this.gImage = new GameImage("images/14.png");
        }
        else if(this.deadAnimationDelay <= 80)
        {
            this.gImage = new GameImage("images/15.png");
        }
        else if(this.deadAnimationDelay <= 120)
        {
            this.gImage = new GameImage("images/16.png");
        }
        
        else
        {
            this.isDead = 1;
        }
        
        this.gImage.z = 1;
        this.gImage.reversalLR = r;
        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
    }
    
}

class Slime extends Enemy
{
    constructor(_x, _y)
    {
        super(_x, _y);
        this.gImage = new GameImage("images/21.png");
        this.gImage.pos.x=this.x;
        this.gImage.pos.y=this.y;

        this.ANIMATIONDELAY = 40;
        this.animationNumber = Math.floor(Math.random()*4)+1;
        this.moveSpeed = Math.floor(Math.random()*50)+200;

        this.gImage.reversalLR = this.dx *-1;

    }
    moveAnimation()
    {
        this.animationDelay++;
        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            let r = this.gImage.reversalLR;
            if(this.animationNumber == 1)
            {
                this.gImage = new GameImage("images/21.png");
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = new GameImage("images/22.png");
                this.animationNumber=3;
            }
            else if(this.animationNumber == 3)
            {
                this.gImage = new GameImage("images/23.png");
                this.animationNumber=4;
            }
            else if(this.animationNumber == 4)
            {
                this.gImage = new GameImage("images/24.png");
                this.animationNumber=5;
            }
            else if(this.animationNumber == 5)
            {
                this.gImage = new GameImage("images/25.png");
                this.animationNumber=1;
            }
            this.gImage.reversalLR = r;
            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    deadAnimation()
    {
        this.deadAnimationDelay++;
        let r = this.gImage.reversalLR;
        if(this.deadAnimationDelay <= 40)
        {
            this.gImage = new GameImage("images/26.png");
        }
        else if(this.deadAnimationDelay <= 80)
        {
            this.gImage = new GameImage("images/27.png");
        }
        else if(this.deadAnimationDelay <= 120)
        {
            this.gImage = new GameImage("images/28.png");
        }
        else
        {
            this.isDead = 1;
        }
        
        this.gImage.z = 1;
        this.gImage.reversalLR = r;
        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
    }
}

class RedSnail extends Enemy
{
    constructor(_x, _y)
    {
        super(_x, _y);
        this.gImage = new GameImage("images/31.png");
        this.gImage.pos.x=this.x;
        this.gImage.pos.y=this.y;

        this.ANIMATIONDELAY = 75;
        this.animationNumber = Math.floor(Math.random()*3)+1;
        this.moveSpeed = Math.floor(Math.random()*50)+50;

        this.gImage.reversalLR = this.dx *-1;
    }
    moveAnimation()
    {
        this.animationDelay++;
        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            let r = this.gImage.reversalLR;
            if(this.animationNumber == 1)
            {
                this.gImage = new GameImage("images/31.png");
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = new GameImage("images/31.png");
                this.animationNumber=3;
            }
            else if(this.animationNumber == 3)
            {
                this.gImage = new GameImage("images/32.png");
                this.animationNumber=1;
            }
            this.gImage.reversalLR = r;
            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    deadAnimation()
    {
        this.deadAnimationDelay++;
        let r = this.gImage.reversalLR;
        if(this.deadAnimationDelay <= 40)
        {
            this.gImage = new GameImage("images/33.png");
        }
        else if(this.deadAnimationDelay <= 80)
        {
            this.gImage = new GameImage("images/34.png");
        }
        else if(this.deadAnimationDelay <= 120)
        {
            this.gImage = new GameImage("images/35.png");
        }
        else
        {
            this.isDead = 1;
        }
        
        this.gImage.z = 1;

        this.gImage.reversalLR = r;
        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
    }

}
class Stump extends Enemy
{
    constructor(_x, _y)
    {
        super(_x, _y);
        this.gImage = new GameImage("images/41.png");
        this.gImage.pos.x=this.x;
        this.gImage.pos.y=this.y;

        this.ANIMATIONDELAY = 50;
        this.animationNumber = Math.floor(Math.random()*3)+1;
        this.moveSpeed = Math.floor(Math.random()*20)+30;
        
        this.gImage.reversalLR = this.dx *-1;

        this.onMoveFunctionDelay = Math.floor(Math.random()*2000);
    }
    moveAnimation()
    {
        this.animationDelay++;
        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            let r = this.gImage.reversalLR;
            if(this.animationNumber == 1)
            {
                this.gImage = new GameImage("images/41.png");
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = new GameImage("images/42.png");
                this.animationNumber=3;
            }
            else if(this.animationNumber == 3)
            {
                this.gImage = new GameImage("images/43.png");
                this.animationNumber=1;
            }
            
            this.gImage.reversalLR = r;
            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    deadAnimation()
    {
        this.deadAnimationDelay++;
        let r = this.gImage.reversalLR;
        if(this.deadAnimationDelay <= 40)
        {
            this.gImage = new GameImage("images/44.png");
        }
        else if(this.deadAnimationDelay <= 80)
        {
            this.gImage = new GameImage("images/45.png");
        }
        else if(this.deadAnimationDelay <= 120)
        {
            this.gImage = new GameImage("images/46.png");
        }
        
        else
        {
            this.isDead = 1;
        }
        
        this.gImage.z = 1;
        this.gImage.reversalLR = r;
        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
    }

    stopAnimation()
    {
        this.animationDelay=0;
        this.animationNumber=1;
        let r = this.gImage.reversalLR;
        this.gImage = new GameImage("images/41.png");
        this.gImage.reversalLR = r;
        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
    }

    onMoveFunction()
    {
        this.onMoveFunctionDelay--;
        if(this.onMoveFunctionDelay == 0)
        {
            let r = Math.random();
            if(r > 0.3 && this.onMove == 0)
                this.onMove = 1;
            else
            {
                let d = Math.random();
                if(d < 0.5)
                {
                    this.dx *= -1;
                    this.gImage.reversalLR *= -1;
                }
                this.onMove = 0;
            }
            this.onMoveFunctionDelay = Math.floor(Math.random()*1000)+300;
        }
    }
    

}

class RibbonPig extends Enemy
{
    constructor(_x, _y)
    {
        super(_x, _y);
        this.gImage = new GameImage("images/51.png");
        this.gImage.pos.x=this.x;
        this.gImage.pos.y=this.y;

        this.ANIMATIONDELAY = 50;
        this.animationNumber = Math.floor(Math.random()*3)+1;
        this.moveSpeed = Math.floor(Math.random()*50)+400;
        
        this.gImage.reversalLR = this.dx *-1;

        this.onMoveFunctionDelay = Math.floor(Math.random()*2000);
    }
    moveAnimation()
    {
        this.animationDelay++;
        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            let r = this.gImage.reversalLR;
            if(this.animationNumber == 1)
            {
                this.gImage = new GameImage("images/51.png");
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = new GameImage("images/52.png");
                this.animationNumber=3;
            }
            else if(this.animationNumber == 3)
            {
                this.gImage = new GameImage("images/51.png");
                this.animationNumber=1;
            }
            
            this.gImage.reversalLR = r;
            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    deadAnimation()
    {
        this.deadAnimationDelay++;
        let r = this.gImage.reversalLR;
        if(this.deadAnimationDelay <= 40)
        {
            this.gImage = new GameImage("images/56.png");
        }
        else if(this.deadAnimationDelay <= 80)
        {
            this.gImage = new GameImage("images/57.png");
        }
        else if(this.deadAnimationDelay <= 120)
        {
            this.gImage = new GameImage("images/58.png");
        }
        else
        {
            this.isDead = 1;
        }

        this.gImage.z = 1;
        this.gImage.reversalLR = r;
        this.gImage.pos.x = this.x;
        this.gImage.pos.y = this.y;
    }

    stopAnimation()
    {
        this.animationDelay++;
        if(this.animationDelay==this.ANIMATIONDELAY)
        {
            this.animationDelay=0;
            let r = this.gImage.reversalLR;
            if(this.animationNumber == 1)
            {
                this.gImage = new GameImage("images/53.png");
                this.animationNumber=2;
            }
            else if(this.animationNumber == 2)
            {
                this.gImage = new GameImage("images/54.png");
                this.animationNumber=3;
            }
            else if(this.animationNumber == 3)
            {
                this.gImage = new GameImage("images/55.png");
                this.animationNumber=1;
            }
            
            this.gImage.reversalLR = r;
            this.gImage.pos.x = this.x;
            this.gImage.pos.y = this.y;

        }
    }

    onMoveFunction()
    {
        this.onMoveFunctionDelay--;
        if(this.onMoveFunctionDelay == 0)
        {
            let r = Math.random();
            if(this.onMove == 1 && r > 0.7) this.onMove = 0;
            else this.onMove = 1;
            
            this.onMoveFunctionDelay = Math.floor(Math.random()*150)+150;
        }
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

window.onbeforeunload = function(e)
{
    e.preventDefault();
    e.returnValue="";
}

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