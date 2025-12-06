 (function(){
	// Script responsável por renderizar a área de autenticação na navbar
	// Procura por um elemento com id `auth-area` e injeta o botão de tema, o
	// greeting do usuário e o botão de logout quando `localStorage.loggedUser` existe.

	const authArea = document.getElementById('auth-area');
	const logo = document.getElementById('lootprice-logo');

	function initLogo(){
		try {
			const theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
			if (logo) logo.src = theme === 'light' ? 'fotos/extras/logoltlight.png' : 'fotos/extras/logoltdark.png';
		} catch(e){}
	}

	function renderAuth(){
		if (!authArea) return;
		const logged = JSON.parse(localStorage.getItem('loggedUser'));
		// preserva o botão #theme-toggle se existir no DOM
		const themeBtn = document.getElementById('theme-toggle');
		authArea.innerHTML = '';
		if (themeBtn) authArea.appendChild(themeBtn);

		if (logged) {
			const span = document.createElement('span');
			span.id = 'user-greet';
			span.className = 'user-greet';
			span.textContent = 'Olá, ' + logged.username;
			span.style.margin = '0 10px';
			// adiciona a inicial como atributo para ser usada pelo CSS (::before)
			try { span.dataset.initial = logged.username.charAt(0).toUpperCase(); } catch(e){}
			span.setAttribute('aria-label', 'Usuário ' + logged.username);

			const btn = document.createElement('button');
			btn.id = 'logout-btn';
			btn.className = 'btn-logout';
			btn.textContent = 'Sair';
			btn.addEventListener('click', () => {
				localStorage.removeItem('loggedUser');
				renderAuth();
				// recarrega para atualizar estado em toda a página
				location.reload();
			});

			authArea.appendChild(span);
			authArea.appendChild(btn);
					// se o usuário for admin, tenta injetar o link Admin no sidebar
					try { if (logged.username && logged.username.toLowerCase() === 'admin') injectAdminLink(); } catch(e){}
		} else {
			const loginLink = document.createElement('a');
			loginLink.href = 'sites/login/login.html';
			loginLink.textContent = 'Entrar';
			loginLink.className = 'btn-login';
			loginLink.style.marginLeft = '8px';
			authArea.appendChild(loginLink);

			const regLink = document.createElement('a');
			regLink.href = 'sites/login/cadastro.html';
			regLink.textContent = 'Registrar';
			regLink.className = 'btn-login';
			regLink.style.marginLeft = '8px';
			authArea.appendChild(regLink);
		}
	}

		// calcula prefixo relativo para chegar ao root do projeto (onde index.html está)
		function computePrefixToRoot(){
			try {
				const path = window.location.pathname.replace(/\\\\/g, '/');
				const segs = path.split('/').filter(Boolean);
				const rootIdx = segs.findIndex(s => s === 'LootPrice 22');
				if (rootIdx === -1) return '';
				const levelsBelow = segs.length - rootIdx - 1; // arquivos after root
				let prefix = '';
				for(let i=1;i<levelsBelow;i++) prefix += '../';
				return prefix;
			} catch(e){ return ''; }
		}

		function injectAdminLink(){
			const sidebar = document.getElementById('sidebar');
			if(!sidebar) return;
			if(sidebar.querySelector('a[data-admin-link]')) return; // já inserido
			const prefix = computePrefixToRoot();
			const a = document.createElement('a');
			a.href = prefix + 'sites/admin/admin.html';
			a.textContent = 'Admin';
			a.setAttribute('data-admin-link','1');
			// insere antes dos últimos links (após Sobre)
			sidebar.appendChild(a);
		}

	// Inicializa
	document.addEventListener('DOMContentLoaded', () => {
		initLogo();
		renderAuth();
	});
})();
