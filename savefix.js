// Compatibility patch for Pebichubi save-code imports.
window.readCode=function(c){
  try{
    c=(c||'').trim().replace(/[\u200B-\u200D\uFEFF]/g,'');
    if(!c)return null;

    // Accept percent-encoded text copied through some iOS share/clipboard flows.
    try{ c=decodeURIComponent(c); }catch(e){}

    let d=null;
    if(c[0]==='{'){
      d=JSON.parse(c);
    }else{
      const m=c.match(/^PEBI(?:1)?:/i);
      if(!m)return null;

      let b64=c.slice(m[0].length)
        .replace(/\s+/g,'')
        .replace(/-/g,'+')
        .replace(/_/g,'/');
      while(b64.length%4)b64+='=';

      const bin=atob(b64);
      let txt='';
      try{
        const bytes=Uint8Array.from(bin,ch=>ch.charCodeAt(0));
        txt=new TextDecoder('utf-8',{fatal:false}).decode(bytes);
      }catch(e){
        txt=decodeURIComponent(escape(bin));
      }
      d=JSON.parse(txt);
    }

    if(!d||typeof d!=='object'||Array.isArray(d))return null;
    return ('food' in d || 'lv' in d || 'money' in d || 'name' in d || 'crew' in d) ? d : null;
  }catch(e){
    return null;
  }
};
