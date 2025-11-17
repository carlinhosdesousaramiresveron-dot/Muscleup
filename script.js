/* ============================
   Dados base e utilitários
   ============================ */

// perfil salvo
let user = JSON.parse(localStorage.getItem('acd_user')) || null;

// objetivo escolhido temporário enquanto cadastra
let chosenObjective = null;

// mapeamento de treinos por objetivo e por grupo
const exercisesByGoal = {
  ganho: {
    Peito: [
      { name: 'Supino reto - 4x8', assistance: 'Foque em cargas progressivas, empurre controlado, respire ao empurrar.' , media: ''},
      { name: 'Supino inclinado - 3x8', assistance: 'Inclinação 20-30º, concentre na fase concêntrica.' , media: ''},
      { name: 'Crucifixo - 3x12', assistance: 'Alongue bem e contraia no topo.' , media: ''}
    ],
    Costas: [
      { name: 'Puxada aberta - 4x8', assistance: 'Puxe até o peito, ombros para baixo.' , media: ''},
      { name: 'Remada curvada - 3x8', assistance: 'Costas firmes, puxe com os cotovelos.' , media: ''},
    ],
    Pernas: [
      { name: 'Agachamento livre - 4x8', assistance: 'Priorize profundidade e técnica; mantenha coluna neutra.' , media: ''},
      { name: 'Leg Press - 3x10', assistance: 'Pés na largura dos ombros, movimento controlado.' , media: ''},
    ]
  },
  definicao: {
    Peito: [
      { name: 'Supino reto - 3x12', assistance: 'Séries mais altas, controle e tensão contínua.' , media: ''},
      { name: 'Crucifixo inclinado - 3x12', assistance: 'Contraia no topo e desça controlado.' , media: ''},
    ],
    Costas: [
      { name: 'Puxada neutra - 3x12', assistance: 'Foque no pico de contração.' , media: ''},
    ],
    Pernas: [
      { name: 'Agachamento sumô - 3x15', assistance: 'Repetições mais altas para resistência.' , media: ''},
    ]
  },
  emagrecimento: {
    Peito: [
      { name: 'Supino reto - 3x10', assistance: 'Use intensidade média e foque em resistência.' , media: ''},
    ],
    Costas: [
      { name: 'Remada alta - 3x12', assistance: 'Movimento explosivo controlado.' , media: ''},
    ],
    Pernas: [
      { name: 'Agachamento + salto - 3x12', assistance: 'Combina força com cardio.' , media: ''},
      { name: 'HIIT Bike - 10 min', assistance: 'Intercale 30s esforço / 30s leve.' , media: ''},
    ]
  }
};

// dias da semana → combina grupos padrão
const dailyWorkouts = {
  Segunda: ['Peito','Cardio'],
  Terça: ['Costas','Bíceps'],
  Quarta: ['Pernas','Cardio'],
  Quinta: ['Peito','Tríceps'],
  Sexta: ['Costas','Cardio'],
  Sábado: ['Treino Livre'],
  Domingo: ['Descanso']
};

/* ============================
   Inicialização da UI
   ============================ */

document.addEventListener('DOMContentLoaded', ()=> {
  // se já há usuário salvo, carregar e ir direto ao main
  if (user) {
    applyUserToUI();
    showScreen('mainScreen');
  } else {
    showScreen('profileScreen');
  }

  // ligar botões de objetivo no cadastro
  document.querySelectorAll('.obj-btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      document.querySelectorAll('.obj-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      chosenObjective = b.dataset.obj;
    });
  });

  // salvar perfil
  document.getElementById('saveProfileBtn').addEventListener('click', ()=> {
    saveProfile();
  });

  // groups buttons (populado)
  const groups = ['Peito','Costas','Pernas','Bíceps','Tríceps','Cardio'];
  const gb = document.getElementById('groupButtons');
  groups.forEach(g=>{
    const btn = document.createElement('button');
    btn.innerText = g;
    btn.addEventListener('click', ()=> openGroup(g));
    gb.appendChild(btn);
  });

  // day dropdown toggle
  document.getElementById('dayToggleBtn').addEventListener('click', ()=>{
    document.getElementById('dayList').classList.toggle('hide');
  });

  // day items
  document.querySelectorAll('.day-item').forEach(d=>{
    d.addEventListener('click', ()=> {
      const day = d.dataset.day;
      handleDaySelection(day);
      document.getElementById('dayList').classList.add('hide');
    });
  });

  // voltar de telas
  document.getElementById('backToMain').addEventListener('click', ()=> showScreen('mainScreen'));
  document.getElementById('backFromHelp').addEventListener('click', ()=> showScreen('workoutScreen'));
  document.getElementById('backFromStats').addEventListener('click', ()=> showScreen('mainScreen'));

  // botões perfil / stats
  document.getElementById('btnOpenProfile')?.addEventListener('click', ()=> {
    // abrir tela de perfil para editar
    showScreen('profileScreen');
  });
  document.getElementById('btnOpenStats')?.addEventListener('click', ()=> {
    renderStats();
    showScreen('statsScreen');
  });
});

