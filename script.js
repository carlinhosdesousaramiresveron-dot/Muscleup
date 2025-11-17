// 🔹 Seletores
const profileScreen = document.getElementById("profileScreen");
const mainScreen = document.getElementById("mainScreen");
const workoutScreen = document.getElementById("workoutScreen");
const statsScreen = document.getElementById("statsScreen");

const avatarSelect = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatarPreview");
const saveProfileBtn = document.getElementById("saveProfileBtn");

// 🔹 Atualiza preview do avatar
avatarSelect.addEventListener("change", () => {
  avatarPreview.innerHTML = `<img src="${avatarSelect.value}" class="avatar-img">`;
});

// 🔹 Salvar perfil
saveProfileBtn.addEventListener("click", () => {
  const user = {
    nome: document.getElementById("nome").value,
    idade: document.getElementById("idade").value,
    altura: document.getElementById("altura").value,
    peso: document.getElementById("peso").value,
    avatar: avatarSelect.value
  };

  localStorage.setItem("user", JSON.stringify(user));
  carregarUsuario();
  profileScreen.classList.add("hide");
  mainScreen.classList.remove("hide");
});

// 🔹 Carregar usuário salvo
function carregarUsuario() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  document.getElementById("welcomeName").innerText = `Olá, ${user.nome}!`;
  document.getElementById("userObjective").innerText = "Seu objetivo está configurado.";
}

// 🔹 Grupos musculares + suas imagens
const grupos = [
  { nome: "Peito", img: "treino-peito.png" },
  { nome: "Costas", img: "treino-costas.png" },
  { nome: "Braços", img: "treino-braco.png" },
  { nome: "Pernas", img: "treino-perna.png" },
  { nome: "Abdômen", img: "treino-abdomen.png" },
  { nome: "Aquecimento", img: "treino-aquecimento.png" }
];

const groupButtons = document.getElementById("groupButtons");

// 🔹 Criar botões com imagens
grupos.forEach(g => {
  const btn = document.createElement("button");
  btn.classList.add("group-btn");
  btn.innerHTML = `
    <img src="${g.img}" class="group-icon">
    <span>${g.nome}</span>
  `;
  btn.addEventListener("click", () => abrirTreino(g));
  groupButtons.appendChild(btn);
});

// 🔹 Abrir tela de treino
function abrirTreino(grupo) {
  document.getElementById("groupTitle").innerText = grupo.nome;
  workoutScreen.classList.remove("hide");
  mainScreen.classList.add("hide");

  document.getElementById("exerciseArea").innerHTML = `
    <div class="exercise">
      <img src="${grupo.img}" class="exercise-img">
      <h4>${grupo.nome}</h4>
      <p>Faça 3 séries de 12 repetições.</p>
    </div>
  `;
}

// 🔹 Botão voltar
document.getElementById("backToMain").addEventListener("click", () => {
  workoutScreen.classList.add("hide");
  mainScreen.classList.remove("hide");
});

// 🔹 Carrega usuário automaticamente
carregarUsuario();

// 🔹 Registrar service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
