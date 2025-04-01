let userCoData = {
    user_id: 0,
    user_pseudo: "",
    user_createtime: ""
}
let userData = {
    user_id: 0,
    user_name: "",
    user_bestscore: 0,
    user_count_death: 0,
    user_last_game: ""
};
let scoreData = {
    score_user_id: null,
    score_level_player: null,
    score_level_stage: null,
    score_kill: 0,
    score_time: '',
    score_createtime: ''
};
let scoreLastGameData = {
    score_user_id: null,
    score_level_player: null,
    score_level_stage: null,
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

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

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

// permet de gérer un temps de chargement (surtout pour les requêtes à la bdd)
function showLoader() {
    const loader = document.getElementById('loading-overlay');
    loader.classList.remove('loading-hidden');
}
function hideLoader() {
const loader = document.getElementById('loading-overlay');
loader.classList.add('loading-hidden');
}

// côté son // 
function muteUnmute(type) {
    const allAudio = document.querySelectorAll("audio");
    allAudio.forEach(audio => {
        type == 1 ? audio.muted = true : audio.muted = false;
    });
}
const menuStartMusic = document.getElementById('menuStartMusic');
const menuGameMusic = document.getElementById('menuGameMusic');
// côté son //

// côté état //
let state = null;
let menuGameState = null;
let soundState;
let isPause = false;
let inGame;
path.fileSettingsExists().then(exists => {
    if (exists) {
        console.log('✅');
        return path.readFileSettings();
    }
}).then(content => {
    if (content) {
        soundState = content;
        muteUnmute(content);
    }
}).catch(console.error);
// côté état //

const menuBalise = document.getElementById('menu');
if(menuBalise) {
    menu();
}

function menu() {
    system.inGame(inGame = false);
    menuStartMusic.volume = 0.15;
    menuStartMusic.play();
    menuBalise.innerHTML = `
        <h2 id="titleStart">Bienvenue sur Roguelike (nom à changer) ! 👋</h2>
        <div id="menuStart">
            <button id="0" class="buttonStart">Jouer</button>
            <button id="1" class="buttonStart">Options</button>
            <button id="2" class="buttonStart">Quitter</button>
        </div>
        <footer class="game-footer">
            <p>© 2025 ciraam dev</p>
        </footer>`;
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
                            console.log('✅');
                            userCoData = {
                                user_id: user.user_id,
                                user_pseudo: user.user_pseudo,
                                user_createtime: user.user_createtime
                            }
                            state = null;
                            menuGame(menuGameState = 1);
                            menuStartMusic.pause();
                            menuStartMusic.currentTime = 0;
                        });
                    } else {
                        return console.log('📝');
                    }
                }).catch(console.error);
            } else if(state == 1) {
                menuOptions(0, 0);
            } else if(state == 2) {
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
                    state = 0;
                    menu();
                }
            });
        });
    }
}

