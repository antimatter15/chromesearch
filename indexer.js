var hidden_folder = /\/\.|http/;
var is_folder = /\/$/;
if(window.location.search == '?do_index'){
  var files =  Array.prototype.slice.call(document.getElementsByTagName('a'),0)
                  .map(function(e){
                    return e.href
                                .replace(/\?do_index/g,'')
                                .replace(/([^\/\:])\/\//g,'$1/')
                  })
                  .filter(function(file){return !hidden_folder.test(file)});
  console.log(files);
  chrome.extension.sendRequest({
      'files' : files
    }, function(data){
      var percent = Math.round(100*data.done/(data.todo+data.done));
      if(data.todo+data.done == 0){
        percent = 100;
      }
      console.log(percent,data.todo,data.done);
      document.title = percent + '%';
      document.body.innerHTML = '<div style="margin: 4px;position:absolute;top:0;left:0;width:99%;"><div style="border-radius: 3px;  background: -webkit-gradient(linear, left top, left bottom, from(#15AE00), to(#72F161));font-family:sans-serif;width:'+percent+'%;"><div style=" padding: 10px;">Indexed '+percent+'% Completed '+data.done+' Remaining: '+data.todo+'</div></div></div>';
      if(data.next){    
        setTimeout(function(){
          location = data.next+'?do_index';
        },250);
      }else{
        document.body.innerHTML += '<br><br><h1>Done Indexing Files</h1>';
      }
    });
  document.body.innerHTML = 'Indexing Files...';
}else if(is_folder.test(location.href)){
  chrome.extension.sendRequest({action:'showInfobar'});
}

chrome.extension.onRequest.addListener(function(event){
  if(event.action == 'doIndex'){
    location = '?do_index';
  }
})
