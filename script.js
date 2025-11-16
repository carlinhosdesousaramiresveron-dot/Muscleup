let user = JSON.parse(localStorage.getItem('user')) || {};
let progress = JSON.parse(localStorage.getItem('progress')) || {};

window.onload = function() {
    if(user.idade) {
        document.getElementById('idade').value = user.idade;
        document.getElementById('altura').value = user.altura;
        document.getElementById('peso').value = user.peso;
        showIMC();
    }
};

function saveUserData() {
    const idade = document.getElementById('idade').value;
    const altura = document.getElementById('altura').value;
    const peso = document.getElementById('peso').value;

    if(!idade || !altura || !peso) {
        alert('Preencha todos os campos!');
        return;
    }

    user = { idade, altura, peso };
    localStorage.setItem('user', JSON.stringify(user));
    showIMC();
    alert('Dados salvos!');
}

function showIMC() {
    const imc = (user.peso / ((user.altura/100)**2)).toFixed(2);
    document.getElementById('imcResult').innerText = `Seu IMC: ${imc}`;
}

function startWorkout(tipo) {
    const workoutArea = document.getElementById('workoutArea');
    let exercises = [];

    if(tipo === 'musculacao') {
        if(user.idade && user.peso && user.altura){
            // personaliza treino baseado no IMC
            const imc = user.peso / ((user.altura/100)**2);
            exercises = imc < 18.5 ? ['Supino leve 3x10','Agachamento 3x12'] :
                        imc < 25 ? ['Supino reto 3x12','Agachamento 3x15','Rosca bíceps 3x12'] :
                        ['Supino moderado 3x10','Agachamento leve 3x12','Rosca bíceps 3x10'];
        } else {
            exercises = ['Supino reto 3x12','Agachamento 3x15','Rosca bíceps 3x12'];
        }
    } else if(tipo === 'cardio') {
        exercises = ['Corrida 30 min','Pular corda 15 min','HIIT 20 min'];
    }

    let html = `<h2>${tipo === 'musculacao' ? 'Treino de Musculação' : 'Treino Cardio'}</h2>`;
    html += exercises.map(ex => {
        const done = progress[ex] ? 'done' : '';
        const count = progress[ex] || 0;
        return `<div class="exercise ${done}" onclick="toggleExercise(this, '${ex}')">${ex}<span class="counter">${count}</span></div>`;
    }).join('');
    workoutArea.innerHTML = html;
}

function toggleExercise(el, name) {
    el.classList.toggle('done');
    progress[name] = (progress[name] || 0) + 1;
    el.querySelector('.counter').innerText = progress[name];
    localStorage.setItem('progress', JSON.stringify(progress));
}