function menuOptions(settingState, currMenu) {
    if(settingState == 0) {
        menuBalise.innerHTML = `
            ${currMenu == 0 ? `</br></br></br></br></br></br>` : ``}
            <div id="optionsStart">
                <h2>Options</h2><br>
                <button id="buttonSound" ${soundState == 0 ? `data-sound="on" class="buttonOptions">Son: ON` : `data-sound="off" class="buttonOptions sound-off">Son: OFF`}</button>
                <button id="buttonLore" class="buttonOptions">Psst..psst j'ai un secret..</button>
            </div><br><br>${currMenu == 0 || currMenu == 2 ? `<span id="menuBack" class="buttonOptions">←</span>` : ``}`;
        document.querySelectorAll('.buttonOptions').forEach(button => {
            button.addEventListener('click', (event) => { 
                if (event.target.id == "menuBack") {
                    if(currMenu == 0) {
                        state = currMenu; 
                        menu(); 
                    } else if(currMenu == 1) {
                        menuGame(menuGameState = currMenu);
                    } else if(currMenu == 2) {
                        game();
                    }
                } 
                else if (event.target.id == "buttonSound") {
                    const buttonSound = event.target;
                    // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier "settings"
                    path.fileSettingsExists().then(exists => {
                        if (exists) {
                            console.log('✅');
                            return path.readFileSettings();
                        } else {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                buttonSound.classList.add('sound-off');
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                buttonSound.classList.remove('sound-off');
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
                            buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
                        }
                    }).then(content => {
                        if (content) {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                buttonSound.classList.add('sound-off');
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                buttonSound.classList.remove('sound-off');
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
                            buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
                        } else {
                            return console.log('📝');
                        }
                    }).catch(console.error);
                } 
                else if (event.target.id == "buttonLore") {
                    menuOptions(settingState == 0 ? 1 : 0, currMenu);
                }  
            });
        });
    } else if(settingState == 1) {
        menuBalise.innerHTML = `
            ${currMenu == 0 ? `</br></br></br></br></br></br>` : ``}
            <div id="optionsStart">
                <h2>Options</h2><br>
                <button id="buttonSound" ${soundState == 0 ? `data-sound="on" class="buttonOptions">Son: ON` : `data-sound="off" class="buttonOptions sound-off">Son: OFF`}</button>
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
            </div><br><br>${currMenu == 0 || currMenu == 2 ? `<span id="menuBack" class="buttonOptions">←</span>` : ``}`;
        document.querySelectorAll('.buttonOptions').forEach(button => {
            button.addEventListener('click', (event) => {
                if (event.target.id == "menuBack") {
                    if(currMenu == 0) {
                        state = currMenu; 
                        menu(); 
                    } else if(currMenu == 1) {
                        menuGame(menuGameState = currMenu);
                    } else if(currMenu == 2) {
                        game();
                    }
                } 
                else if (event.target.id == "buttonSound") {
                    const buttonSound = event.target;
                    // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier "settings"
                    path.fileSettingsExists().then(exists => {
                        if (exists) {
                            console.log('✅');
                            return path.readFileSettings();
                        } else {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                buttonSound.classList.add('sound-off');
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                buttonSound.classList.remove('sound-off');
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
                            buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
                        }
                    }).then(content => {
                        if (content) {
                            if(buttonSound.getAttribute('data-sound') == 'on') {
                                buttonSound.setAttribute('data-sound', 'off');
                                buttonSound.classList.add('sound-off');
                            } else {
                                buttonSound.setAttribute('data-sound', 'on');
                                buttonSound.classList.remove('sound-off');
                            }
                            event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
                            path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
                            buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
                            buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
                        } else {
                            return console.log('📝');
                        }
                    }).catch(console.error);
                } 
                else if (event.target.id == "buttonLore") {
                    menuOptions(settingState == 0 ? 1 : 0, currMenu);
                }  
            });
        });
    }
}

