(() => {
  // Cria navbar apenas se não existir
  if (document.querySelector('.jp-navbar')) return;

  const nav = document.createElement('header');
  nav.className = 'jp-navbar';

  // Caminho para a página inicial a partir das páginas em sites/jogos/
  const homePath = '../../index.html';

    nav.innerHTML = `
      <div class="left-section">
        <button id="menu-btn" class="menu-btn" aria-label="Abrir menu">☰</button>
        <a href="${homePath}" target="_top">
          <img id="lootprice-logo" src="../../fotos/extras/logoltdark.png" alt="LootPrice">
        </a>
      </div>
      <div class="auth-buttons">
        <button id="theme-toggle" class="btn-theme" aria-label="Alternar tema">
          <img src="../../fotos/extras/dark-mode.png" alt="Tema" class="theme-icon">
        </button>
      </div>
    `;

  document.body.insertAdjacentElement('afterbegin', nav);

  // Inserir sidebar (mesma estrutura do index) para que o menulateral.js funcione
  if (!document.getElementById('sidebar')) {
    const sidebar = document.createElement('nav');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `<a href=\"../../index.html\">Início</a>`;
    document.body.insertAdjacentElement('afterbegin', sidebar);
  }

  // Spacer para evitar sobreposição do conteúdo
  const spacer = document.createElement('div');
  spacer.className = 'jp-navbar-spacer';
  document.body.insertAdjacentElement('afterbegin', spacer);

  // Carrega CSS da navbar (se ainda não estiver carregado)
  const cssHref = 'css_jogos/navbar.css';
  if (!document.querySelector(`link[href="${cssHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  // Carrega o script do menu lateral (compatível com index)
  const sideScript = '../../js_index/menulateral.js';
  if (!document.querySelector(`script[src="${sideScript}"]`)) {
    const s = document.createElement('script');
    s.src = sideScript;
    s.defer = true;
    document.body.appendChild(s);
  }
  // Carrega script de auth global para renderizar estado do usuário
  const authScript = '../../js_index/auth.js';
  if (!document.querySelector(`script[src="${authScript}"]`)) {
    const a = document.createElement('script');
    a.src = authScript;
    a.defer = true;
    document.body.appendChild(a);
  }

  // Carrega script que atualiza ícones das plataformas quando o tema muda
  const platformScript = 'js_jogos/platform-icons.js';
  if (!document.querySelector(`script[src="${platformScript}"]`)) {
    const p = document.createElement('script');
    p.src = platformScript;
    p.defer = true;
    document.body.appendChild(p);
  }

    // theme toggle: usa o mesmo id que o index (`theme-toggle`) para compatibilidade
    const toggle = document.getElementById('theme-toggle');
    const logo = document.getElementById('lootprice-logo');

  const applyThemeToLogo = () => {
    const html = document.documentElement;
    const theme = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      if (logo) {
        const nextSrc = theme === 'light' ? '../../fotos/extras/logoltlight.png' : '../../fotos/extras/logoltdark.png';
        // crossfade local: reduz opacidade, troca src, volta opacidade
        logo.style.transition = 'opacity 0.25s ease';
        logo.style.opacity = '0';
        setTimeout(() => { logo.src = nextSrc; logo.style.opacity = '1'; }, 260);
      }
      if (toggle) {
        try{
          let icon = toggle.querySelector('.theme-icon');
          if(!icon){
            icon = document.createElement('img');
            icon.className = 'theme-icon';
            toggle.appendChild(icon);
          }
          // derive base path from logo if possible
          let basePath = '../../fotos/extras/';
          try{ if(logo && logo.src) basePath = logo.src.replace(/[^/]*$/, ''); }catch(e){}
          icon.src = theme === 'light' ? basePath + 'dark-mode.png' : basePath + 'light-mode.png';
          icon.alt = theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';
          toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        }catch(e){}
      }
  };

    if (toggle) {
      toggle.addEventListener('click', () => {
        const html = document.documentElement;
        const cur = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = cur === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        if (next === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode');
        localStorage.setItem('theme', next);
        applyThemeToLogo();
      });
    }

  // aplica no carregamento
  applyThemeToLogo();

  // Observa mudanças no atributo data-theme para atualizar logo/ícone quando o tema mudar
  try{
    const htmlEl = document.documentElement;
    const mo = new MutationObserver(() => applyThemeToLogo());
    mo.observe(htmlEl, { attributes: true, attributeFilter: ['data-theme'] });
  }catch(e){}

})();
