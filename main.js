var myCanvas = document.getElementById("myCanvas");

var LTime = Date.now();
var RTime =0;

var deltaTime = 0.0001;

var mouseX=0;
var mouseY=0;



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
