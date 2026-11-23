/* GrisData · acceso. FVL · Valida contra el servicio PHP del subdominio api.grisdata.com (base grisdatalabs). */
(function(){
 var API=(window.GD_API||'https://api.grisdata.com/fvl').replace(/\/$/,'');
 var S=document.currentScript,BASE=S&&S.src?new URL('../',S.src).href:'/fvl/';
 var HOME=BASE+'proyectos.html';
 function call(path,opt){return fetch(API+'/'+path,Object.assign({credentials:'include'},opt||{})).then(function(r){return r.json().catch(function(){return null}).then(function(d){return{ok:r.ok,status:r.status,data:d}})})}
 var GD={base:BASE,home:HOME,
  me:function(){return call('verify.php').then(function(r){return r.ok&&r.data&&r.data.ok?r.data:null}).catch(function(){return null})},
  login:function(usuario,clave){return call('login.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usuario:usuario,clave:clave})})
    .then(function(r){if(!r.ok)throw new Error((r.data&&r.data.error)||'No se pudo iniciar sesión.');return r.data},
          function(){throw new Error('No se pudo conectar con el servidor de acceso.')})},
  logout:function(){return call('logout.php',{method:'POST'}).catch(function(){}).then(function(){location.href=BASE})},
  guard:function(){return GD.me().then(function(u){
    if(!u){var rel=location.href.slice(BASE.length).split('#')[0];location.replace(BASE+(rel?'?next='+encodeURIComponent(rel):''));return null}
    document.body.classList.remove('gd-lock');
    var box=document.getElementById('gd-user');
    if(box){var n=u.nombre||'Usuario',p=n.trim().split(/\s+/);
     document.getElementById('gd-av').textContent=((p[0]||'')[0]||'U').toUpperCase()+((p[1]||'')[0]||'').toUpperCase();
     document.getElementById('gd-un').textContent=n;box.hidden=false;
     document.getElementById('gd-out').onclick=GD.logout}
    return u})},
  nextUrl:function(){var n=new URLSearchParams(location.search).get('next');
    return n&&/^[\w\-.\/]*(\?[\w=&%.\-]*)?$/.test(n)&&n.indexOf('..')<0&&n.charAt(0)!=='/'?BASE+n:HOME}
 };
 window.GD=GD})();
