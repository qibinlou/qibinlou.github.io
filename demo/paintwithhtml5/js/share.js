$(document).ready(function(){

var qs = location.search.substring(1), appId = '226129', pos = qs.indexOf('app_id='), accessToken;
  if(pos >= 0){
	  var ep = qs.indexOf('&', pos+7);
	  appId = qs.substring(pos+7, ep==-1? qs.length:ep);
  }
  
  window.addEvent('domready', function() {
	  changeParams();
	  document.getElementById('appId').value = appId;
	  Renren.init({appId:appId});
  });
  var params = {
		authorize : {
				response_type : 'token',
				client_id : appId
			},
		authorize_http : {
				response_type : 'token',
				client_id : appId
			},
		feed : {
				url:'http://www.louqibin.me/paint',
				name: 'My painting with html5',
				description:'My painting with html5',
				image: ""
			},
		request : {
			accept_url:'http://www.swimmingacross.com',
			actiontext: '邀请测试',
			accept_label:'测试dialog'
		}
  }
  
  function ui(){
	  var url = document.getElementById('url').value;
	  if(url=='authorize') 
		  url = 'https://graph.renren.com/oauth/authorize';
	  else if(url=='authorize_http') 
		  url = 'http://graph.renren.com/oauth/authorize';
	  var display = document.getElementById('display').value, method = document.getElementById('method').value,
	  left = document.getElementById('left').value, top = document.getElementById('top').value,
	  width = document.getElementById('width').value, height = document.getElementById('height').value,
	  params = document.getElementById('params').value;
	  var uiOpts = {
		  url : url,
		  display : display==''? null : display,
		  method : method==''? null : method,
		  style : {
			  top : top==''? null : top,
			  left : left==''? null : left,
			  width : width==''? null : width,
			  height : height==''? null : height					  
		  },
		  params : 	JSON.decode(params),
		  onComplete : function(response){
			  if(window.console) 
				  console.log("complete: "+JSON.encode(response));
		  },
		  onSuccess : function(response){
			  if(window.console) 
				  console.log("success: "+JSON.encode(response));
			  if(response.access_token){
				  accessToken = response.access_token;
				  alert("access token: " + accessToken);
			  }
		  },
		  onFailure : function(response){
			  if(window.console) 
				  console.log("failure: " + response.error + ',' + response.error_description);
	 	  } 
	  };
	  if(!uiOpts.params.access_token)
		uiOpts.params.access_token = accessToken;
	  Renren.ui(uiOpts);
  }




  function changeParams(){
	  var url = document.getElementById('urls').value;
	  document.getElementById('url').readOnly = (url!='');
	  document.getElementById('url').value = url;
	  document.getElementById('params').value = params[url]? JSON.encode(params[url]):'';	  
  }
  function changeAppId(v){
	  location.href = location.href.replace(location.search,'')+'?app_id='+v
  }


  function ShareRenRen () {
  	  
  	  var canvas = document.getElementById("mycanvas");
  	  document.getElementById("params").value =' {"url":"http://www.louqibin.me/paint","name":"My painting with html5","description":"My painting with html5","image": canvas.toDataURL() } ';
  	  ui();
  }

  $("#ShareRenRen").click(function (argument) {
  	   var canvas = document.getElementById("mycanvas");
  	   var str = canvas.toDataURL();
  	  document.getElementById("params").value =' {"url":"http://www.louqibin.me/paint","name":"My painting with html5","description":"My painting with html5","image":'+"'" +canvas.toDataURL() +"'}";
  	  alert( document.getElementById("params").value);
  	  ui();
  })



 });