/* ============================
   Funções de perfil
   ============================ */

function saveProfile(){
  const nome = document.getElementById('nome').value.trim();
  const idade = Number(document.getElementById('idade').value);
  const altura = Number(document.getElementById('altura').value);
  const peso = Number(document.getElementById('peso').value);
  const avatar = document.getElementById('avatar').value;
  const objective = chosenObjective || 'ganho'; // padrão

  if(!nome || !idade || !altura || !peso){
    alert('Preencha todos os campos do perfil.');
    return;
  }

  user = { nome, idade, altura, peso, avatar, objective };
  localStorage.setItem('acd_user', JSON.stringify(user));
  applyUserToUI();
  showScreen('mainScreen');
}

function applyUserToUI(){
  document.getElementById('welcomeName').innerText = `Olá, ${user.nome}`;
  document.getElementById('userObjective').innerText = `Objetivo: ${mapObjectiveName(user.objective)}`;
  // avatar preview
  document.getElementById('avatarPreview').innerText = (user.nome || 'U').charAt(0).toUpperCase();
  // preencher campos caso volte ao perfil
  document.getElementById('nome').value = user.nome;
  document.getElementById('idade').value = user.idade;
  document.getElementById('altura').value = user.altura;
  document.getElementById('peso').value = user.peso;
  document.getElementById('avatar').value = user.avatar || 'avatar1';
  chosenObjective = user.objective;
  document.querySelectorAll('.obj-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.obj === chosenObjective);
  });
}

function mapObjectiveName(key){
  if(key === 'ganho') return 'Ganhar massa';
  if(key === 'definicao') return 'Definir';
  if(key === 'emagrecimento') return 'Emagrecer';
  return key;
}

/* ============================
   Dias da semana → gerador de treino
   ============================ */

function handleDaySelection(day){
  if(!user){ alert('Faça o cadastro primeiro!'); showScreen('profileScreen'); return; }

  const groups = dailyWorkouts[day] || ['Treino Livre'];
  // montar lista de exercícios conforme objetivo do usuário
  let list = [];
  groups.forEach(g=>{
    // se grupo existir no mapa do objetivo atual, concatena
    const objKey = user.objective || 'ganho';
    const pool = exercisesByGoal[objKey] && exercisesByGoal[objKey][g];
    if(pool && pool.length) list = list.concat(pool);
    else {
      // fallback: pegar o mesmo grupo de qualquer objetivo disponível
      for(const k of Object.keys(exercisesByGoal)){
        if(exercisesByGoal[k][g]) { list = list.concat(exercisesByGoal[k][g]); break; }
      }
    }
  });

  // renderiza na tela de treino
  renderExercises(list, `${day} — Treino`);
  showScreen('workoutScreen');
}

/* ============================
   Abrir grupo muscular manual
   ============================ */

function openGroup(groupName){
  if(!user){ alert('Faça o cadastro primeiro!'); showScreen('profileScreen'); return; }
  // procura exercícios no objetivo do usuário
  const objKey = user.objective || 'ganho';
  const list = (exercisesByGoal[objKey] && exercisesByGoal[objKey][groupName]) || [];
  renderExercises(list, groupName);
  showScreen('workoutScreen');
}

/* ============================
   Renderizar exercícios + interação (sem re-render completo)
   ============================ */

function renderExercises(exercises, title){
  document.getElementById('groupTitle').innerText = title || 'Treino';
  const area = document.getElementById('exerciseArea');
  area.innerHTML = '';

  exercises.forEach(ex=>{
    // cada exercício tem name, assistance, media
    const el = document.createElement('div');
    el.className = 'exercise';
    el.setAttribute('data-ex', ex.name);

    const info = document.createElement('div');
    info.className = 'info';

    const titleEl = document.createElement('div');
    titleEl.className = 'title';
    titleEl.innerText = ex.name;

    const assistEl = document.createElement('div');
    assistEl.className = 'assistance';
    assistEl.innerText = ex.assistance;

    info.appendChild(titleEl);
    info.appendChild(assistEl);

    // controles: ajuda (abre tela separada), + (marca série), contador
    const controls = document.createElement('div');
    controls.className = 'counter-box';

    const helpBtn = document.createElement('button');
    helpBtn.className = 'btn-small';
    helpBtn.innerText = 'Ajuda';
    helpBtn.addEventListener('click', (ev)=> {
      ev.stopPropagation();
      openHelpPage(ex);
    });

    const minus = document.createElement('button');
    minus.className = 'btn-small';
    minus.innerText = '-';
    minus.addEventListener('click', (ev)=> {
      ev.stopPropagation();
      changeProgress(ex.name, -1);
    });

    const counter = document.createElement('div');
    counter.className = 'counter';
    const current = getProgress(ex.name);
    counter.innerText = current;

    const plus = document.createElement('button');
    plus.className = 'btn-small';
    plus.innerText = '+';
    plus.addEventListener('click', (ev)=> {
      ev.stopPropagation();
      changeProgress(ex.name, +1);
    });

    controls.appendChild(helpBtn);
    controls.appendChild(minus);
    controls.appendChild(counter);
    controls.appendChild(plus);

    el.appendChild(info);
    el.appendChild(controls);

    // clique no card expande assistência (melhora UX)
    el.addEventListener('click', ()=> {
      assistEl.classList.toggle('open');
    });

    area.appendChild(el);
  });

  updateCompletion(exercises);
  // atualizar recomendados (home)
  populateRecommended(exercises);
}

