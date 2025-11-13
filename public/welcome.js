// welcome.js
const API = 'users';

function getSession(){
  const s = localStorage.getItem('sessionUser');
  return s ? JSON.parse(s) : null;
}

const session = getSession();
if (!session) {
  alert('Você precisa fazer login.');
  window.location.href = 'index.html';
} else {
  // buscar dados do usuário logado
  fetch(`${API}/${session.id}`)
    .then(r => r.json())
    .then(user => {
      document.getElementById('welcomeMsg').textContent = `Bem-vindo à Nubank, ${user.nome}!`;
      document.getElementById('userName').textContent = `${user.nome} ${user.sobrenome}`;
      document.getElementById('userEmail').textContent = user.email;

      // se for admin, mostrar botão Admin
      if (user.role === 'admin') {
        document.getElementById('btnAdmin').style.display = 'inline-block';
      } else {
        document.getElementById('btnAdmin').style.display = 'none';
      }
    })
    .catch(err => console.error(err));
}

document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('sessionUser');
  window.location.href = 'index.html';
});

document.getElementById('btnAdmin').addEventListener('click', () => {
  // só redireciona se o usuário for admin
  const session = getSession();
  if (session && session.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    alert('Acesso restrito a administradores.');
  }
});

