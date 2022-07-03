var $ = document;
var cvs = $.getElementById("mycanvas");
var ctx = cvs.getContext("2d");
var degree = Math.PI / 180;

var frame = 0;

var sprite = new Image();
sprite.src ="img/sprite.png"

var SCORE = new Audio();
SCORE.src = "audio/flappy_bird_codes_audio_score.wav";

var FLAP = new Audio();
FLAP.src = "audio/flappy_bird_codes_audio_flap.wav";

var HIT = new Audio();
HIT.src = "audio/flappy_bird_codes_audio_hit.wav";

var DIE = new Audio();
DIE.src = "audio/flappy_bird_codes_audio_die.wav";

var START = new Audio();
START.src = "audio/flappy_bird_codes_audio_start.wav";

var state = {
current : 0,
getReady : 0,
game : 1,
over :2
}
function clickHandler(){
   switch (state.current) {
       case state.getReady:
        START.play()
           state.current = state.game;
           break;
        case state.game:
            FLAP.play();
            bird.flap()
            break;
       default:
           pipes.position =[]
           bird.rotation =0;
           score.value =0;
           
           state.current = state.getReady
          
           break;
   }

}

$.addEventListener("click", clickHandler)
$.addEventListener("keydown",function(e){
if(e.which == 32){
    clickHandler();
}

})

var bg= {
    sX : 0,
    sY : 0,
    w : 275,
    h : 250,
    x : 0,
    y: cvs.height-226,
    draw :function(){
        ctx.drawImage(sprite,this.sX, this.sY, this.w,this.h,this.x,this.y, this.w,this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x+ this.w, this.y, this.w, this.h)

    }
}


var pipes ={

    top:{
        sX : 553,
        sY : 0,

    },
    bottom : {
        sX : 502,
        sY : 0,

    },
    w:53,
    h:400,
    dx:2,
    gap: 100,
    position: [],
    maxYpos: -150,
    draw : function(){

        for(let i = 0 ; i<this.position.length; i++){
            let p = this.position[i];
            // p.x -= this.dx;

            let topYpos =p.y;
            let bottomYpos = p.y + this.h +this.gap;

            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYpos, this.w, this.h)
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x , bottomYpos, this.w, this.h)
        }
        
    },
    update: function(){
        if(state.current !== state.game )return;
        if(frame % 100 == 0){
            this.position.push({

                x: cvs.width,
                y:this.maxYpos * (Math.random() +1)

            })
        }
        for(let i = 0 ; i<this.position.length; i++){
            let p = this.position[i];
            p.x -= this.dx;

            let bottomPipes = p.y + this.h +this.gap
            if(bird.x + bird.raduse > p.x && bird.x - bird.raduse < p.x + this.w && bird.y + bird.raduse > p.y && bird.y - bird.raduse < p.y + this.h ){
                HIT.play()
                state.current = state.over
            }
            if(bird.x + bird.raduse > p.x && bird.x - bird.raduse < p.x + this.w && bird.y + bird.raduse > bottomPipes && bird.y - bird.raduse < bottomPipes + this.h ){
                HIT.play()
                state.current = state.over
            }
           

            if(p.x + this.w <= 0){
                this.position.shift()
                SCORE.play();
                score.value += 1
                score.best = Math.max(score.value , score.best)
                localStorage.setItem("best:", score.best)
               
            }
          
               
        }
       
       

    }

}

var fg = {

sX : 276,
sY : 0,
w :224,
h :112,
x:0,
dx: 2,
y: cvs.height - 112,
draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
},
update : function(){

    if(state.current == state.game){
        this.x = (this.x - this.dx) % (this.w/2)
       
    }
    

}


}
var getReady = {

sX : 0,
sY : 228,
w :173,
h :152,
x:cvs.width/2 - 173/2,
y: 80,
draw : function(){
    if(state.current == state.getReady){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }

   
}


}
var gameOver = {

    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width/2 - 225/2,
    y: 90,
draw : function(){
    if(state.current == state.over){

        ctx.drawImage(sprite, this.sX,this.sY, this.w, this.h, this.x,this.y,this.w,this.h)
    }
   
   
}


}
    var bird = {
    animation :[
    {sX:276 , sY:112 },
    {sX:276 , sY:139 },
    {sX:276 , sY:164 },
    {sX:276 , sY:139 },

    ]
    ,
    w :34,
    h :26,
    x: 50,
    y: 150,
    speed: 0,
    gravity: 0.25,
    jump : 7.2,
    rotation: 0,
    raduse: 12,
    animationIndex : 0,
    draw : function(){
        let bird = this.animation[this.animationIndex]
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(sprite, bird.sX,bird.sY, this.w, this.h,  - this.w/2,- this.h/2,this.w,this.h)
        ctx.restore();
    },
    update: function(){
        let period = 5;
        if(state.current == state.game){
            period = 5;
        }else{
            period = 10;
        }
        this.animationIndex += frame % period == 0 ? 1 : 0;
        if(this.animationIndex % 4 == 0){
            this.animationIndex = 0;
        }
        if(state.current == state.getReady){
            this.y = 150;
        }else{
            if(state.current == state.game){
                this.speed += this.gravity
            this.y += this.speed
            if(this.speed<this.jump/1.3){
                this.rotation = -25 * degree;
        }else{

            this.rotation = 90 *degree;
        }
            }
            
        
            if(state.current == state.over){
                this.speed = 0;
                
               
        }
    
        
        }
            
        if (this.y + this.h/2 >= cvs.height - fg.h ){
            this.y = cvs.height - fg.h - this.h/2
            this.animationIndex = 0
            if(state.current == state.game){
                DIE.play();

                    state.current = state.over
                }
            
        }
        
        
        
       
    },

    flap : function (){
        this.speed -= this.jump
    }


    }
    var score = {
        best: parseInt( localStorage.getItem("best:")) || 0,
        value: 0,
        draw : function(){
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000"

           if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "25px IPMACT"

            ctx.fillText(this.value , 20 , 40)
            ctx.strokeText(this.value ,20 , 40)
           }else if(state.current == state.over){
            ctx.font = "25px IMPACT";

            ctx.fillText(this.value, 225, 186)
            ctx.strokeText(this.value, 225, 186)

            ctx.fillText(this.best, 225, 228)
            ctx.strokeText(this.best, 225, 228)
        }

        }

    }

function update(){

    bird.update();
    fg.update();
    pipes.update();
}

function draw(){
ctx.fillStyle = "#70c5ce"
ctx.fillRect(0,0, cvs.width, cvs.height);
bg.draw()
pipes.draw();
fg.draw()
bird.draw()
getReady.draw()
gameOver.draw()
score.draw()

}


function animate (){
    update()
    draw()
    frame++;

    requestAnimationFrame(animate);

}
animate();