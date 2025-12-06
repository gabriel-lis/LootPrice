const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebarClose = document.getElementById('sidebar-close');

function openSidebar(){
  if(!sidebar) return;
  sidebar.classList.add('active');
  if(sidebarBackdrop) sidebarBackdrop.classList.add('show');
  document.body.classList.add('no-scroll');
  // marcar como dialog para acessibilidade
  sidebar.setAttribute('aria-hidden','false');
  sidebar.setAttribute('aria-modal','true');
  sidebar.setAttribute('role','dialog');
  // foco automático no campo de busca do sidebar, se existir
  const sbInput = sidebar.querySelector('#sidebarSearchBar');
  if(sbInput){
    // delay para aguardar animação de abertura
    setTimeout(() => {
      try{ sbInput.focus(); sbInput.select(); } catch(e){}
    }, 220);
  }
}

function closeSidebar(){
  if(!sidebar) return;
  sidebar.classList.remove('active');
  if(sidebarBackdrop) sidebarBackdrop.classList.remove('show');
  document.body.classList.remove('no-scroll');
  sidebar.setAttribute('aria-hidden','true');
  sidebar.removeAttribute('aria-modal');
  sidebar.removeAttribute('role');
}

if(menuBtn){
  menuBtn.addEventListener('click', () => {
    // toggle based on current state
    if(sidebar.classList.contains('active')) closeSidebar();
    else openSidebar();
  });
}

if(sidebarBackdrop){
  sidebarBackdrop.addEventListener('click', closeSidebar);
}

if(sidebarClose){
  sidebarClose.addEventListener('click', closeSidebar);
}

// Close with Escape key
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && sidebar && sidebar.classList.contains('active')){
    closeSidebar();
  }
});

// Fecha o sidebar quando a pesquisa é submetida (evento disparado por pesquisa.js)
document.addEventListener('sidebar:submit', () => {
  if(sidebar && sidebar.classList.contains('active')) closeSidebar();
});