/* TORPED install prompt: Android/Chrome native prompt + iOS Safari instructions */
(function(){
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)return;
  try{if(localStorage.getItem('torped-install-dismissed')>Date.now())return}catch(e){}
  var ua=navigator.userAgent,isIOS=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var deferred=null,bar;
  function dismiss(){bar&&bar.remove();try{localStorage.setItem('torped-install-dismissed',Date.now()+7*864e5)}catch(e){}}
  function show(html,onInstall){
    bar=document.createElement('div');bar.className='install-bar';bar.setAttribute('role','dialog');
    bar.innerHTML='<img src="icon-192.png" alt="" width="44" height="44"><div class="ib-t">'+html+'</div>'+
      (onInstall?'<button class="ib-go" type="button">تثبيت · Install</button>':'')+'<button class="ib-x" type="button" aria-label="Close">✕</button>';
    document.body.appendChild(bar);
    bar.querySelector('.ib-x').onclick=dismiss;
    if(onInstall)bar.querySelector('.ib-go').onclick=onInstall;
  }
  addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();deferred=e;
    show('<b>ثبّت تطبيق توربيد</b><small>Add TORPED to your home screen</small>',function(){
      deferred.prompt();deferred.userChoice.finally(function(){deferred=null;bar&&bar.remove()});
    });
  });
  addEventListener('appinstalled',function(){bar&&bar.remove()});
  if(isIOS&&/safari/i.test(ua)&&!/crios|fxios|edgios/i.test(ua)){
    setTimeout(function(){
      show('<b>ثبّت التطبيق: اضغط ⬆︎ مشاركة ثم «إضافة إلى الشاشة الرئيسية»</b><small>Tap Share ⬆︎ then “Add to Home Screen”</small>');
    },2500);
  }
})();
