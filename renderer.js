// const db = window.db;
// const game = window.game;
// const versions = window.versions;

let scoreData = {
    score_user_id: 1,
    score_level_player: 1,
    score_level_stage: 1,
    score_kill: 0,
    score_time: '00:00:10'
};
let notifData = {
    title: "",
    content: ""
};

if (db) {
    // notifData = { title: "debug", content: "test" };
    // db.ipcRenderer.send('sendNotification', notifData);
    // test ajout d'un score
    db.ipcRenderer.send('addScore', scoreData);
    // console.log(scoreData);
    // test récupération d'un score
    // db.ipcRenderer.send('getScoreById', (event, highScores) => {
    //     const scoreList = document.getElementById('score-list');
    //     scoreList.innerHTML = '';
    //     highScores.forEach(score => {
    //         const listItem = document.createElement('li');
    //         listItem.textContent = `${score.player_name}: ${score.score}`;
    //         scoreList.appendChild(listItem);
    //     });
    // });

} else {
    console.log('ipcRenderer n\'est pas disponible dans le renderer');
}

// const information = document.getElementById('info');
// information.innerText = `Cette application utilise Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), et Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // Affichera 'pong'
}
func();

// test pour afficher les meilleurs score
// ipcRenderer.on('test', (event, highScores) => {
//     const scoreList = document.getElementById('score-list');
//     scoreList.innerHTML = '';
//     highScores.forEach(score => {
//         const listItem = document.createElement('li');
//         listItem.textContent = `${score.player_name}: ${score.score}`;
//         scoreList.appendChild(listItem);
//     });
// });

document.getElementById('buttonWelcome').addEventListener('click', function() {
    welcome();
}); 
function welcome() {
    alert("Bienvenue sur mon jeu, amusez-vous bien ! 😎");
}
document.getElementById('restartButton').addEventListener('click', () => {
    electron.restartApp();
});

// permet d'avoir l'heure en temps réel sans utiliser
function getTimeInRealTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  if (hoursElement && minutesElement) {
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
  }
}
let lastTime = 0;
function updateTime(timestamp) {
  if (timestamp - lastTime >= 1000) {
    getTimeInRealTime();
    lastTime = timestamp;
  }
  requestAnimationFrame(updateTime);
}
requestAnimationFrame(updateTime);

// permet de gérer une modale
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
function openModal() {
    modal.style.display = "block";
}
function closeModalFunction() {
    modal.style.display = "none";
}
closeModal.onclick = closeModalFunction;
window.onclick = function(event) {
    if (event.target === modal) {
        closeModalFunction();
    }
}

const menu = document.getElementById('menu');
if(menu) {
    menu.innerHTML = `
        <div id="menuStart">
        <h2>Bienvenue sur Roguelike (nom à changer) ! 👋</h2>
        <button id="0" class="buttonStart">Jouer</button>
        <button id="1" class="buttonStart">Option</button>
        <button id="2" class="buttonStart">Quitter</button>
        </div>`;
    const buttonStart = document.querySelectorAll('.buttonStart');
    buttonStart.forEach(button => {
        button.addEventListener('click', () => {
            if(button.id == "0") {
                // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier & création de son "profil"
                if (path.fileExists().results) {
                    console.log('Le fichier existe.');
                    const content =  path.readFile();
                    console.log('Contenu du fichier:', content);
                    db.ipcRenderer.send('getUserById', parseInt(content));
                } else {
                    openModal();
                    modalTitle.innerHTML = `<span>Bienvenue</span>`;
                    modalContent.innerHTML = `</br></br><span>Entrez votre pseudo</span>`;
                    modalContent.innerHTML += `</br></br><input type='text' id='inputPseudo' focus/>`;
                    modalContent.innerHTML += `</br></br><span id='buttonPseudo'>Créer</span>`;
                    const inputPseudo = document.getElementById('inputPseudo');
                    const buttonPseudo = document.getElementById('buttonPseudo');
                    if(inputPseudo && buttonPseudo) {
                        buttonPseudo.addEventListener('click', () => {
                            const pseudo = inputPseudo.value;
                            db.ipcRenderer.send('getUsers');
                            db.ipcRenderer.once('users', (list) => {
                                console.log('Liste des utilisateurs:', list); // Vérifiez ce que vous obtenez ici
                                if(pseudo == "") {
                                    modalContent.innerHTML += `</br></br><span>Le champ ne doit pas être vide</span>`;
                                    pseudo = "";
                                // } else if(list.some(user => user.pseudo == pseudo)) {
                                //     modalContent.innerHTML += `</br></br><span>Pseudo déjà utilisé</span>`;
                                //     pseudo = "";
                                // } else if(list.contains(pseudo)) {
                                //     modalContent.innerHTML += `</br></br><span>Pseudo déjà utilisé</span>`;
                                //     pseudo = "";
                                } else {
                                    closeModalFunction();
                                    db.ipcRenderer.send('addUser', pseudo);
                                    notifData = { title: "Premier lancement", content: 'Bienvenue ' + pseudo + ' !'};
                                    db.ipcRenderer.send('sendNotification', notifData);
                                    // sendNotification('Premier lancement', 'Bienvenue ' + pseudo + ' !');
                                }
                            });
                        });
                    }
                }
            } else if(button.id == "1") {
        
            } else if(button.id == "2") {
        
            }
        }); 
    });
}