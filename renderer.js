// const db = window.db;
// const game = window.game;
// const versions = window.versions;

let userData = {
    user_pseudo: "",
    user_name: "",
    user_bestcore: 0,
    user_count_death: 0,
    user_last_game: ""
};
let scoreData = {
    score_user_id: 1,
    score_level_player: 1,
    score_level_stage: 1,
    score_kill: 0,
    score_time: ''
};
let notifData = {
    title: "",
    content: ""
};

if (db) {
    // notifData = { title: "debug", content: "test" };
    // db.ipcRenderer.send('sendNotification', notifData);
    // test ajout d'un score
    // db.ipcRenderer.send('addScore', scoreData);
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

// document.getElementById('buttonWelcome').addEventListener('click', function() {
//     welcome();
// }); 
// function welcome() {
//     alert("Bienvenue sur mon jeu, amusez-vous bien ! 😎");
// }
document.getElementById('restartButton').addEventListener('click', () => {
    system.restart();
});

// permet d'avoir l'heure en temps réel
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

state = null;
const menuBalise = document.getElementById('menu');
if(menuBalise) {
    menu();
}

function menu() {
    menuBalise.innerHTML = `
        <h2 id="titleStart">Bienvenue sur Roguelike (nom à changer) ! 👋</h2>
        <div id="menuStart">
            <button id="0" class="buttonStart">Jouer</button>
            <button id="1" class="buttonStart">Options</button>
            <button id="2" class="buttonStart">Quitter</button>
        </div>`;
    const buttonStart = document.querySelectorAll('.buttonStart');
    buttonStart.forEach(button => {
        button.addEventListener('click', () => {
            if(button.id == "0") {  
                state = 0;
            } else if(button.id == "1") {
                state = 1;
            } else if(button.id == "2") {
                state = 2;
            }
            if(state == "0") {
                // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier & création de son "profil"
                if (path.fileExists().results) {
                    console.log('Le fichier existe.');
                    const content =  path.readFile();
                    console.log('Contenu du fichier:', content);
                    db.ipcRenderer.send('getUserById', parseInt(content));
                } else {
                    modalFirstStart();
                }
            } else if(state == "1") {
                menuBalise.innerHTML = `
                    <div id="optionsStart">
                        <h2>Options</h2><br><br>
                        <button id="buttonSound" data-sound="off" class="buttonOptions">Son: ON</button>
                        <button id="buttonLore" class="buttonOptions">Psst..psst j'ai un secret..</button>
                    </div><br><br><span id="menuBack" class="buttonOptions">←</span>`;

                document.querySelectorAll('.buttonOptions').forEach(button => {
                    button.addEventListener('click', (event) => { 
                        if (event.target.id == "menuBack") {
                            state = 0; 
                            menu(); 
                        } 
                        else if (event.target.id == "buttonSound") {
                            const buttonSound = event.target;
                            buttonSound.getAttribute('data-sound');
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                event.target.style.backgroundColor = "";
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                event.target.style.backgroundColor = "red";
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'ON' : 'OFF'}`;
                            // gérer l'état du son (mute/unmute)
                        } 
                        else if (event.target.id == "buttonLore") { // ne disparait pas au 2ème clique
                            const loreContent = document.getElementById("loreContent");
                            if (loreContent) {
                                loreContent.remove();
                            } else {
                                document.getElementById('optionsStart').innerHTML += `
                                    <div id="loreContent">
                                        <span><b>Touches</b></span>
                                        <ul>
                                            <li><u>Déplacement</u></li>
                                                - En haut : Z </br>
                                                - À droite : D </br>
                                                - À gauche : Q </br>
                                                - En bas : S </br>
                                            <li><u>Tirer</u></li>
                                                - Barre espace (Spacebar) </br>
                                            <li><u>Viser</u></li>
                                                - En haut : UP</br>
                                                - À droite : RIGHT</br>
                                                - À gauche : LEFT</br>
                                                - En bas : BOTTOM</br>
                                            <li><u>Mettre en pause</u></li>
                                                - ECHAP
                                        </ul>
                                        <span><b>Lore</b></span>
                                            <span>Vous voilà dans un unviers...</span>
                                    </div>`;
                            }
                        }  
                    });
                });
            } else if(state == "2") {
                system.end();
            }
        }); 
    });
}

function modalFirstStart() { // problème pour relancer la modale si champ vide ou pseudo déjà utilisé
    openModal();
    modalTitle.innerHTML = `<span>Bienvenue</span>`;
    modalContent.innerHTML = `</br></br></br><form><span>Entrez votre pseudo</span>`;
    modalContent.innerHTML += `</br><input type='text' id='inputPseudo' focus/>`;
    modalContent.innerHTML += `</br></br></br><span type="submit" id='buttonPseudo'>Créer</span></form>`;
    const inputPseudo = document.getElementById('inputPseudo');
    const buttonPseudo = document.getElementById('buttonPseudo');
    if(inputPseudo && buttonPseudo) {
        buttonPseudo.addEventListener('click', () => {
            const pseudo = inputPseudo.value;
            db.ipcRenderer.send('getUsers');
            db.ipcRenderer.once('users', (event, users) => {
                if (pseudo == "") {
                    modalContent.innerHTML += `</br></br><span>Le champ ne doit pas être vide</span>`;
                    pseudo = "";
                    // closeModalFunction();
                    modalFirstStart();
                    // return false;
                } else if (users.some(user => user.user_pseudo == pseudo)) {
                    modalContent.innerHTML += `</br></br><span>Pseudo déjà utilisé</span>`;
                    pseudo = "";
                    // closeModalFunction();
                    modalFirstStart();
                    // return false;
                } else {
                    closeModalFunction();
                    userData = { user_pseudo: pseudo, user_name: "" , user_bestcore: 0, user_count_death: 0, user_last_game: ""};
                    db.ipcRenderer.send('addUser', userData);
                    notifData = { title: "Premier lancement", content: 'Bienvenue ' + pseudo + ' !'};
                    db.ipcRenderer.send('sendNotification', notifData);
                    sendNotification('Premier lancement', 'Bienvenue ' + pseudo + ' !');
                    // return true;
                }
            });
        });
    }
}