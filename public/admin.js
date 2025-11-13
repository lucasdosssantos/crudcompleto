// admin.js
const API = "users";

function getSession() {
  const s = localStorage.getItem("sessionUser");
  return s ? JSON.parse(s) : null;
}

// proteção de rota
const session = getSession();
if (!session || session.role !== "admin") {
  alert("Acesso negado. Entre como administrador.");
  window.location.href = "index.html";
}

// Inicialização dos Event Listeners (Garantindo que o btnLogout seja anexado)
document
  .getElementById("btnBack")
  .addEventListener("click", () => (window.location.href = "welcome.html"));
document.getElementById("btnRefresh").addEventListener("click", loadAllUsers);
document.getElementById("btnSearch").addEventListener("click", searchByCpf);
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("sessionUser");
  window.location.href = "index.html";
});

async function loadAllUsers() {
  try {
    const res = await fetch(API);
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    alert("Erro ao listar usuários (Verifique o json-server)");
  }
}

function renderUsers(users) {
  const container = document.getElementById("usersList");
  if (!container) {
    console.error("Elemento 'usersList' não encontrado.");
    return;
  }
  if (!users.length) {
    container.innerHTML = "<p>Nenhum usuário cadastrado</p>";
    return;
  }

  let html =
    '<table class="table"><thead><tr><th>Nome</th><th>CPF</th><th>Email</th><th>Telefone</th><th>Ações</th></tr></thead><tbody>';
  users.forEach((u) => {
    // CORREÇÃO MANTIDA: Adicionando aspas simples ('') em torno de ${u.id}
    // CHECAGEM DE NULOS ADICIONADA: Garantindo que u.sobrenome não cause erros
    html += `<tr>
<td>${u.nome || ""} ${u.sobrenome || ""}</td>
<td>${u.cpf || ""}</td>
<td>${u.email || ""}</td>
<td>${u.telefone || ""}</td>
<td>
<button class="action-btn action-edit" onclick="editUser('${
      u.id
    }')">Editar</button>
<button class="action-btn action-delete" onclick="deleteUser('${
      u.id
    }')">Apagar</button>
</td>
</tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

async function searchByCpf() {
  const cpf = document.getElementById("searchCpf").value.trim();
  if (!cpf) {
    alert("Digite um CPF");
    return;
  }
  try {
    const res = await fetch(`${API}?cpf=${encodeURIComponent(cpf)}`);
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error("Erro na busca:", err);
    alert("Erro na busca");
  }
}

window.editUser = async function (id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const u = await res.json();
    showEditModal(u);
  } catch (err) {
    console.error("Erro ao buscar usuário para edição:", err);
    alert("Erro ao buscar usuário");
  }
};

function showEditModal(user) {
  const modal = document.getElementById("editModal");
  const form = document.getElementById("editForm");
  // Monta o formulário dinamicamente, garantindo que valores nulos sejam strings vazias
  form.innerHTML = `
<input type="hidden" id="editId" value="${user.id || ""}" />
 <div class="form-group"><label>Nome</label><input id="editNome" value="${
   user.nome || ""
 }" /></div>
<div class="form-group"><label>Sobrenome</label><input id="editSobrenome" value="${
    user.sobrenome || ""
  }" /></div>
 <div class="form-group"><label>CPF</label><input id="editCpf" value="${
   user.cpf || ""
 }" /></div>
 <div class="form-group"><label>Email</label><input id="editEmail" value="${
   user.email || ""
 }" /></div>
<div class="form-group"><label>Rua</label><input id="editRua" value="${
    user.rua || ""
  }" /></div>
 <div class="form-group"><label>CEP</label><input id="editCep" value="${
   user.cep || ""
 }" /></div>
 <div class="form-group"><label>Cidade</label><input id="editCidade" value="${
   user.cidade || ""
 }" /></div>
 <div class="form-group"><label>Estado</label><input id="editEstado" value="${
   user.estado || ""
 }" /></div>
 <div class="form-group"><label>Telefone</label><input id="editTelefone" value="${
   user.telefone || ""
 }" /></div>
 `;
  modal.style.display = "flex";

  document.getElementById("btnCloseEdit").onclick = () => {
    modal.style.display = "none";
  };
  document.getElementById("btnSaveEdit").onclick = async () => {
    const id = document.getElementById("editId").value;
    // Restante da lógica de salvar
    const payload = {
      nome: document.getElementById("editNome").value.trim(),
      sobrenome: document.getElementById("editSobrenome").value.trim(),
      cpf: document.getElementById("editCpf").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      rua: document.getElementById("editRua").value.trim(),
      cep: document.getElementById("editCep").value.trim(),
      cidade: document.getElementById("editCidade").value.trim(),
      estado: document.getElementById("editEstado").value.trim(),
      telefone: document.getElementById("editTelefone").value.trim(),
    };
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Usuário atualizado");
        modal.style.display = "none";
        loadAllUsers();
      } else alert("Erro ao salvar no servidor.");
    } catch (err) {
      console.error("Erro de rede ao salvar:", err);
      alert("Erro ao salvar (Verifique o json-server)");
    }
  };
}

window.deleteUser = async function (id) {
  if (!confirm("Deseja realmente apagar este usuário?")) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Usuário apagado");
      loadAllUsers();
    } else alert("Erro ao apagar no servidor.");
  } catch (err) {
    console.error("Erro de rede ao apagar:", err);
    alert("Erro ao apagar (Verifique o json-server)");
  }
};

// carrega lista ao abrir (sem o DOMContentLoaded wrapper, para manter o estilo original)
loadAllUsers();

