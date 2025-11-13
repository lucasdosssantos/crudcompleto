// register.js
const API = 'http://localhost:3000/users';

document.getElementById('btnRegister').addEventListener('click', async () => {
  const fields = ['nome','sobrenome','cpf','email','senha','rua','cep','cidade','estado','telefone'];
  const data = {};
  for (const f of fields) {
    data[f] = document.getElementById(f).value.trim();
    if (!data[f]) { alert('Preencha todos os campos'); return; }
  }

  // verificar se cpf ou email já existe
  try {
    const respCpf = await fetch(`${API}?cpf=${encodeURIComponent(data.cpf)}`);
    const cpfExists = await respCpf.json();
    if (cpfExists.length) { alert('CPF já cadastrado'); return; }

    const respEmail = await fetch(`${API}?email=${encodeURIComponent(data.email)}`);
    const emailExists = await respEmail.json();
    if (emailExists.length) { alert('Email já cadastrado'); return; }

    // role padrão user
    data.role = 'user';

    // salvar novo usuário
    const res = await fetch(API, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Cadastro realizado com sucesso. Faça login.');
      window.location.href = 'index.html';
    } else {
      alert('Erro ao cadastrar.');
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão com servidor.');
  }
});
