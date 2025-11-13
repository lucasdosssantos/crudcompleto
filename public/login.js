// login.js
const API = 'users';

document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) { alert('Preencha email e senha'); return; }

  try {
    // buscar usuário com email
    const res = await fetch(`${API}?email=${encodeURIComponent(email)}`);
    const users = await res.json();
    if (!users.length) { alert('Usuário não encontrado'); return; }

    const user = users[0];
    if (user.senha !== senha) { alert('Senha incorreta'); return; }

    // salvar sessão simples
    localStorage.setItem('sessionUser', JSON.stringify({ id: user.id, role: user.role || 'user' }));
    // redireciona para welcome
    window.location.href = 'welcome.html';
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o servidor. Verifique o json-server.');
  }
});

