/* ========= App JS - moderno (verde+preto) ========= */

document.addEventListener('DOMContentLoaded', ()=> {
  // elementos
  const profileScreen = document.getElementById('profileScreen');
  const mainScreen = document.getElementById('mainScreen');
  const workoutScreen = document.getElementById('workoutScreen');
  const helpScreen = document.getElementById('helpScreen');
  const statsScreen = document.getElementById('statsScreen');

  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const avatarSelect = document.getElementById('avatar');
  const avatarPreview = document.getElementById('avatarPreview');
  const topAvatar = document.getElementById('topAvatar');

  // imagens - use os nomes exatos que você colocou no repo
  const images = {
    avatar: 'Avatar.png',
    braco: 'treino-braco.png',
    peito: 'treino-peito.png',
    perna: 'treino-perna.png',
    costas: 'treino-costas.png',
    abdomen: 'treino-abdomen.png',
    aquecimento: 'treino-aquecimento.png',
    fallback: 'icone-192.png'
  };

  // dados de exercícios (simples)
  const exercisesByGroup = {
    Peito: [
      { name: 'Supino reto - 4x8', assistance: 'Foque em cargas progressivas.' , media: images.peito },
      { name: 'Crucifixo - 3x12', assistance: 'Alongue e contraia.' , media: images.peito }
    ],
    Costas: [
      { name: 'Puxada - 4x8', assistance: 'Cotovelo atrás.', media: images.costas },
      { name: 'Remada - 3x10', assistance: 'Costas firmes.', media: images.costas }
    ],
    Braços: [
      { name: 'Rosca direta - 3x12', assistance: 'Controle o movimento.', media: images.braco }
    ],
    Pernas: [
      { name: 'Agachamento - 4x8', assistance: 'Priorize técnica.', media: images.perna }
    ],
    Abdômen: [
      { name: 'Prancha - 3x30s', assistance: 'Corpo alinhado.', media: images.abdomen }
    ],
    Aquecimento: [
      { name: 'Corrida leve - 10 min', assistance: 'Ritmo confortável.', media: images.aquecimento }
    ]
  };

  // grupos ordenados
  const grupos = [
    { nome: 'Peito', img: images.peito },
    { nome: 'Costas', img: images.costas },
    { nome: 'Braços', img: images.braco },
    { nome: 'Pernas', img: images.perna },
    { nome: 'Abdômen', img: images.abdomen },
    { nome: 'Aquecimento', img: images.aquecimento }
  ];

  // evitar elementos cobrindo (possível causa do bug de toque)
  document.body.style.touchAction = 'manipulation';

  // funções utilitárias
  function $(id){ return document.getElementById(id) }

  // carregar usuário
  function loadUser(){
    const raw = localStorage.getItem('acd_user');
    if(!raw) return;
    const user = JSON.parse(raw);
    $('welcomeName').innerText = `Olá, ${user.nome}`;
    $('userObjective').innerText = user.objective ? mapObjective(user.objective) : '';
    topAvatar.src = user.avatar || images.avatar;
    topAvatar.onerror = ()=> topAvatar.src = images.fallback;
    avatarSelect.value = user.avatar || images.avatar;
    avatarPreview.innerHTML = `<img src="${avatarSelect.value}" onerror="this.src='${images.fallback}'">`;
  }

  function mapObjective(k){
    if(k==='ganho') return 'Ganhar massa';
    if(k==='definicao') return 'Definição';
    if(k==='emagrecimento') return 'Emagrecer';
    return k;
  }

  // montar botões de grupo
  const groupButtons = $('groupButtons');
  groupButtons.innerHTML = '';
  grupos.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'group-btn';
    btn.innerHTML = `<img src="${g.img}" onerror="this.src='${images.fallback}'"><span>${g.nome}</span>`;
    btn.addEventListener('click', ()=> openGroup(g.nome));
    groupButtons.appendChild(btn);
  });

  // salvar perfil
  saveProfileBtn?.addEventListener('click', ()=> {
    const nome = $('nome').value.trim();
    const idade = $('idade').value;
    const altura = $('altura').value;
    const peso = $('peso').value;
    const objective = $('objective').value;
    const avatar = avatarSelect.value || images.avatar;

    if(!nome || !idade || !altura || !peso){
      alert('Preencha todos os campos do perfil.');
      return;
    }
    const user = { nome, idade, altura, peso, objective, avatar };
    localStorage.setItem('acd_user', JSON.stringify(user));
    loadUser();
    showScreen('mainScreen');
  });

  // avatar preview on change
  avatarSelect?.addEventListener('change', ()=> {
    const val = avatarSelect.value || images.avatar;
    avatarPreview.innerHTML = `<img src="${val}" onerror="this.src='${images.fallback}'">`;
  });

  // navigation helpers
  function showScreen(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hide'));
    const el = $(id);
    if(el) el.classList.remove('hide');
    window.scrollTo({top:0,behavior:'instant'});
  }

  // open group
  function openGroup(groupName){
    const list = exercisesByGroup[groupName] || [];
    renderExercises(list, groupName);
    showScreen('workoutScreen');
  }

  // render exercises
  function renderExercises(exercises, title){
    $('groupTitle').innerText = title || 'Treino';
    const area = $('exerciseArea');
    area.innerHTML = '';
    exercises.forEach(ex => {
      const el = document.createElement('div');
      el.className = 'exercise';
      el.innerHTML = `
        <img class="exercise-img" src="${ex.media || images.fallback}" onerror="this.src='${images.fallback}'">
        <div class="info">
          <div class="title">${ex.name}</div>
          <div class="assistance">${ex.assistance}</div>
          <div class="row" style="margin-top:10px;">
            <button class="small" data-action="help">Ajuda</button>
            <div style="flex:1"></div>
            <button class="small" data-action="minus">-</button>
            <div class="counter" style="padding:6px 10px;background:rgba(255,255,255,0.02);border-radius:8px;margin:0 6px;">${getProgress(ex.name)}</div>
            <button class="small" data-action="plus">+</button>
          </div>
        </div>
      `;
      // eventos
      el.querySelector('[data-action="help"]').addEventListener('click', ()=> openHelp(ex));
      el.querySelector('[data-action="minus"]').addEventListener('click', ()=> changeProgress(ex.name, -1, el));
      el.querySelector('[data-action="plus"]').addEventListener('click', ()=> changeProgress(ex.name, +1, el));
      area.appendChild(el);
    });
    updateCompletion(exercises);
    populateRecommended(exercises);
  }

  // help
  function openHelp(ex){
    $('helpTitle').innerText = ex.name;
    $('helpText').innerText = ex.assistance || 'Sem descrição.';
    $('helpMedia').innerHTML = ex.media ? `<img src="${ex.media}" style="max-width:100%;border-radius:10px" onerror="this.src='${images.fallback}'">` : '<div class="muted">Sem imagem disponível.</div>';
    showScreen('helpScreen');
  }

  // progress (localStorage)
  function getProgress(name){
    const raw = JSON.parse(localStorage.getItem('acd_progress') || '{}');
    return raw[name] || 0;
  }
  function setProgress(name,value){
    const raw = JSON.parse(localStorage.getItem('acd_progress') || '{}');
    raw[name]=value;
    localStorage.setItem('acd_progress', JSON.stringify(raw));
  }
  function changeProgress(name,delta, el){
    const prev = getProgress(name);
    const next = Math.max(prev + delta, 0);
    setProgress(name,next);
    if(el){
      const counter = el.querySelector('.counter');
      if(counter) counter.innerText = next;
    }
    // update completion text
    const currentExercises = Array.from(document.querySelectorAll('.exercise')).map(x => ({ name: x.querySelector('.title').innerText }));
    updateCompletion(currentExercises);
  }

  function updateCompletion(exercises){
    const completed = exercises.filter(e => (getProgress(e.name)||0) >= 1).length;
    const percent = exercises.length ? Math.round((completed / exercises.length) * 100) : 0;
    $('completionPercent').innerText = `Conclusão: ${percent}%`;
  }

  // recommended (home)
  function populateRecommended(exercises){
    const container = $('recommended');
    // if no exercises, show example
    if(!exercises || exercises.length===0){
      container.innerHTML = '<div class="muted">Selecione um grupo para ver exercícios.</div>';
      return;
    }
    container.innerHTML = '';
    exercises.slice(0,4).forEach(ex => {
      const d = document.createElement('div');
      d.className = 'exercise';
      d.style.padding='10px';
      d.innerHTML = `<img class="exercise-img" src="${ex.media||images.fallback}" onerror="this.src='${images.fallback}'"><div style="flex:1"><div class="title">${ex.name}</div><div class="muted">${ex.assistance}</div></div>`;
      d.addEventListener('click', ()=> { renderExercises([ex], ex.name); showScreen('workoutScreen'); });
      container.appendChild(d);
    });
  }

  // day selection
  $('dayToggleBtn')?.addEventListener('click', ()=> $('dayList').classList.toggle('hide'));
  document.querySelectorAll('.day-item').forEach(d => d.addEventListener('click', (e)=>{
    const day = e.currentTarget.dataset.day;
    handleDaySelection(day);
    $('dayList').classList.add('hide');
  }));

  const dailyWorkouts = {
    Segunda: ['Peito','Aquecimento'],
    Terça: ['Costas','Braços'],
    Quarta: ['Pernas','Abdômen'],
    Quinta: ['Peito','Braços'],
    Sexta: ['Costas','Aquecimento'],
    Sábado: ['Aquecimento'],
    Domingo: []
  };

  function handleDaySelection(day){
    const groups = dailyWorkouts[day] || [];
    const list = [];
    groups.forEach(g => {
      const pool = exercisesByGroup[g] || [];
      list.push(...pool);
    });
    renderExercises(list, `${day} — Treino`);
  }

  // nav & back
  $('backToMain')?.addEventListener('click', ()=> { showScreen('mainScreen') });
  $('backFromHelp')?.addEventListener('click', ()=> { showScreen('workoutScreen') });
  $('backFromStats')?.addEventListener('click', ()=> { showScreen('mainScreen') });

  // bottom nav
  $('navHome')?.addEventListener('click', ()=> { showScreen('mainScreen'); setActiveNav('navHome') });
  $('navWorkout')?.addEventListener('click', ()=> { showScreen('workoutScreen'); setActiveNav('navWorkout') });
  $('navStats')?.addEventListener('click', ()=> { renderStats(); showScreen('statsScreen'); setActiveNav('navStats') });

  function setActiveNav(id){
    document.querySelectorAll('.nav-btn').forEach(b=> b.classList.remove('active'));
    $(id).classList.add('active');
  }

  // render stats (simple)
  function renderStats(){
    const ctx = $('progressChart');
    if(!ctx) return;
    const labels = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
    const data = labels.map(()=> Math.round(Math.random()*60));
    new Chart(ctx.getContext('2d'), { type:'bar', data:{ labels, datasets:[{ label:'Unidades', data }] }, options:{responsive:true}});
    $('weeklyGoal').innerText = 'Meta semanal: 120 unidades';
  }

  // initial load
  loadUser();
  // if no user, show profile
  if(!localStorage.getItem('acd_user')) showScreen('profileScreen'); else showScreen('mainScreen');
});
