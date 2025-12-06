// Script para pesquisa com debounce - escuta múltiplos inputs com classe `search-input`
(() => {
  const inputs = Array.from(document.querySelectorAll('.search-input'));
  if (!inputs.length) return;

  const jogos = Array.from(document.querySelectorAll('.catalogo a'));

  const debounce = (fn, wait = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const getSelectedCategory = () => {
    const sel = document.getElementById('categorySelect');
    return sel ? sel.value : 'all';
  };

  const filtrar = (termo) => {
    const q = termo.trim().toLowerCase();
    const selectedCategory = getSelectedCategory();
    jogos.forEach(jogo => {
      const img = jogo.querySelector('img');
      const nome = img && img.alt ? img.alt.toLowerCase() : '';
      const cat = jogo.dataset && jogo.dataset.category ? jogo.dataset.category : 'all';

      const matchesText = nome.includes(q);

      // Suporta múltiplas categorias no atributo `data-category`, separadas por vírgula.
      // Ex: "terror, multiplayer" -> ['terror', 'multiplayer']
      const normalize = s => (s || '').toString().trim().toLowerCase();
      const selected = normalize(selectedCategory);
      let matchesCategory = false;
      if (selected === 'all') {
        matchesCategory = true;
      } else {
        const catList = cat.split(',').map(c => normalize(c));
        matchesCategory = catList.includes(selected);
      }

      jogo.style.display = (matchesText && matchesCategory) ? 'inline-block' : 'none';
    });
  };

  const handler = debounce((value) => filtrar(value));

  inputs.forEach(input => {
    input.addEventListener('input', (e) => handler(e.target.value));

    // Enter no campo dispara pesquisa imediatamente e emite evento para fechar sidebar
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filtrar(e.target.value);
        // sinaliza para o menu lateral (se aberto) que o usuário submeteu uma busca
        document.dispatchEvent(new CustomEvent('sidebar:submit'));
      }
    });
  });

  // Botões de pesquisa dentro do sidebar
  const sidebarSearchButtons = Array.from(document.querySelectorAll('.sidebar-search button'));
  sidebarSearchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parent = btn.closest('.sidebar-search');
      if (!parent) return;
      const input = parent.querySelector('.search-input');
      if (!input) return;
      filtrar(input.value);
      document.dispatchEvent(new CustomEvent('sidebar:submit'));
    });
  });

  // Filtrar por categoria quando o seletor mudar
  const categorySelect = document.getElementById('categorySelect');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      const mainSearch = document.getElementById('searchBar');
      const q = mainSearch ? mainSearch.value : '';
      filtrar(q);
      document.dispatchEvent(new CustomEvent('category:change', { detail: { category: e.target.value } }));
    });
  }

  // Dropdown visual: abrir/fechar e seleção via botões
  const categoryBtn = document.getElementById('categoryBtn');
  const categoryDropdown = document.getElementById('categoryDropdown');
  if (categoryBtn && categoryDropdown) {
    const closeDropdown = () => {
      categoryDropdown.classList.remove('show');
      categoryDropdown.setAttribute('aria-hidden', 'true');
      categoryBtn.setAttribute('aria-expanded', 'false');
    };
    const openDropdown = () => {
      categoryDropdown.classList.add('show');
      categoryDropdown.setAttribute('aria-hidden', 'false');
      categoryBtn.setAttribute('aria-expanded', 'true');
    };

    categoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (categoryDropdown.classList.contains('show')) closeDropdown();
      else openDropdown();
    });

    // Escolha de categoria pelo dropdown
    const options = Array.from(categoryDropdown.querySelectorAll('.category-option'));
    options.forEach(opt => {
      opt.addEventListener('click', (ev) => {
        const val = opt.dataset.value;
        if (categorySelect) {
          categorySelect.value = val;
          // dispara evento de change para reaplicar filtro
          const evt = new Event('change', { bubbles: true });
          categorySelect.dispatchEvent(evt);
        } else {
          // fallback: chama filtrar diretamente
          const mainSearch = document.getElementById('searchBar');
          const q = mainSearch ? mainSearch.value : '';
          filtrar(q);
        }
        closeDropdown();
      });
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (ev) => {
      if (!categoryDropdown.contains(ev.target) && ev.target !== categoryBtn) {
        closeDropdown();
      }
    });

    // Fecha com ESC
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeDropdown();
    });
  }

})();