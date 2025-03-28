let userCoData = {
    user_id: 0,
    user_pseudo: "",
    user_createtime: ""
}
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

// if (db) {
//     notifData = { title: "debug", content: "test" };
//     db.ipcRenderer.send('sendNotification', notifData);
//   // test ajout d'un score
//     db.ipcRenderer.send('addScore', scoreData);
//     console.log(scoreData);
//   // test récupération d'un score
//     db.ipcRenderer.send('getScoreById', (event, highScores) => {
//         const scoreList = document.getElementById('score-list');
//         scoreList.innerHTML = '';
//         highScores.forEach(score => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${score.player_name}: ${score.score}`;
//             scoreList.appendChild(listItem);
//         });
//     });

// } else {
//     console.log('ipcRenderer n\'est pas disponible dans le renderer');
// }

// const information = document.getElementById('info');
// information.innerText = `Cette application utilise Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), et Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // Affichera 'pong'
}
func();

// document.getElementById('buttonWelcome').addEventListener('click', function() {
//     welcome();
// }); 
// function welcome() {
//     alert("Bienvenue sur mon jeu, amusez-vous bien ! 😎");
// }

// permet de relancer l'app (pour éviter de retaper la cmd surtout)
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
    if (event.target == modal) {
        closeModalFunction();
    }
}

// permet de gérer le contenu de l'app
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
            if(state == 0) {
                // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier & création de son "profil"
                path.fileExists().then(exists => {
                    if (exists) {
                        console.log('✅');
                        return path.readFile();
                    } else {							 		
                        return modalFirstStart();
                    }
                }).then(content => {
                    if (content) {
                        db.ipcRenderer.send('getUserById', parseInt(content));
                        db.ipcRenderer.once('userById', (err, user) => {
                            // if (!err) {
                                console.log('✅');
                                userCoData = {
                                    user_id: user.user_id,
                                    user_pseudo: user.user_pseudo,
                                    user_createtime: user.user_createtime
                                }
                                state = 3;
                                menuGame();
                            // } else {
                            //     notifData = { title: 'Erreur', content: 'Utilisateur non trouvé'};
                            //     console.log(user);
                            //     db.ipcRenderer.send('sendNotification', notifData);
                            //     state = 0;
                            //     menu();
                            // }
                        });
                    } else {
                        return console.log('📝');
                    }
                }).catch(console.error);
            } else if(state == 1) {
                menuOptions(0);
            } else if(state == 2) {
                system.end();
            } else if(state == 3) {
                menuGame();
            }
        }); 
    });
}

