(function(){
  const area = document.getElementById('users-area');

  function getUsers(){
    try{ return JSON.parse(localStorage.getItem('usuarios')) || []; } catch(e){ return []; }
  }

  function saveUsers(users){
    localStorage.setItem('usuarios', JSON.stringify(users));
  }

  function createTable(users){
    if(!users || users.length === 0){
      area.innerHTML = '<div class="no-users">Nenhum usuário cadastrado.</div>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'admin-table';

    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Usuário</th><th>Email</th><th>Data de Nascimento</th><th>Ações</th></tr>';
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    users.forEach((u, idx) => {
      const tr = document.createElement('tr');
      tr.dataset.index = idx;

      const tdUser = document.createElement('td');
      tdUser.textContent = u.username;

      const tdEmail = document.createElement('td');
      tdEmail.textContent = u.email;

      const tdBirth = document.createElement('td');
      tdBirth.textContent = u.birthdate || '';

      const tdActions = document.createElement('td');

      const editBtn = document.createElement('button');
      editBtn.className = 'action-btn action-edit';
      editBtn.textContent = 'Editar';
      editBtn.addEventListener('click', () => enterEditMode(tr, u, idx));

      const delBtn = document.createElement('button');
      delBtn.className = 'action-btn action-delete';
      delBtn.textContent = 'Excluir';
      delBtn.addEventListener('click', () => removeUser(idx));

      tdActions.appendChild(editBtn);
      tdActions.appendChild(delBtn);

      tr.appendChild(tdUser);
      tr.appendChild(tdEmail);
      tr.appendChild(tdBirth);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    area.innerHTML = '';
    area.appendChild(table);
  }

  function enterEditMode(row, user, index){
    // substitui cols por inputs
    row.innerHTML = '';

    const tdUser = document.createElement('td');
    const inpUser = document.createElement('input');
    inpUser.className = 'user-input';
    inpUser.value = user.username;
    tdUser.appendChild(inpUser);

    const tdEmail = document.createElement('td');
    const inpEmail = document.createElement('input');
    inpEmail.className = 'user-input';
    inpEmail.value = user.email;
    tdEmail.appendChild(inpEmail);

    const tdBirth = document.createElement('td');
    const inpBirth = document.createElement('input');
    inpBirth.className = 'user-input';
    inpBirth.type = 'date';
    inpBirth.value = user.birthdate || '';
    tdBirth.appendChild(inpBirth);

    const tdActions = document.createElement('td');

    const saveBtn = document.createElement('button');
    saveBtn.className = 'action-btn action-save';
    saveBtn.textContent = 'Salvar';
    saveBtn.addEventListener('click', () => saveEdit(index, inpUser.value.trim(), inpEmail.value.trim(), inpBirth.value));

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'action-btn action-cancel';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.addEventListener('click', () => render());

    tdActions.appendChild(saveBtn);
    tdActions.appendChild(cancelBtn);

    row.appendChild(tdUser);
    row.appendChild(tdEmail);
    row.appendChild(tdBirth);
    row.appendChild(tdActions);
  }

  function saveEdit(index, newUsername, newEmail, newBirth){
    const users = getUsers();
    if(!newUsername || !newEmail){
      alert('Usuário e email são obrigatórios.');
      return;
    }
    // verifica duplicidade de username (exclui o próprio index)
    const exists = users.some((u,i) => i !== index && u.username.toLowerCase() === newUsername.toLowerCase());
    if(exists){
      alert('Este nome de usuário já está em uso. Escolha outro.');
      return;
    }

    users[index].username = newUsername;
    users[index].email = newEmail;
    users[index].birthdate = newBirth || '';
    saveUsers(users);
    render();
    alert('Usuário atualizado com sucesso.');
  }

  function removeUser(index){
    if(!confirm('Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.')) return;
    const users = getUsers();
    users.splice(index,1);
    saveUsers(users);
    render();
  }

  function render(){
    const users = getUsers();
    createTable(users);
  }

  // Inicial
  document.addEventListener('DOMContentLoaded', () => {
    // proteção simples: redireciona se não for admin
    try{
      const logged = JSON.parse(localStorage.getItem('loggedUser')) || null;
      const path = window.location.pathname.replace(/\\\\/g, '/');
      const segs = path.split('/').filter(Boolean);
      const rootIdx = segs.findIndex(s => s === 'LootPrice 22');
      let prefix = '';
      if (rootIdx !== -1){
        const levelsBelow = segs.length - rootIdx - 1;
        for(let i=1;i<levelsBelow;i++) prefix += '../';
      }
      if(!logged || (logged.username && logged.username.toLowerCase() !== 'admin')){
        alert('Acesso restrito: página de administração. Você será redirecionado.');
        window.location.href = prefix + 'index.html';
        return;
      }
    }catch(e){ /* continuar mesmo se erro */ }
    render();
  });

})();