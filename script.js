// ======================
// Variáveis globais
// ======================
let user = JSON.parse(localStorage.getItem('user')) || {};
let progress = JSON.parse(localStorage.getItem('progress')) || {};
let weeklyGoal = 20;

// Treinos diários
const dailyWorkouts = {
  'Segunda': ['Peito','Bíceps','Cardio'],
  'Terça': ['Costas','Tríceps','Cardio'],
  'Quarta': ['Pernas','Cardio'],
  'Quinta': ['Peito','Bíceps','Cardio'],
  'Sexta': ['Costas','Tríceps','Cardio'],
  'Sábado': ['Treino Livre','Cardio'],
  'Domingo': ['Descanso']
};

// Exercícios com assistência
const exercisesData = {
  Peito: [
    { name: 'Supino reto - 3x12', assistance: 'Deite no banco, pés firmes, desça a barra até o peito e empurre para cima.' },
    { name: 'Supino inclinado - 3x12', assistance: 'Banco inclinado 30º, mesma execução do supino reto.' },
    { name: 'Crossover - 3x15', assistance: 'Use cabos, junte os braços à frente mantendo leve flexão nos cotovelos.' }
  ],
  Costas: [
    { name: 'Puxada frontal - 3x12', assistance: 'Puxe a barra até o peito mantendo coluna reta.' },
    { name: 'Remada baixa - 3x12', assistance: 'Segure o cabo, puxe em direção ao abdômen mantendo tronco firme.' },
    { name: 'Levantamento terra - 3x10', assistance: 'Mantenha coluna neutra, levante barra do chão até altura dos quadris.' }
  ],
  Pernas: [
    { name: 'Agachamento - 3x15', assistance: 'Pés afastados, desça até 90º, mantendo joelhos alinhados.' },
    { name: 'Leg Press - 3x12', assistance: 'Não trave os joelhos, empurre a plataforma com os pés.' },
    { name: 'Avanço - 3x12', assistance: 'Passo à frente, desça até 90º e volte à posição inicial.' }
  ],
  Bíceps: [
    { name: 'Rosca direta - 3x12', assistance: 'Mantenha cotovelos fixos, suba barra controladamente.' },
    { name: 'Rosca martelo - 3x12', assistance: 'Segure halteres com pegada neutra, suba sem balançar.' }
  ],
  Tríceps: [
    { name: 'Tríceps corda - 3x12', assistance: 'Puxe a corda para baixo, estendendo os braços sem mover ombros.' },
    { name: 'Tríceps testa - 3x12', assistance: 'Deite no banco, abaixe barra em direção à testa e empurre para cima.' }
  ],
  Cardio: [
    { name: 'Corrida - 30 min', assistance: 'Mantenha ritmo confortável, use tênis adequado.' },
    { name: 'Pular corda - 15 min', assistance: 'Movimente pulso, não braços, mantenha ritmo constante.' },
    { name: 'HIIT - 20 min', assistance: 'Intercale 30s de esforço intenso e 30s de descanso.' }
  ],
  'Treino Livre': [
    { name: 'Exercício à escolha - 3x12', assistance: 'Escolha qualquer exercício que deseje treinar.' }
  ],
  Descanso: []
};

// ======================
// Inicialização
// ======================
window.onload = function() {
  if(user.idade){
    document.getElementById('idade').value = user.idade;
    document.getElementById('altura').value = user.altura;
    document.getElementById('peso').value = user.peso;
    showIMC();
    document.getElementById('welcomeMsg').innerText = `Bem-vindo(a) de volta! Pronto(a) para treinar? 💪`;
  } else {
    document.getElementById('welcomeMsg').innerText = `Por favor, preencha seus dados para iniciar o treino.`;
  }
  showWeeklyGoal();
  renderChart();
};

// ======================
// Funções de usuário
// ======================
function saveUserData(){
  const idade = document.getElementById('idade').value;
  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;

  if(!idade || !altura || !peso){
    alert('Preencha todos os campos!');
    return;
  }

  user = { idade, altura, peso };
  localStorage.setItem('user', JSON.stringify(user));
  showIMC();
  document.getElementById('welcomeMsg').innerText = `Dados salvos! Pronto(a) para treinar 💪`;
}

