// 找到适合浏览器的全屏方法
function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

// 启动全屏模式
//launchFullScreen(document.documentElement); // the whole page

//launchFullScreen(document.getElementById("videoElement")); // any individual element




$(document).ready(function(){

	 $("#mycanvas").attr({width:$("#container").width()});
	  $("#mycanvas").attr({height:$("#container").height()});
	 

	var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext('2d');
    context.fillStyle="white";
    context.fillRect(0,0,canvas.width,canvas.height);
    var can_paint = true;
    var can_drag = false;
    var can_pour = false;
    var can_write = false;
    var can_erase = false;
    var can_brush = false;
    var can_work = false;

    //  State history
    var StateData = function( w,h,imdata){
    	this.container_width = w;
    	this.container_height = h;
    	this.ImageData = imdata;
    }
    var history = [];

    var initial_data = new StateData(
    		$("#container").width(),
    		$("#container").height(),
    		canvas.toDataURL()
    );

    history.push(initial_data);
    var StatePos = 1;

    //alert( $("#labletest").text() );

   

    //   paint model

    var pre_x,pre_y;
    var start_x,start_y;
    var which_brush = "line";
    var PaintModel = function()
    {
    	$("#CurrentColor :first-child").css("background-color","black" ) ;
    	var color;
        var color_haschange = false;
    	var linewidth = 10;
        var linewidth_haschange = false;
        var currentBrush = "line";
        
    	context.fillStyle = "black";
    	context.strokeStyle = "black";
    	
    	

    	$("#ColorPicker").change(function(){
    		$("#CurrentColor :first-child").css("background-color",this.value ) ;
    		color = this.value;	
    		context.fillStyle = color;
    		context.strokeStyle = color;
            color_haschange = true;
    		//pour(30,40,canvas.width/2,canvas.height/3);
    		//alert(color);	
    		//brush("square");
    	});

    	$("#linewidth input").change(function(){
    		linewidth = this.value;
            context.lineWidth = linewidth;
            linewidth_haschange = true;
    		$("#show1").text(this.value);
    	});

        $("#brushstyle").change(function(){
            which_brush = $(this).find("option:selected").text();
        });

    	$("#ColorTable tr td").click(function(){
    		$("#CurrentColor :first-child").css("background-color",$(this).css("background-color") ) ;
    		color = $(this).css("background-color");	
            color_haschange = true;
    		context.fillStyle = color;
    		context.strokeStyle = color;

    	});

    	this.pour = function(){
    		

    		switch(  arguments.length )
    		{

    			case 0 : context.fillRect(0,0,canvas.width,canvas.height); break;
    			case 2 : context.fillRect(arguments[0],arguments[1],canvas.width,canvas.height); break;
    			case  4 : context.fillRect(arguments[0],arguments[1],arguments[2],arguments[3]); break;
    			default : break;
    	
    		}
    			
    	};

    	this.erase = function(x,y){
            context.save();
    		context.fillStyle = "white";
    		context.strokeStyle = "white";
    		this.brush("line",x,y,pre_x,pre_y);
            context.restore();
    	};
  var static_img = new Image();

   	this.brush = function(type,x,y,pre_x,pre_y){

            if( type == "line" ) { context.lineJoin = "round"; this.draw(x,y,pre_x,pre_y); return;}
            if( type == "jagged" ) { context.lineJoin = "miter"; this.draw(x,y,pre_x,pre_y); return;}
            if( type == "Random color" )
            {
                var r = parseInt(Math.random()*256),g = parseInt(Math.random()*256),b = parseInt(Math.random()*256),alpha = parseInt(Math.random()*256);

                context.save();
                context.beginPath();
                context.fillStyle='rgba('+r+','+g+','+b+','+alpha+')';
                context.arc(x,y,linewidth,0,Math.PI*2,true);
                context.fill();
                context.restore();

            }
            if( type == currentBrush && !linewidth_haschange && !color_haschange) { context.drawImage(static_img,x,y); /*alert("ok");*/ return; }
            $("#helper_canvas").attr("width",linewidth);
            $("#helper_canvas").attr("height",linewidth);
            var help_canvas = document.getElementById("helper_canvas");
            var help_context = help_canvas.getContext('2d');
            help_context.strokeStyle = color;
            help_context.fillStyle = color;
            
    		switch(arguments[0])
    		{
    			case "square" :
                {
                     help_context.fillRect(0,0,linewidth,linewidth);
                     static_img.src = help_canvas.toDataURL();
                     context.fillStyle = context.createPattern(static_img,'repeat');
                     context.strokeStyle = context.createPattern(static_img,'repeat');
                     context.drawImage(static_img,x,y);
                     currentBrush = "square";
                     linewidth_haschange = false;
                     color_haschange = false;
                     //this.draw(x,y,pre_x,pre_y;
                     break;

                } 
    			case "circle" :
    			{ 
    				help_context.beginPath();
    				help_context.arc(linewidth/2,linewidth/2,linewidth/2,0,Math.PI*2,true);
                    help_context.closePath();
    				help_context.fill();
                    static_img.src = help_canvas.toDataURL();
                     context.fillStyle = context.createPattern(static_img,'repeat');
                     context.strokeStyle = context.createPattern(static_img,'repeat');
                     context.drawImage(static_img,x,y);
                     currentBrush = "circle";
                     linewidth_haschange = false;
                     color_haschange = false;

    				break;
    			}

                case "triangle" :
                {
                    
                    help_context.beginPath();
                    help_context.moveTo(linewidth/2,0.15*linewidth);
                    help_context.lineTo(linewidth,linewidth);
                    help_context.lineTo(0,linewidth);
                    help_context.closePath();
                    help_context.fill();
                    static_img.src = help_canvas.toDataURL();
                     context.fillStyle = context.createPattern(static_img,'repeat');
                     context.strokeStyle = context.createPattern(static_img,'repeat');
                     context.drawImage(static_img,x,y);
                     currentBrush = "triangle";
                     linewidth_haschange = false;
                     color_haschange = false;

                    break;

                }

            
    			case "pattern" :
    			{
    				var heart = document.getElementById("heart");
    				var img = new Image();
    				img.src = heart.src;
    			    context.drawImage(img,x,y);
    			     // context.strokeStyle = context.createPattern(img,'no-repeat');
    			   // context.fillRect(0,0,canvas.width,canvas.height);
    			    
    				break;
    			}
                
    			default : break;//alert("ko");
    		}
    	};

        this.draw = function(x,y,pre_x,pre_y){
            context.save();
            context.beginPath();
            context.moveTo(pre_x,pre_y);
            context.lineTo(x,y);
            context.closePath();
            if( $("#fontstyle input[value='Stroke']").attr("checked") == "checked" ) 
                context.stroke();
            if( $("#fontstyle input[value='Fill']").attr("checked") == "checked"  )
                context.fill();
            context.restore();

        };

        this.drawshape = function(){


        };

    	this.writetext = function(x,y){
    		//alert(context.font);
    		context.font = $("#Setting #fontsize input[type='range']").attr("value")+"px " + $("#Setting select").find("option:selected").text();
    		if( $("#fontstyle input[value='italic']").attr("checked") == "checked" )
    			context.font = "italic "+context.font ;
    		
    		var fontsize = $("#Setting #fontsize input[type='range']").attr("value");
    		context.strokeWidth = $("#linewidth input[type='range']").attr("value");
    		context.lineWidth = $("#linewidth input[type='range']").attr("value");

    		
    		if( $("#fontstyle input[value='Stroke']").attr("checked") == "checked"  )
    		{
    			
    			//alert(context.strokeWidth);
    			context.strokeStyle = color;
    			context.strokeText($("#Setting input[type='text']").attr("value"),x,y + fontsize/2 );

    		}
    		else 
    		{
    			//alert(context.lineWidth);
    			context.fillStyle = color;
    			context.fillText($("#Setting input[type='text']").attr("value"),x,y + fontsize/2 );
    		}
    	};

    	this.clear = function(x1,y1,x2,y2){

            context.save();
    		context.fillStyle = "white";
    		context.strokeStyle = "white";

    		if( arguments.length ==0 )
    			context.fillRect(0,0,canvas.width,canvas.height);
    		else if( arguments.length == 2 )
    			context.fillRect(x1,y1,canvas.width,canvas.height);
    		else if(arguments.length == 4)
    			context.fillRect(x1,y1,x2,y2);
            context.restore();
    	};


    };

    var Paint = new PaintModel();


    



    //  adjust the size of container and Markers
    Update_Container();

    var ischrome = function(){
        if(window.navigator.userAgent.indexOf("Chrome")  == -1 ){
            alert("Some functions of this app is only avaliable in Google Chrome!\nFor better experience,reopen me with Chrome!");
            $("#ColorPicker").attr("value","input the color!");
            $("#ColorPicker").attr("title","Example(green,#e3e3e3,rgba(128,128,128,1))");
        }
    }();
    $("#Setting").draggable();
    $("#ToolBar").draggable();

   //   event listener

    $( "#container" ).resizable({
        resize: function showsize(){
            $("#Pos #Pos_X").text(Math.round($(this).width()));
            $("#Pos #Pos_Y").text(Math.round($(this).height()));    

        },
    	stop: function Update(){
    		Update_Canvas();

    		Update_Container();
    		// $("#show").html( $("#container").width() + "  " +$("#container").height() );

    		var data = new StateData(
    			$("#container").width(),
    			$("#container").height(),
    			canvas.toDataURL()
    	    );
    	    history.push(data);
    	    StatePos = history.length;
    	},
        
    	helper: "ui-resizable-helper",

	})

    $("#mycanvas").mousedown(function(e){
    	can_work = true;
    	pre_x = e.pageX - $(this).offset().left;
	    pre_y = e.pageY - $(this).offset().top;
	    if( can_write )  Paint.writetext(pre_x,pre_y);
	    if( can_pour ) 
	    {
	    	$("#helper").css({
	    		visibility:  "visible",
	    		left		: e.pageX+10,
	    		top         : e.pageY+10
	    	});

	    } 
    });

    $("#mycanvas").dblclick(function(){
    	can_work = false;
        if( can_pour )
            Paint.pour(); 

    });


    $("#mycanvas").mouseup(function(e){
    	can_work = false;
    	var data = new StateData(
    		$("#container").width(),
    		$("#container").height(),
    		canvas.toDataURL()
    	);

    	history.push(data);
    	StatePos = history.length;  	
    });
    $("#helper").click(function(){
    	        if( can_pour == false ) return;
    			Paint.pour($("#helper").offset().left-$("#mycanvas").offset().left,$("#helper").offset().top-$("#mycanvas").offset().top,$("#helper").width(),$("#helper").height());
    			$("#helper").width(0);
    			$("#helper").height(0);
    			$("#helper").css("visibility","hidden");

    });

     $(document).keydown(function(e){
     	    if( can_pour == false ) return;
    	    if( e.keyCode == 46 || e.keyCode == 8 )
    	    	Paint.clear($("#helper").offset().left-$("#mycanvas").offset().left,$("#helper").offset().top-$("#mycanvas").offset().top,$("#helper").width(),$("#helper").height());
    	       $("#helper").width(0);
    			$("#helper").height(0);
    			$("#helper").css("visibility","hidden");
     });

    
    $("#mycanvas").mousemove(function(e){

    		var x = e.pageX - $(this).offset().left;
	        var y = e.pageY - $(this).offset().top;
	        
	        $("#Pos #Pos_X").text(Math.round(x));
            $("#Pos #Pos_Y").text(Math.round(y));
          
            
	        $("#show").html(can_work+" "+can_paint+" "+can_pour+" "+can_erase+" "+can_write+" " +can_brush+" ");
    		if( can_work )
    		{
	            context.save();
	             if(can_paint)  Paint.brush("line",x,y,pre_x,pre_y);                  //Paint.brush("line",x,y,pre_x,pre_y);
	             else if( can_erase )  Paint.erase(x,y);
	             else if( can_brush ) { Paint.brush(which_brush,x,y,pre_x,pre_y);  }
	             else if( can_pour ) 
	             {
	              	  $("#helper").width(e.pageX-$("#helper").offset().left );
	              	  $("#helper").height(e.pageY-$("#helper").offset().top );
	      
	              //	$("#show2").html($("#helper").offset().left + " " +$("#helper").height() )
	          	 }
	           	   pre_x = x;
	               pre_y = y;
	        }
    });

    $("#mycanvas").mouseout(function(e){
              //can_paint = false;
              can_work = false;
   	});

    $("#container #Marker_3").mousedown(function(e){
    	can_drag  = true;
    //	alert("ok");
    	$("#container").draggable({stop:function(){$("#container").draggable("destroy")}});
    	//
    });

    $("#Back").click( function(){
    	if( StatePos  > 1 )
    		RestoreState(0);
    	//alert("back");
    	else alert("No More Earlier State!");
    });

    $("#Forward").click(function(){
    	if( StatePos == history.length )
    		alert("No More Newer State!");
    	else RestoreState(1);
    });

    $("#Save").click(function(){
        window.open(canvas.toDataURL());
    });

    $("#Settings").click(function(){
        $("#Setting").slideToggle("slow");
    });

    $("#Camera").click(function(){
        if(window.navigator.userAgent.indexOf("Chrome")  == -1 && window.navigator.userAgent.indexOf("Opera")  == -1){
            alert("Only Chrome and Opera support web camera!\nReopen me in Chrome!");
            return;
        }
        $("#WebCamera").prepend("<video id='Video' ></video>");
        $("#Video").attr("width",$("#mycanvas").width());
        $("#Video").attr("height",$("#mycanvas").height());
        $("#Video").css("display","block");
        // $("#Video").css("background-color","");
        $("#WebCamera").show("slow");
        
                var video = document.getElementById("Video"),
                videoObj = { "video": true },
                errBack = function(error) {
                    console.log("Video capture error: ", error.code); 
                };


            // Put video listeners into place
            if(navigator.getUserMedia) { // Standard
                navigator.getUserMedia(videoObj, function(stream) {
                    video.src = stream;
                    video.play();
                }, errBack);
            } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed

                navigator.webkitGetUserMedia(videoObj, function(stream){

                    video.src = window.webkitURL.createObjectURL(stream);

                    video.play();
                }, errBack);
            }

    });

    $("#WebCamera button:eq(0)").click(function(){
           
            var video  = document.getElementById("Video");
            if( video.paused ) video.play();
            else video.pause();
            
    });

    $("#WebCamera button:eq(1)").click(function(){
        var canvas = document.getElementById("mycanvas"),
            context = canvas.getContext("2d"),
            video  = document.getElementById("Video");
            context.drawImage(video,0,0);
        $("#WebCamera").hide("slow");
        $("#Video").remove();
    });
    $("#Clear").click(function(){
        Paint.clear();
    })

    $("#pencil").click(function(){
    	if( can_paint == false ) 
    	{	
    		can_paint = true;
    		can_brush = can_erase = can_write = can_pour = false;
            $(this).css("box-shadow","0 0 20px black");
           // $("#pencil").css("box-shadow","");
            $("#pourer").css("box-shadow","");
            $("#eraser").css("box-shadow","");
            $("#brush").css("box-shadow","");
            $("#text").css("box-shadow","");
          // $(this)
    	}
    });
    $("#pourer").click(function(){
    	if( can_pour == false ) 
    	{	
    		can_pour = true;
    		can_brush = can_erase = can_write = can_paint = false;
            $(this).css("box-shadow","0 0 20px black");
            $("#pencil").css("box-shadow","");
           // $("#pourer").css("box-shadow","");
            $("#eraser").css("box-shadow","");
            $("#brush").css("box-shadow","");
            $("#text").css("box-shadow","");
    	}
    });
    $("#eraser").click(function(){
    	if( can_erase == false ) 
    	{	
    		can_erase = true;
    		can_brush = can_paint = can_write = can_pour = false;
            $(this).css("box-shadow","0 0 20px black");
            $("#pencil").css("box-shadow","");
            $("#pourer").css("box-shadow","");
            //$("#eraser").css("box-shadow","");
            $("#brush").css("box-shadow","");
            $("#text").css("box-shadow","");
    	}
    });
    $("#text").click(function(){
    	if( can_write == false ) 
    	{	
    		can_write = true;
    		can_brush = can_erase = can_paint = can_pour = false;
            $(this).css("box-shadow","0 0 20px black");
            $("#pencil").css("box-shadow","");
            $("#pourer").css("box-shadow","");
            $("#eraser").css("box-shadow","");
            $("#brush").css("box-shadow","");
           // $("#text").css("box-shadow","");
    	}
    });
    $("#brush").click(function(){
    	if( can_brush == false ) 
    	{	
    		can_brush = true;
    		can_paint = can_erase = can_write = can_pour = false;
            $(this).css("box-shadow","0 0 20px black");
            $("#pencil").css("box-shadow","");
            $("#pourer").css("box-shadow","");
            $("#eraser").css("box-shadow","");
            //$("#brush").css("box-shadow","");
            $("#text").css("box-shadow","");
    	}
    });

    $("#FullScreen").click(function(){
        launchFullScreen(document.documentElement); 
    });

    $("#Pin").click(function(){
        $("#ToolBar").fadeToggle("slow");
        $("#ShowToolBar").css("display","block");
    });

    $("#ShowToolBar").click(function(){
        $("#ToolBar").fadeIn("slow");
        $(this).hide("fast");
    });

    $(document).keydown(function(e){
          e = e || window.event;
        //  alert(e.keyCode);
          if( e.ctrlKey && e.keyCode == 90 )
          {
            if( StatePos  > 1 )
            RestoreState(0);
        //alert("back");
            else alert("No More Earlier State!");
          }

          else if( e.shiftKey && e.keyCode == 90 )
          {
            if( StatePos == history.length )
            alert("No More Newer State!");
            else RestoreState(1);

          }
            
    });

    $("#fontsize input[type='range']").change(function(){
    	$("#fontsize input[type='text']").attr("value",$("#fontsize input[type='range']").attr("value"));    	
    });
    $("#linewidth input[type='range']").change(function(){
    	$("#linewidth input[type='text']").attr("value",$("#linewidth input[type='range']").attr("value"));    	
    });
    $("#fontsize input[type='text']").change(function(){
    	$("#fontsize input[type='range']").attr("value",$("#fontsize input[type='text']").attr("value"));    	
    });
    $("#linewidth input[type='text']").change(function(){
    	$("#linewidth input[type='range']").attr("value",$("#linewidth input[type='text']").attr("value"));    	
    });


    //  functions
    function Update_Container(){
        
       
	    $("#container #Marker_1").css({left:$("#container").width()/2});//.left = 200;//canvas.width/2;
	    $("#container #Marker_1").css({top: -6});$("#container").height()
	    $("#container #Marker_2").css({left:$("#container").width()});//.left = 200;//canvas.width/2;
	    $("#container #Marker_2").css({top: -$("#container").height()/2});
	    $("#container #Marker_3").css({left:$("#container").width()});//.left = 200;//canvas.width/2;
	    $("#container #Marker_3").css({top: -25});

	}

	function Update_Canvas()
	{	

		$("#mycanvas").before("<canvas id='mycanvas2'></canvas>");
		$("#mycanvas2").attr( {width:$("#container").width()} );
		$("#mycanvas2").attr( {height:$("#container").height()} );

		var temp_canvas=document.getElementById("mycanvas2");
		var temp_context=temp_canvas.getContext('2d');
		
		temp_context.drawImage(canvas,0,0);
		//temp_context.drawImage(canvas,0,0,Math.min(canvas.width,temp_canvas.width),Math.min(canvas.height,temp_canvas.height),0,0,temp_canvas.width,temp_canvas.height);
		if( canvas.width < temp_canvas.width )
		{
			temp_context.fillStyle="white";
			temp_context.fillRect(canvas.width,0,temp_canvas.width,temp_canvas.height);

		}

		if( canvas.height < temp_canvas.height )
		{
			temp_context.fillStyle = "white";
			temp_context.fillRect(0,canvas.height,temp_canvas.width,temp_canvas.height);
		}

		$("#mycanvas").remove();
		$("#container canvas").attr("id","mycanvas");
		canvas = document.getElementById('mycanvas');
        context = canvas.getContext('2d');

		
    	 $("#mycanvas").mousedown(function(e){
        can_work = true;
        pre_x = e.pageX - $(this).offset().left;
        pre_y = e.pageY - $(this).offset().top;
        if( can_write )  Paint.writetext(pre_x,pre_y);
        if( can_pour ) 
        {
            $("#helper").css({
                visibility:  "visible",
                left        : e.pageX+10,
                top         : e.pageY+10
            });

        } 
    });

    $("#mycanvas").dblclick(function(){
        can_work = false;
        if( can_pour )
            Paint.pour(); 

    });


    $("#mycanvas").mouseup(function(e){
        can_work = false;
        var data = new StateData(
            $("#container").width(),
            $("#container").height(),
            canvas.toDataURL()
        );

        history.push(data);
        StatePos = history.length;      
    });
    $("#helper").click(function(){
                if( can_pour == false ) return;
                Paint.pour($("#helper").offset().left-$("#mycanvas").offset().left,$("#helper").offset().top-$("#mycanvas").offset().top,$("#helper").width(),$("#helper").height());
                $("#helper").width(0);
                $("#helper").height(0);
                $("#helper").css("visibility","hidden");

    });

     $(document).keydown(function(e){
            if( can_pour == false ) return;
            if( e.keyCode == 46 || e.keyCode == 8 )
                Paint.clear($("#helper").offset().left-$("#mycanvas").offset().left,$("#helper").offset().top-$("#mycanvas").offset().top,$("#helper").width(),$("#helper").height());
               $("#helper").width(0);
                $("#helper").height(0);
                $("#helper").css("visibility","hidden");
     });

    
    $("#mycanvas").mousemove(function(e){

            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            
            $("#Pos #Pos_X").text(Math.round(x));
            $("#Pos #Pos_Y").text(Math.round(y));
          
            
            $("#show").html(can_work+" "+can_paint+" "+can_pour+" "+can_erase+" "+can_write+" " +can_brush+" ");
            if( can_work )
            {
                context.save();
                 if(can_paint)  Paint.draw(x,y,pre_x,pre_y);                  //Paint.brush("line",x,y,pre_x,pre_y);
                 else if( can_erase )  Paint.erase(x,y,0);
                 else if( can_brush ) { Paint.brush(which_brush,x,y,pre_x,pre_y);  }
                 else if( can_pour ) 
                 {
                      $("#helper").width(e.pageX-$("#helper").offset().left );
                      $("#helper").height(e.pageY-$("#helper").offset().top );
          
                  //    $("#show2").html($("#helper").offset().left + " " +$("#helper").height() )
                 }
                   pre_x = x;
                   pre_y = y;
            }
    });

    $("#mycanvas").mouseout(function(e){
              //can_paint = false;
              can_work = false;
    });

	};

	function RestoreState ( flag ) {
		
		//history.pop();
		if( flag == 0 )
			var data = history[ --StatePos - 1 ];
		else
			{	var data = history[ ++StatePos -1 ];}
		if( $("#container").width() == 	data.container_width && $("#container").height() == data.container_height )
		{
			
			var img = new Image();
            img.src = data.ImageData;
            // window.location.href= data.ImageData;
            //window.open(img.src);
             img.onload = function() {
			context.drawImage(img,0,0);}
			

		}
		else
		{
			$("#container").width( data.container_width );
			$("#container").height( data.container_height );
			Update_Canvas();
			Update_Container();
			var img = new Image();
            img.src = data.ImageData;
            // window.location.href= data.ImageData;
            //window.open(img.src);
             img.onload = function() {
			context.drawImage(img,0,0);}

		} 
	};



});
