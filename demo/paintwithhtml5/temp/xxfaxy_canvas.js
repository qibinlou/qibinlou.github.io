var xxfaxy_canvas=function(){

function scale(canvas,width,height){
var w=canvas.width;
var h=canvas.height;
var temp_canvas=document.createElement("canvas");
var context=temp_canvas.getContext("2d");
temp_canvas.width=width;
temp_canvas.height=height;
context.drawImage(canvas,0,0,w,h,0,0,width,height);
return temp_canvas;
}

function get_url(canvas,width,height){
canvas=scale(canvas,width,height);
return canvas.toDataURL("image/png");
}

var save=function(canvas,width,height){
window.location.href=get_url(canvas,width,height);
};

var convert=function(canvas,width,height){
var img=document.createElement("img");
img.src=get_url(canvas,width,height);
return img;
};

return {save:save,convert:convert};

}();