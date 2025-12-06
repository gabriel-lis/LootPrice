const formCadastro = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

formCadastro.addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const email = document.getElementById("email").value.trim();
  const birthdate = document.getElementById("nascimento").value;;

  // Campos obrigatórios
  if (!username || !password || !confirmPassword || !email || !birthdate) {
    mensagem.innerText = "❌ Preencha todos os campos obrigatórios!";
    mensagem.classList.add("erro");
    mensagem.classList.remove("sucesso");
    return;
  }

  // Validação de email
  if (!email.endsWith("@gmail.com")) {
    mensagem.innerText = "❌ O email inválido!";
    mensagem.classList.add("erro");
    mensagem.classList.remove("sucesso");
    return;
  }

  // Rquisitos da senha
  if (password.length < 6) {
    mensagem.innerText = "❌ A senha deve ter pelo menos 6 caracteres!";
    mensagem.classList.add("erro");
    mensagem.classList.remove("sucesso");
    return;
  }

  // Validação de confirmação de senha
  if (password !== confirmPassword) {
    mensagem.innerText = "❌ As senhas não coincidem!";
    mensagem.classList.add("erro");
    mensagem.classList.remove("sucesso");
    return;
  }

  // Validação de data de nascimento
  const dataNascimento = new Date(birthdate);
  const hoje = new Date();
  if (dataNascimento > hoje) {
    mensagem.innerText = "❌ Data de nascimento inválida!";
    mensagem.classList.add("erro");
    mensagem.classList.remove("sucesso");
    return;
  }

  // Recupera usuários do localStorage
  let usuarios = [];
  try {
    usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  } catch {
    usuarios = [];
  }

  // Verifica se o username já existe
  const usuarioExistente = usuarios.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (usuarioExistente) {
    mensagem.innerText = "❌ Este nome de usuário já está em uso!";
    mensagem.classList.add("erro");
    mensagem.classList.remove("sucesso");
    return;
  }

  // Cria novo usuário
  const novoUsuario = { username, password, email, birthdate };

  // localStorage 
  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mensagem.innerText = "✅ Cadastro realizado com sucesso! Redirecionando para login...";
  mensagem.classList.add("sucesso");
  mensagem.classList.remove("erro");

  // redireciona para a página de login após curta pausa (não loga automaticamente)
  formCadastro.reset();
  setTimeout(() => { window.location.href = 'login.html'; }, 1100);
});

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