function menuOptions(settingState) { // à finir (mute/unmute) + afficher l'état actuel des options (l.190 & l.255)
    if(settingState == 0) {
        menuBalise.innerHTML = `
            <div id="optionsStart">
                <h2>Options</h2><br><br>
                <button id="buttonSound" data-sound="on" class="buttonOptions">Son: ON</button>
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
                    const backgroundColorRed = event.target.style.backgroundColor = "red";
                    // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier "settings"
                    path.fileSettingsExists().then(exists => {
                        if (exists) {
                            console.log('✅');
                            return path.readFileSettings();
                        } else {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                backgroundColorRed;
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                event.target.style.backgroundColor = "";
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            // + gérer l'état du son (mute/unmute) off = 1 / on = 0 à finir
                            // if(buttonSound.getAttribute('data-sound') == 'off') {
                                // return ;
                            // } else {
                                // return ;
                            // }
                        }
                    }).then(content => {
                        if (content) {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                backgroundColorRed;
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                event.target.style.backgroundColor = "";
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            // + gérer l'état du son (mute/unmute) off = 1 / on = 0 à finir
                            // if(buttonSound.getAttribute('data-sound') == 'off') {
                                // return ;
                            // } else {
                                // return ;
                            // }
                        } else {
                            return console.log('📝');
                        }
                    }).catch(console.error);
                } 
                else if (event.target.id == "buttonLore") {
                    menuOptions(settingState == 0 ? 1 : 0);
                }  
            });
        });
    } else if(settingState == 1) {
        menuBalise.innerHTML = `
            <div id="optionsStart">
                <h2>Options</h2><br><br>
                <button id="buttonSound" data-sound="on" class="buttonOptions">Son: ON</button>
                <button id="buttonLore" class="buttonOptions">Psst..psst j'ai un secret..</button>
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
                        <span>Vous voilà dans un univers...</span>
                </div>
            </div><br><br><span id="menuBack" class="buttonOptions">←</span>`;
        document.querySelectorAll('.buttonOptions').forEach(button => {
            button.addEventListener('click', (event) => { 
                if (event.target.id == "menuBack") {
                    state = 0; 
                    menu(); 
                } 
                else if (event.target.id == "buttonSound") {
                    const buttonSound = event.target;
                    const backgroundColorRed = event.target.style.backgroundColor = "red";
                    // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier "settings"
                    path.fileSettingsExists().then(exists => {
                        if (exists) {
                            console.log('✅');
                            return path.readFileSettings();
                        } else {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                backgroundColorRed;
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                event.target.style.backgroundColor = "";
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            // + gérer l'état du son (mute/unmute) off = 1 / on = 0 à finir
                            // if(buttonSound.getAttribute('data-sound') == 'off') {
                                // return ;
                            // } else {
                                // return ;
                            // }
                        }
                    }).then(content => {
                        if (content) {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                backgroundColorRed;
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                event.target.style.backgroundColor = "";
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            // + gérer l'état du son (mute/unmute) off = 1 / on = 0 à finir
                            // if(buttonSound.getAttribute('data-sound') == 'off') {
                                // return ;
                            // } else {
                                // return ;
                            // }
                        } else {
                            return console.log('📝');
                        }
                    }).catch(console.error);
                } 
                else if (event.target.id == "buttonLore") {
                    menuOptions(state == 0 ? 1 : 0);
                }  
            });
        });
    }
}

function menuGame() {
    menuBalise.innerHTML = `
        <div class="game-container">
            <span class="game-header">
                <h2>Bienvenue</h2>
            </span>
            
            <nav class="main-menu">
                <div class="menu-item play" id="play-btn">
                    <div class="menu-icon">▶</div>
                    <div class="menu-text">Jouer</div>
                </div>
                
                <div class="menu-item rankings" id="rankings-btn">
                    <div class="menu-icon">🏆</div>
                    <div class="menu-text">Classement</div>
                </div>
                
                <div class="menu-item profile" id="profile-btn">
                    <div class="menu-icon">👤</div>
                    <div class="menu-text">Profil</div>
                </div>
                
                <div class="menu-item settings" id="settings-btn">
                    <div class="menu-icon">⚙️</div>
                    <div class="menu-text">Options</div>
                </div>
            </nav>
            
            <footer class="game-footer">
                <p>© 2023 ciraam dev</p>
            </footer>
        </div>`;
    const playBtn = document.getElementById('play-btn');
    const rankingsBtn = document.getElementById('rankings-btn');
    const profileBtn = document.getElementById('profile-btn');
    const settingsBtn = document.getElementById('settings-btn');
    playBtn.addEventListener('click', function() {
        // Redirection vers l'écran de jeu
    });
    rankingsBtn.addEventListener('click', function() {
        // Redirection vers le classement
    });
    profileBtn.addEventListener('click', function() {
        // Redirection vers le profil
    });       
    settingsBtn.addEventListener('click', function() {
        // Redirection vers les options
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
                    modalFirstStart();
                } else if (users.some(user => user.user_pseudo == pseudo)) {
                    modalContent.innerHTML += `</br></br><span>Pseudo déjà utilisé</span>`;
                    pseudo = "";
                    modalFirstStart();
                } else {
                    closeModalFunction();
                    userData = { user_pseudo: pseudo, user_name: "" , user_bestcore: 0, user_count_death: 0, user_last_game: ""};
                    db.ipcRenderer.send('addUser', userData)
                    notifData = { title: "Premier lancement", content: 'Bienvenue ' + pseudo + ' !'};
                    db.ipcRenderer.send('sendNotification', notifData);
                    state = 3;
                    menu();
                    
                }
            });
        });
    }
}