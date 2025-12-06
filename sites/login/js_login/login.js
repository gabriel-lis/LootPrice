(function(){
      const authArea = document.getElementById('auth-area');
      const logo = document.getElementById('lootprice-logo');

      // Atualiza logo conforme tema salvo
      (function initLogo(){
        try {
          const theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
          if (logo) logo.src = theme === 'light' ? '../../fotos/extras/logoltlight.png' : '../../fotos/extras/logoltdark.png';
        } catch(e){}
      })();

      const renderAuth = () => {
        const logged = JSON.parse(localStorage.getItem('loggedUser'));
        const themeBtn = document.getElementById('theme-toggle');
        authArea.innerHTML = '';
        if (themeBtn) authArea.appendChild(themeBtn);

        if (logged) {
          const span = document.createElement('span');
          span.id = 'user-greet';
          span.textContent = 'Olá, ' + logged.username;
          span.style.margin = '0 10px';
          const btn = document.createElement('button');
          btn.id = 'logout-btn';
          btn.textContent = 'Sair';
          btn.addEventListener('click', () => {
            localStorage.removeItem('loggedUser');
            renderAuth();
            location.reload();
          });
          authArea.appendChild(span);
          authArea.appendChild(btn);
        } else {
          const loginLink = document.createElement('a');
          loginLink.href = 'login.html';
          loginLink.textContent = 'Entrar';
          loginLink.className = 'btn-login';
          loginLink.style.marginLeft = '8px';
          authArea.appendChild(loginLink);
          const regLink = document.createElement('a');
          regLink.href = 'cadastro.html';
          regLink.textContent = 'Registrar';
          regLink.className = 'btn-login';
          regLink.style.marginLeft = '8px';
          authArea.appendChild(regLink);
        }
      };

      renderAuth();
    })();

    // Barra superior: tema e estado de login
    (function() {
      const formLogin = document.getElementById("formLogin");
      const mensagem = document.getElementById("mensagem");
      const authArea = document.getElementById('auth-area');
      const logo = document.getElementById('lootprice-logo');

      // Atualiza logo conforme tema salvo (darkmode.js também troca quando o botão for clicado)
      (function initLogo(){
        try {
          const theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
          if (logo) logo.src = theme === 'light' ? '../../fotos/extras/logoltlight.png' : '../../fotos/extras/logoltdark.png';
        } catch(e){}
      })();

      const renderAuth = () => {
        const logged = JSON.parse(localStorage.getItem('loggedUser'));
        // preserva o botão #theme-toggle se existir
        const themeBtn = document.getElementById('theme-toggle');
        authArea.innerHTML = '';
        if (themeBtn) authArea.appendChild(themeBtn);

        if (logged) {
          const span = document.createElement('span');
          span.id = 'user-greet';
          span.textContent = 'Olá, ' + logged.username;
          span.style.margin = '0 10px';
          const btn = document.createElement('button');
          btn.id = 'logout-btn';
          btn.textContent = 'Sair';
          btn.addEventListener('click', () => {
            localStorage.removeItem('loggedUser');
            renderAuth();
            location.reload();
          });
          authArea.appendChild(span);
          authArea.appendChild(btn);
        } else {
          const loginLink = document.createElement('a');
          loginLink.href = 'login.html';
          loginLink.textContent = 'Entrar';
          loginLink.className = 'btn-login';
          loginLink.style.marginLeft = '8px';
          authArea.appendChild(loginLink);
          const regLink = document.createElement('a');
          regLink.href = 'cadastro.html';
          regLink.textContent = 'Registrar';
          regLink.className = 'btn-login';
          regLink.style.marginLeft = '8px';
          authArea.appendChild(regLink);
        }
      };

      renderAuth();

      formLogin.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioValido = usuarios.find(u => u.username === username && u.password === password);

        if (usuarioValido) {
          // marca como logado
          localStorage.setItem('loggedUser', JSON.stringify({ username: usuarioValido.username, email: usuarioValido.email }));
          mensagem.innerText = "✅ Login realizado com sucesso!";
          mensagem.className = "mensagem sucesso";
          renderAuth();
          // depois de logar, redireciona para a página inicial
          setTimeout(() => { window.location.href = '../../index.html'; }, 800);
        } else {
          mensagem.innerText = "❌ Usuário ou senha inválidos!";
          mensagem.className = "mensagem erro";
        }
      });

    })();