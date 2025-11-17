/* ============================
   FUNÇÕES DE TELAS
============================ */
function showScreen(screenId) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(screenId).style.display = "block";
}

/* ============================
   SALVAR PERFIL DO USUÁRIO
============================ */
function saveUserData() {
  const nome = document.getElementById("nome").value;
  const idade = Number(document.getElementById("idade").value);
  const altura = Number(document.getElementById("altura").value);
  const peso = Number(document.getElementById("peso").value);
  const avatar = document.getElementById("avatar").value;

  if (!nome || !idade || !altura || !peso) {
    alert("Preencha todos os campos!");
    return;
  }

  const userData = { nome, idade, altura, peso, avatar };
  localStorage.setItem("userData", JSON.stringify(userData));

  showWelcomeMessage(userData);
  calculateIMC(userData);

  showScreen("mainScreen");
}

/* ============================
   CARREGAR DADOS SALVOS
============================ */
function loadUserData() {
  const data = localStorage.getItem("userData");
  if (data) {
    const user = JSON.parse(data);

    document.getElementById("nome").value = user.nome;
    document.getElementById("idade").value = user.idade;
    document.getElementById("altura").value = user.altura;
    document.getElementById("peso").value = user.peso;
    document.getElementById("avatar").value = user.avatar;

    showWelcomeMessage(user);
    calculateIMC(user);

    showScreen("mainScreen");
  }
}

function showWelcomeMessage(user) {
  document.getElementById("welcomeMsg").innerText =
    `Bem-vindo(a), ${user.nome}!`;
}

/* ============================
   CÁLCULO DE IMC
============================ */
function calculateIMC(user) {
  const alturaM = user.altura / 100;
  const imc = (user.peso / (alturaM * alturaM)).toFixed(1);

  document.getElementById("imcResult").innerText = `Seu IMC: ${imc}`;

  let advice = "Continue treinando!";
  if (imc < 18.5) advice = "Você está abaixo do peso. Foque em ganho muscular!";
  if (imc >= 18.5 && imc <= 24.9) advice = "IMC ideal! Continue assim 💪";
  if (imc >= 25) advice = "Sobrepeso. Treinos regulares vão te ajudar!";

  document.getElementById("advice").innerText = advice;
}

/* ============================
   TREINOS POR GRUPO MUSCULAR
============================ */
const workoutGroups = {
  Peito: ["Supino reto - 3x12", "Supino inclinado - 3x10", "Crucifixo - 3x12"],
  Costas: ["Puxada aberta - 4x10", "Remada baixa - 3x12", "Serrote - 3x12"],
  Pernas: ["Agachamento - 4x12", "Leg press - 3x12", "Cadeira extensora - 3x15"],
  Bíceps: ["Rosca direta - 3x12", "Rosca martelo - 3x12", "Concentrada - 3x10"],
  Tríceps: ["Tríceps pulley - 3x12", "Testa - 3x10", "Mergulho - 3x15"],
  Cardio: ["Corrida 15 min", "Esteira 10 min", "Bicicleta 12 min"]
};

function openGroup(groupName) {
  document.getElementById("groupTitle").innerText = groupName;
  const area = document.getElementById("exerciseArea");
  area.innerHTML = "";

  workoutGroups[groupName].forEach(ex => {
    const div = document.createElement("div");
    div.innerText = ex;
    area.appendChild(div);
  });

  document.getElementById("motivationalMsg").innerText =
    "Você consegue! 💪 Mantenha o foco!";

  showScreen("workoutScreen");
}

function backToMain() {
  showScreen("mainScreen");
}

/* ============================
   TREINOS DO DIA
============================ */
function showDailyWorkout(day) {
  openGroup(day + " - Treino diário");
}

/* ============================
   GRÁFICO / ESTATÍSTICAS
============================ */
function showStats() {
  showScreen("statsScreen");

  const ctx = document.getElementById("progressChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      datasets: [{
        label: "Minutos de treino",
        data: [30, 45, 20, 40, 50, 15, 0],
      }]
    }
  });

  document.getElementById("weeklyGoal").innerText =
    "Meta semanal: 200 minutos";
}

/* ============================
   AUTO-CARREGAMENTO
============================ */
loadUserData();
