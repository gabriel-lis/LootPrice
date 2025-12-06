(() => {
  // Não encerrar cedo: queremos aplicar o tema salvo mesmo quando não houver
  // um botão `#theme-toggle` na página (p.ex. páginas simples de jogos/login).
  const toggleBtn = document.getElementById('theme-toggle');

  const setTheme = (theme) => {

    /* --- INÍCIO DO FADE SUAVE DO SITE --- */
    document.body.classList.add('theme-fade');
    setTimeout(() => document.body.classList.remove('theme-fade'), 350);
    /* --- FIM DO FADE SUAVE --- */

    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');

    // Atualiza o ícone dentro do botão (se existir)
    try {
      const tBtn = document.getElementById('theme-toggle');
      if (tBtn) {
        let icon = tBtn.querySelector('.theme-icon');
        if(!icon){
          icon = document.createElement('img');
          icon.className = 'theme-icon';
          tBtn.appendChild(icon);
        }
        // Determinar caminho base das imagens a partir do logo (garante caminhos corretos em subpastas)
        let basePath = 'fotos/extras/';
        try{
          const logo = document.getElementById('lootprice-logo');
          if(logo && logo.src){
            basePath = logo.src.replace(/[^/]*$/, '');
          }
        }catch(e){}

        const darkSrc = basePath + 'dark-mode.png';
        const lightSrc = basePath + 'light-mode.png';
        icon.src = theme === 'light' ? darkSrc : lightSrc;
        icon.alt = theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';
      }
    } catch (e) {}
    localStorage.setItem('theme', theme);

    // troca o logo com crossfade
    try {
      const logo = document.getElementById('lootprice-logo');
      if (logo) {
        const nextSrc = theme === 'light'
          ? 'fotos/extras/logoltlight.png'
          : 'fotos/extras/logoltdark.png';

        const overlay = document.createElement('img');
        overlay.src = nextSrc;
        overlay.style.position = 'absolute';
        overlay.style.width = logo.offsetWidth + 'px';
        overlay.style.height = logo.offsetHeight + 'px';
        overlay.style.left = logo.getBoundingClientRect().left + 'px';
        overlay.style.top = logo.getBoundingClientRect().top + 'px';
        overlay.style.transition = 'opacity 0.25s ease';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
          overlay.style.opacity = '1';
          logo.style.opacity = '0';
        });

        setTimeout(() => {
          logo.src = nextSrc;
          logo.style.opacity = '1';
          if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 260);
      }
    } catch (e) {}
  };

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
    // localStorage.setItem já é feito dentro de setTheme, outros tabs recebem via storage event
  });

  // Sincroniza entre abas: quando outra aba muda localStorage, aplicar o novo tema aqui
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    if (e.key === 'theme') {
      const newTheme = e.newValue || 'dark';
      // Evitar repetir se já estiver igual
      const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      if (cur !== newTheme) setTheme(newTheme);
    }
  });
})();