function menuGame(menuGameState) {
    system.inGame(inGame = false);
    menuGameMusic.volume = 0.15;
    menuGameMusic.play()
    const header = document.getElementById('menu-header');
    header.innerHTML = `
        <span class="game-header">
            <h2>${userCoData.user_pseudo}'s journey</h2>
            <div class="menu-item menu" id="menu-btn">
                <div title="Retour menu principal" class="menu-icon">↩️</div>
            </div>
            <div class="menu-item profile" id="profile-btn">
                <div ${menuGameState == 4 ? `hidden` : `` } title="Profil de ${userCoData.user_pseudo}" class="menu-icon">👤</div>
            </div>
        </span>`;
    const footer = document.getElementById('menu-footer'); // à la fin après avoir rempli le contenu des nav, ajuster l'emplacement des boutons
    footer.innerHTML = `
        <nav class="main-menu${menuGameState == 3 ? menuGameState + `-` + soundState : menuGameState }">
            <div class="menu-item rankings" id="rankings-btn">
                <div ${menuGameState == 2 ? `hidden` : `` } title="Classement général & personnel" class="menu-icon">🏆</div>
            </div>
            <div class="menu-item play" id="play-btn">
                <div ${menuGameState == 1 ? `hidden` : `` } title="Lancer une partie" class="menu-icon">🎮</div>
            </div>
            <div class="menu-item settings" id="settings-btn">
                <div ${menuGameState == 3 ? `hidden` : `` } title="Options" class="menu-icon">⚙️</div>
            </div>
        </nav>`;
    if(menuGameState == 1) {
        db.ipcRenderer.send('getUserById', userCoData.user_id);
        db.ipcRenderer.once('userById', (err, user) => {
            console.log('✅');
            userData = {
                user_bestscore: user.user_bestscore,
                user_count_death: user.user_count_death,
                user_last_game: user.user_last_game
            }          
        });
        userData = { user_id: userCoData.user_id, user_last_game: userData.user_last_game };
        let lastGameIsNull = false;
        db.ipcRenderer.send('getLastGame', userData);
        db.ipcRenderer.once('lastGame', (err, score) => {
            console.log('✅');
            scoreLastGameData = {
                score_level_player: score.score_level_player,
                score_level_stage: score.score_level_stage,
                score_kill: score.score_kill,
                score_time: score.score_time
            };      
        });
        showLoader();
        setTimeout(() => {
            hideLoader();
            scoreLastGameData.score_level_player == null && scoreLastGameData.score_level_stage == null ? lastGameIsNull = true : lastGameIsNull = false;
            const nav = document.querySelector('.main-menu1');
            lastGameIsNull ? nav.style= 'margin-top: 40%;' : nav.style= 'margin-top: 12%;';
            menuBalise.innerHTML = `
            <div class="menu-game" id="menu-game">
                <div class="bestscore-countdeath-container">
                    <div id="user-bestscore">
                        <div class="score-menu-title">Meilleur score</div>
                        <div class="bestscore-countdeath-score">
                            <div class="score-menu">${userData.user_bestscore}</div>
                        </div>
                    </div>
                    <div id="user-countdeath">
                        <div class="score-menu-title">Compteur de mort</div>
                        <div class="bestscore-countdeath-score">
                            <div class="score-menu">${userData.user_count_death}</div>
                        </div>
                    </div>
                </div>
                <div id="user-lastgame" ${lastGameIsNull == true ? `hidden` : ``}>
                    <div class="score-menu-title">Dernière partie</div>
                    <div class="score-lastgame-container">                    
                        <div class="score-menu">Niveau atteint: ${scoreLastGameData.score_level_player}</div>
                        <div class="score-menu">Étage atteint: ${scoreLastGameData.score_level_stage}</div>
                        <div class="score-menu">Ennemis tués: ${scoreLastGameData.score_kill}</div>
                        <div class="score-menu">Temps: ${scoreLastGameData.score_time}</div>
                        <div class="score-menu">Le: ${formatDate(userData.user_last_game)}</div>
                    </div>
                </div>
                <div id="user-play">
                    <div id="user-start" title="Jouer" class="play-start">START</div>
                </div>
            </div>`;
            document.querySelector('.play-start').addEventListener('click', () => {
                game();
            });
        }, 100);
    } else if(menuGameState == 2) {
        menuBalise.innerHTML = `
            <div class="menu-ranking" id="menu-ranking">
                <div>Classment général</div>
                <div>Classment personnel</div>
            </div>`;
    } else if(menuGameState == 3) {
        menuOptions(0, 1);
    } else if (menuGameState == 4) {
        menuBalise.innerHTML = `
            <div class="menu-profile" id="menu-profile">
                <div>Profil</div>
            </div>`;
    } else if(menuGameState == 0) {
        menuGameMusic.pause();
        menuGameMusic.currentTime = 0;
        state = null;
        menu();
    }
    document.querySelectorAll('.menu-item').forEach((elements) => {
        elements.addEventListener('click', function() {
            if(elements.id == 'play-btn') {
                menuGame(menuGameState = 1);
            } else if(elements.id == 'rankings-btn') {
                menuGame(menuGameState = 2);
            } else if(elements.id == 'settings-btn') {
                menuGame(menuGameState = 3);
            } else if(elements.id == 'profile-btn') {
                menuGame(menuGameState = 4);
            } else if(elements.id == 'menu-btn') {
                menuGame(menuGameState = 0);
                header.innerHTML = ``;
                footer.innerHTML = ``;
            }
        });
    });
}

const container = document.getElementById('game-container');
function game() {
    system.inGame(inGame = true);
    menuBalise.innerHTML = ``;
    const header = document.getElementById('menu-header');
    header.innerHTML = ``;
    const footer = document.getElementById('menu-footer');
    footer.innerHTML = ``;
    container.hidden = false;
    container.innerHTML = `
        <div id="pause-overlay" hidden>
            <h2>PAUSE</h2>
            <button class="pause-btn" id="resume">Reprendre (Échap)</button>
            <button class="pause-btn" id="options">Options</button>
            <button class="pause-btn" id="back">Retour menu</button>
        </div>`;
    const overlay = document.getElementById('pause-overlay');
    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            isPause ? isPause = false : isPause = true;
            isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
            system.pause(isPause);
            // gérer la pause
        }
    });
    document.querySelectorAll('.pause-btn').forEach(elements => {
        elements.addEventListener('click', function() {
            if(elements.id == 'resume') {
                isPause ? isPause = false : isPause = true;
                isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
                system.pause(isPause);
                // gérer la fin de pause
            } else if(elements.id == 'options') {
                isPause ? isPause = false : isPause = true;
                system.pause(isPause);
                container.hidden = true;
                menuOptions(0, 2);
            } else if(elements.id == 'back') {
                isPause ? isPause = false : isPause = true;
                system.pause(isPause);
                container.hidden = true;
                menuGame(1);
            }
        });
    });
}