// Mostrar IMC e recomendações
function showIMC(){
  const imc = (user.peso / ((user.altura/100)**2)).toFixed(2);
  document.getElementById('imcResult').innerText = `Seu IMC: ${imc}`;
  let adviceText = '';
  if(imc < 18.5) adviceText = 'Abaixo do peso: foco em hipertrofia leve e alimentação adequada.';
  else if(imc < 25) adviceText = 'Peso normal: mantenha treinos equilibrados.';
  else adviceText = 'Acima do peso: combine treino de força com cardio.';
  document.getElementById('advice').innerText = adviceText;
}

// ======================
// Treinos por grupo
// ======================
function openGroup(group){
  if(!user.idade){
    alert('Preencha seus dados antes de iniciar o treino!');
    return;
  }
  document.getElementById('mainScreen').style.display='none';
  document.getElementById('workoutScreen').style.display='block';
  document.getElementById('groupTitle').innerText = group;

  const exercises = exercisesData[group];
  renderExercises(exercises);
}

// ======================
// Treino diário
// ======================
function showDailyWorkout(day){
  if(!user.idade){
    alert('Preencha seus dados antes de iniciar o treino!');
    return;
  }
  const groups = dailyWorkouts[day];
  let exercises = [];
  groups.forEach(group=>{
    if(exercisesData[group]) exercises = exercises.concat(exercisesData[group]);
  });

  if(exercises.length === 0){
    alert('Dia de descanso! Aproveite para alongar e relaxar. 🧘‍♂️');
    return;
  }

  document.getElementById('mainScreen').style.display='none';
  document.getElementById('workoutScreen').style.display='block';
  document.getElementById('groupTitle').innerText = `Treino de ${day}`;

  renderExercises(exercises);
}

// ======================
// Renderização de exercícios
// ======================
function renderExercises(exercises){
  let html = exercises.map(ex=>{
    const status = progress[ex.name] || 0;
    const doneClass = status > 0 ? 'done' : '';
    return `<div class="exercise ${doneClass}" onclick="toggleExercise(this,'${ex.name}')">
              <span>${ex.name}</span>
              <span class="counter">${status}</span>
              <div class="assistance">${ex.assistance}</div>
            </div>`;
  }).join('');
  document.getElementById('exerciseArea').innerHTML = html;
  updateCompletion(exercises);
}

// ======================
// Status e conclusão
// ======================
function toggleExercise(el,name){
  el.classList.toggle('done');
  progress[name] = (progress[name] || 0) + 1;
  el.querySelector('.counter').innerText = progress[name];
  localStorage.setItem('progress',JSON.stringify(progress));
  renderChart();
  const exercises = Array.from(document.querySelectorAll('.exercise'));
  updateCompletion(exercises.map(e=>({name:e.querySelector('span').innerText})));
}

function updateCompletion(exercises){
  const completed = exercises.filter(e=>progress[e.name] > 0).length;
  const percent = ((completed / exercises.length)*100).toFixed(0);
  document.getElementById('completionPercent').innerText = `Conclusão do treino: ${percent}%`;
}

// ======================
// Estatísticas e gráfico
// ======================
function showWeeklyGoal(){
  document.getElementById('weeklyGoal').innerText = `Meta semanal: ${weeklyGoal} exercícios`;
}

function renderChart(){
  const ctx = document.getElementById('progressChart')?.getContext('2d');
  if(!ctx) return;
  const labels = Object.keys(progress);
  const data = Object.values(progress);

  if(window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx,{
    type:'bar',
    data:{
      labels: labels,
      datasets:[{
        label:'Repetições / Concluídos',
        data: data,
        backgroundColor:'#0f0'
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{y:{beginAtZero:true}}
    }
  });
}

// ======================
// Navegação
// ======================
function backToMain(){
  document.getElementById('workoutScreen').style.display='none';
  document.getElementById('statsScreen').style.display='none';
  document.getElementById('mainScreen').style.display='block';
}