/* ============================
   Página de ajuda (separada)
   ============================ */

function openHelpPage(ex){
  // ex: {name, assistance, media}
  document.getElementById('helpTitle').innerText = ex.name;
  const media = document.getElementById('helpMedia');
  media.innerHTML = ''; // limpar
  if(ex.media && ex.media.trim()){
    // inserir imagem/GIF se existir
    const img = document.createElement('img');
    img.src = ex.media;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';
    media.appendChild(img);
  } else {
    media.innerText = 'Sem imagem disponível — veja a descrição abaixo.';
  }

  document.getElementById('helpText').innerText = ex.assistance;
  showScreen('helpScreen');
}

/* ============================
   Progresso (localStorage)
   ============================ */

function getProgress(name){
  const raw = JSON.parse(localStorage.getItem('acd_progress') || '{}');
  return raw[name] || 0;
}
function setProgress(name, value){
  const raw = JSON.parse(localStorage.getItem('acd_progress') || '{}');
  raw[name] = value;
  localStorage.setItem('acd_progress', JSON.stringify(raw));
}

function changeProgress(name, delta){
  const prev = getProgress(name);
  const next = Math.max(prev + delta, 0);
  setProgress(name, next);
  // atualizar contador no DOM
  const el = document.querySelector(`.exercise[data-ex="${CSS.escape(name)}"]`);
  if(el){
    const counter = el.querySelector('.counter');
    if(counter) counter.innerText = next;
  }
  // atualizar conclusão
  const currentExercises = Array.from(document.querySelectorAll('.exercise')).map(x => ({ name: x.getAttribute('data-ex') }));
  updateCompletion(currentExercises);
}

/* ============================
   Conclusão / atualização UI
   ============================ */

function updateCompletion(exercises){
  const completed = exercises.filter(e => {
    const need = 1; // para simplificar: 1 clique = unidade concluída. Pode ajustar.
    return (getProgress(e.name) || 0) >= need;
  }).length;

  const percent = exercises.length ? Math.round((completed / exercises.length) * 100) : 0;
  document.getElementById('completionPercent').innerText = `Conclusão: ${percent}%`;
}

/* ============================
   Recomendados (home)
   ============================ */

function populateRecommended(exercises){
  const container = document.getElementById('recommendedList');
  container.innerHTML = '';
  // lista compacta mostrando 4 primeiros
  exercises.slice(0,6).forEach(ex=>{
    const d = document.createElement('div');
    d.className = 'exercise mini';
    d.innerHTML = `<div class="info"><div class="title">${ex.name}</div><div class="assistance">${ex.assistance}</div></div><div><button class="btn-small">Ver</button></div>`;
    d.querySelector('button').addEventListener('click', ()=> {
      renderExercises([ex], ex.name);
      showScreen('workoutScreen');
    });
    container.appendChild(d);
  });
}

/* ============================
   Estatísticas (simples)
   ============================ */

function renderStats(){
  const ctx = document.getElementById('progressChart');
  if(!ctx) return;
  const labels = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  // exemplo: somar todas as séries completadas por dia (dummy)
  // aqui usamos progresso guardado como valores - apenas demo
  const raw = JSON.parse(localStorage.getItem('acd_progress')||'{}');
  const data = labels.map(()=> Math.round(Math.random()*60)); // placeholder aleatório (você pode ligar a dados reais)
  const chart = new Chart(ctx.getContext('2d'), {
    type:'bar',
    data:{ labels, datasets:[{ label:'Unidades', data }]},
    options:{ responsive:true }
  });
  document.getElementById('weeklyGoal').innerText = 'Meta semanal: 120 unidades';
}

/* ============================
   Helpers e utilitários finais
   ============================ */

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=> s.classList.add('hide'));
  const el = document.getElementById(id);
  if(el) el.classList.remove('hide');
}

function handleDaySelection(day){
  handleDaySelection; // placeholder se for usado por outro flow
}

// pequenas melhorias: preencher lista de groups iniciais baseados no objetivo
function populateInitialRecommended(){
  if(!user) return;
  // pegar alguns exemplos do objetivo
  const objKey = user.objective || 'ganho';
  const pool = exercisesByGoal[objKey] || {};
  const sample = [];
  Object.keys(pool).forEach(k=>{
    pool[k].slice(0,2).forEach(e=> sample.push(e));
  });
  populateRecommended(sample);
}

// após load, se usuário existe popular recomendados
if(user) setTimeout(populateInitialRecommended,250);
