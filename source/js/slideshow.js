/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * Found at: https://gist.github.com/gre/1650294#file-easing-js-L17
 * only considering the t value for the range [0, 1] => [0, 1]
 */
EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}
// shim layer for requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/*-------------------LIB^---------------------*/

function Slideshow(element){
    this.slides = [];//[{mini:<img>,real:<img>}]stores images
    this.currentIdx = null;
    this.offsets = {x:0,y:0};
    this.centerBias = {x:50,y:50};
    this.canvas = element;
    this.cxt = element.getContext("2d");
}

var _SS = new Slideshow(document.getElementById("slideshow"));

window.addEventListener("resize",function(){
    if(_SS.currentIdx != null)
        _SS.load(_SS.currentIdx);
});

function loadToSlideshow(img, idx){
    var src = img.getAttribute("src");
    var realsrc = img.getAttribute("real-src");
    var ctr_x = img.getAttribute("ctr-x");
    var ctr_y = img.getAttribute("ctr-y");

    if(!_SS.slides[idx])
    {
        _SS.slides[idx] = _SS.createSlide();
    }
    _SS.slides[idx].mini = img;
    _SS.slides[idx].ctr_x = ctr_x;
    _SS.slides[idx].ctr_y = ctr_y;
    img.style.display = "none";
}

function loadMulti(imgSrc, idx){
    if(!_SS.slides[idx])
    {
        _SS.slides[idx] = _SS.createSlide("multi");
    }

    _SS.slides[idx].arrImgs.push({src:imgSrc,img:null});
}

Slideshow.prototype.createSlide = function(type){
    if(type == "multi")
    {
        return {
            arrImgs: []
        }
    }
    else{
        return {
            mini:null,
            real:null,
            ctr_x:0,
            ctr_y:0
        };
    }
}

Slideshow.prototype.resize = function(img){
    //get ratio of canvas
    var canvasRatio = this.canvas.clientWidth / this.canvas.clientHeight;
    var imageRatio = img.width/img.height;
    var offsets = this.offsets;
/*--
1000
[  2.0  ]500

600
[   ]400 -> 300
*/

    if(canvasRatio > imageRatio)
    {
        this.canvas.width = img.width;
        this.canvas.height = img.width/canvasRatio;
    }
    else if(canvasRatio < imageRatio)
    {
        this.canvas.width = img.height*canvasRatio;
        this.canvas.height = img.height;
    }

    offsets.y = Math.min(0,-(img.height-this.canvas.height)*this.centerBias.y/100);
    offsets.x = Math.min(0,-(img.width-this.canvas.width)*this.centerBias.x/100);
    return offsets;
}

Slideshow.prototype.load = function(index){
    var tis = this;
    var slide = this.slides[index];
    var isReload = this.currentIdx == index;
    this.currentIdx = index;

    if(slide.mini)
    {
        //set centerBias for slide offset
        this.centerBias.x = parseInt(slide.ctr_x,10);
        this.centerBias.y = parseInt(slide.ctr_y,10);

        if(slide.real)
        {
            this.drawSingle(slide.real);
        }
        else
        {
            this.drawSingle(slide.mini);

            //begin loading real size image
            slide.real = new Image();
            slide.real.src = slide.mini.getAttribute("real-src");
            slide.real.onload = function(){
                this.load(slide);
            }.bind(this);
        }
    }
    else
    {
        //standard canvas width
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        
        //if first draw
        if(!isReload)
        {
            slide.arrImgs.forEach(function(imgObj,index){
                if(!imgObj.img)
                {
                    imgObj.img = new Image();
                    imgObj.img.src = imgObj.src;
                    imgObj.img.onload = function(){
                        tis.drawMulti(imgObj,index,true);
                    }
                }
                else
                {
                    tis.drawMulti(imgObj,index,true);
                }

            });
        }
        else
        {
            slide.arrImgs.forEach(function(imgObj,index){
                tis.drawMulti(imgObj,index);
            });
        }
    }
}

Slideshow.prototype.drawSingle = function(img)
{
    //resize to prep for slides
    this.offsets = this.resize(img);

    //draw
    this.cxt.drawImage(img,this.offsets.x,this.offsets.y);
}

Slideshow.prototype.drawMulti = function(imgObj, index, bAnim)
{
    var yPos = [600, 290, 395, 640, 500, 300, 650, 240, 545, 410, 700, 260];
    var scale = [];

    //load/animate images (275 tall 400 wide)
    //save blank state
    this.cxt.save();

    //set transforms
    var timer = 0, trans;
    var animDurr = 1500;//1.5sec
    if(bAnim)
    {
        this.cxt.translate(0, 0-yPos[index]*trans);
    }
    else
    {
        this.cxt.translate(0, 0-yPos[index]);
    }
    this.cxt.shadowColor = 'rgba(0,0,0,0.1)';
    this.cxt.shadowBlur = 20;
    this.cxt.shadowOffsetX = 15;
    this.cxt.shadowOffsetY = 15;

    //draw
    this.cxt.drawImage(
        imgObj.img,
        this.canvas.width/this.slides[this.currentIdx].arrImgs.length*(index-0.5),
        this.canvas.height
    );

    //rdy for next img
    this.cxt.restore();
}