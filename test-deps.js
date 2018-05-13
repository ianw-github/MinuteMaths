var $script = function(scripts,callbackOrId){
  if(typeof callbackOrId === 'function'){
    callbackOrId.call();
  }
};
$script.ready = function(){};

var fakeXHRs = [];

var xhr = sinon.useFakeXMLHttpRequest();
xhr.onCreate = function(ajax) {
  fakeXHRs.push(ajax);
};

window.TMDATA = {
  access: function(){},
  update: function(){}
};
