// Atualiza os ícones das plataformas conforme o tema (light <-> dark)
(function(){
  function getFilename(url){
    try{ return url.split('/').pop().split('?')[0].split('#')[0]; }catch(e){return url}
  }

  function buildSiblingNames(filename){
    // Ex: epic.png -> {light: 'epic.png', dark: 'darkepic.png'}
    if(!filename) return {light: filename, dark: filename};
    if(/^dark/i.test(filename)){
      const light = filename.replace(/^dark/i, '');
      return {light, dark: filename};
    }
    return {light: filename, dark: 'dark' + filename};
  }

  function updatePlatformIcons(){
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const imgs = Array.from(document.querySelectorAll('img.platform-img'));
    imgs.forEach(img => {
      const src = img.getAttribute('src') || '';
      const filename = getFilename(src);
      const dir = src.replace(/[^/]*$/, '');
      const names = buildSiblingNames(filename);
      // Inverter a escolha: quando o tema for 'dark' usar a versão 'light' correspondente
      // (algumas páginas esperam o comportamento invertido). Se quiser o comportamento
      // contrário, troque a condição abaixo.
      const useName = theme === 'dark' ? names.light : names.dark;
      if(!useName) return;
      const newSrc = dir + useName;
      // Só troca se necessário
      if(newSrc !== src){
        img.src = newSrc;
      }
    });
  }

  // Observa mudanças no atributo data-theme do <html>
  const obs = new MutationObserver(muts => {
    for(const m of muts){
      if(m.type === 'attributes' && m.attributeName === 'data-theme'){
        updatePlatformIcons();
      }
    }
  });

  // Inicia obs quando o documentElement existir
  if(document.documentElement){
    obs.observe(document.documentElement, { attributes: true });
  }

  // Atualiza no carregamento
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updatePlatformIcons);
  } else updatePlatformIcons();

})();
