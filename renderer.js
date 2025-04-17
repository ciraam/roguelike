import { clone, spreadAround, proba, cleanGame, cleanGameLevel, removeFromArray } from './tool/function.js'
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js'
import World from './entity/world.js'
import Player from './entity/player.js'
import Mob1 from './entity/mob1.js'
import Mob2 from './entity/mob2.js'
import Grass from './object/grass.js'
import Block from './object/block.js'
import Box from './object/box.js'
import Rubis from './object/rubis.js'
import Heart from './object/heart.js'
import Area from './effect/area.js'
import Focus from './effect/focus.js'
import Graphic from './engine/graphic.js'
import Camera from './engine/camera.js'
import Light from './engine/light.js'
import Rules from './tool/rules.js'
import UI from './ui/ui.js'
// import Home from './ui/home.js'
import loadAssets from './tool/loader.js'
import physic from './engine/physic.js'

let userCoData = {
    user_id: 0,
    user_pseudo: "",
    user_createtime: ""
}
let userData = {
    user_id: null,
    user_bestscore: null,
    user_count_death: null,
    user_last_game: ""
};
let scoreData = {
    score_user_id: null,
    score_score: null,
    score_level_player: null,
    score_level_stage: null,
    score_kill: null,
    score_time: ''
};
let scoreLastGameData = {
    score_user_id: null,
    score_level_player: null,
    score_level_stage: null,
    score_kill: null,
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

function formatDurationForMySQL(totalMilliseconds) {
    // 1. S'assurer que c'est un nombre valide
    if (isNaN(totalMilliseconds)) {
      throw new Error("Le temps doit être un nombre (millisecondes)");
    }
  
    // 2. Convertir en secondes entières
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
  
    // 3. Calculer les composants temps
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    // 4. Formater en HH:MM:SS
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
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
let menuMusic = false;
// const menuGameMusic = document.getElementById('menuGameMusic');
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
    inGame = false
    system.inGame(inGame);
    if(!menuMusic) {
        menuStartMusic.volume = 0.15;
        menuStartMusic.play();
        menuMusic = true;
    }
    menuBalise.innerHTML = `
        <h2 id="titleStart">Bienvenue sur Roguelike Project ! 👋</h2>
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
                            // menuGameState = 1
                            menuGame(menuGameState = 1);
                            // menuStartMusic.pause();
                            // menuStartMusic.currentTime = 0;
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
                    // modalFirstStart();
                    closeModalFunction();
                } else if (users.some(user => user.user_pseudo == pseudo)) {
                    modalContent.innerHTML += `</br></br><span>Pseudo déjà utilisé</span>`;
                    pseudo = "";
                    // modalFirstStart();
                    closeModalFunction();
                } else {
                    closeModalFunction();
                    userData = { user_pseudo: pseudo, user_name: "" , user_bestcore: 0, user_count_death: 0, user_last_game: ""};
                    db.ipcRenderer.send('addUser', userData)
                    notifData = { title: "Premier lancement", content: 'Bienvenue ' + pseudo + ' !'};
                    db.ipcRenderer.send('sendNotification', notifData);
                    state = 0;
                    menuGame(1);
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
                        <li><u>Attaquer</u></li>
                            - Attaque simple : Clic gauche</br>
                            - Attaque tournoyante : Maintient clic gauche</br>
                        <li><u>Viser</u></li>
                            - Maintenir clic droit souris</br>
                        <li><u>Roulade</u></li>
                            - Barre espace (Spacebar) + <em>Déplacement</em>
                    </ul>
                    <span><b>Lore</b></span>
                        <span><em>Vous voilà dans un univers où survivre est une formalité... </br> Triomphez de vos ennemis et devenez plus fort, afin de peut-être... </br> ÊTRE LIBRE !</em></span>
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
    // menuGameMusic.volume = 0.15;
    // menuGameMusic.play()
    if(!menuMusic) {
        menuStartMusic.volume = 0.15;
        menuStartMusic.play();
        menuMusic = true;
    }; 
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
                menuStartMusic.pause();
                menuStartMusic.currentTime = 0;
                menuMusic = false;
                game();
            });
        }, 100);
    } else if(menuGameState == 2) {
        menuBalise.innerHTML = `
            <div class="menu-ranking" id="menu-ranking">
                <div>Classment général</div>
                <div>Classment personnel</div>
                <p>À venir...</p>
            </div>`;
    } else if(menuGameState == 3) {
        menuOptions(0, 1);
    } else if (menuGameState == 4) {
        menuBalise.innerHTML = `
            <div class="menu-profile" id="menu-profile">
                <div>Profil</div>
                <p>À venir...</p>
            </div>`;
    } else if(menuGameState == 0) {
        // menuGameMusic.pause();
        // menuGameMusic.currentTime = 0;
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

// let gameData = { name: '', exp: 0, life: 0, atk: 0, def: 0, speed: 0 };
// scoreData =
const gameContainer = document.getElementById('game-container');
const header = document.getElementById('menu-header');
const footer = document.getElementById('menu-footer');

function game() {
    system.inGame(inGame = true);
    menuBalise.innerHTML = ``;
    menuBalise.hidden = true;
    header.innerHTML = ``;
    header.hidden = true;
    footer.innerHTML = ``;
    footer.hidden = true;    
    gameContainer.hidden = false;
    // gameContainer.innerHTML = `
        
    //     <div id="pause-overlay" hidden>
    //         <h2>PAUSE</h2>
    //         <button class="pause-btn" id="resume">Reprendre (Échap)</button>
    //         <button id="buttonSound" ${soundState == 0 ? `data-sound="on" class="buttonOptions">Son: ON` : `data-sound="off" class="buttonOptions sound-off">Son: OFF`}</button>
    //         <button class="pause-btn" id="back">Retour menu</button> </br>
    //         <div id="pause-lore"><em>Vous voilà dans un univers où survivre est une formalité... </br> Triomphez de vos ennemis et devenez plus fort, afin de peut-être... </br> ÊTRE LIBRE !</em></div> </br>
    //         <div id="pause-shortcuts">
    //             <u>Déplacement:</u>
    //             - En haut : Z </br>
    //             - À droite : D </br>
    //             - À gauche : Q </br>
    //             - En bas : S </br>
    //             </br>
    //             <u>Tirer:</u>
    //             - Barre espace (Spacebar)
    //         </div>
    //         <div id="pause-shortcuts2">
    //             <u>Viser:</u>
    //             - En haut : UP </br>
    //             - À droite : RIGHT </br>
    //             - À gauche : LEFT </br>
    //             - En bas : BOTTOM </br>
    //             </br>
    //             <u>Mettre en pause:</u>
    //             - ECHAP (Escape)
    //         </div>
    //     </div><canvas></canvas>
    //     `;
    gameContainer.innerHTML = `<canvas></canvas>`;
    playGame();
    // const overlay = document.getElementById('pause-overlay');
    // const player = document.getElementById('player');
    // const sound = document.getElementById('buttonSound');
    // sound.addEventListener('click', (e) => {
    //     path.fileSettingsExists().then(exists => {
    //         if (exists) {
    //             console.log('✅');
    //             return path.readFileSettings();
    //         } else {
    //             if(buttonSound.getAttribute('data-sound') == 'on') {
    //                 buttonSound.setAttribute('data-sound', 'off');
    //                 buttonSound.classList.add('sound-off');
    //             } else {
    //                 buttonSound.setAttribute('data-sound', 'on');
    //                 buttonSound.classList.remove('sound-off');
    //             }
    //             e.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
    //             path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
    //             buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
    //             buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
    //         }
    //     }).then(content => {
    //         if (content) {
    //             if(buttonSound.getAttribute('data-sound') == 'on') {
    //                 buttonSound.setAttribute('data-sound', 'off');
    //                 buttonSound.classList.add('sound-off');
    //             } else {
    //                 buttonSound.setAttribute('data-sound', 'on');
    //                 buttonSound.classList.remove('sound-off');
    //             }
    //             e.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
    //             path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
    //             buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
    //             buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
    //         } else {
    //             return console.log('📝');
    //         }
    //     }).catch(console.error);
    // });
    
    // window.addEventListener('keydown', (e) => {
    //     // if (gameData.isDead) return;
        
    //     // const speed = gameData.speed * 0.1;
    //     switch(e.key.toLowerCase()) {
    //         case 'escape':
    //             isPause ? isPause = false : isPause = true;
    //             isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
    //             system.pause(isPause);
    //             // gérer la pause
    //             break;
    //     }
    //     // updatePlayerPosition();
    // });
    // document.querySelectorAll('.pause-btn').forEach(elements => {
    //     elements.addEventListener('click', function() {
    //         if(elements.id == 'resume') {
    //             isPause ? isPause = false : isPause = true;
    //             isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
    //             system.pause(isPause);
    //             // gérer la fin de pause-
    //         } else if(elements.id == 'back') {
    //             isPause ? isPause = false : isPause = true;
    //             system.pause(isPause);
    //             gameContainer.innerHTML = ``;
    //             gameContainer.hidden = true;
    //             menuBalise.hidden = false;
    //             header.hidden = false;
    //             footer.hidden = false;
    //             system.inGame(inGame = false);
    //             menuGame(1);
    //         }
    //     });
    // });
}

let currentScore = 0;
let currentKills = 0;
let currentLevels = 0;
let currentXp = 0;
let totalTime = 0;

const ast = await loadAssets()
// const home = new Home()
async function playGame() {
  const scene = new Scene()

  const rubies = ast.meshesRubis.map((m) => new Rubis(m))
  const hearts = ast.meshesHeart.map((m) => new Heart(m))
  const bloks = ast.meshesBlock.map((m) => new Block(m, physic))
  const boxes = ast.meshesBox.map((m) => new Box(m, physic))
  const areas = ast.meshesArea.map((m) => new Area(m))
  const grasses = ast.meshesGrass.map((m) => new Grass(m))
  const player = new Player(clone(ast.meshPlayer), ast.spawn, physic)
  const mobs1 = ast.spawnsMobA.map((m) => new Mob1(clone(ast.meshMob1), m, physic))
  const mobs2 = ast.spawnsMobB.map((m) => new Mob2(clone(ast.meshMob2), m, physic))
  const world = new World(ast.meshesSolid, ast.meshesCollider, physic)
  const camera = new Camera(player)
  const focus = new Focus()
  const ui = new UI(player)
  const light = new Light()
  const canvas = document.querySelector('canvas');
  const graphic = new Graphic(scene, camera, focus, canvas);
  const mobs = mobs1.concat(mobs2)
  const rules = new Rules(player, bloks, boxes, areas, mobs, world, light)

  scene.add(...rubies)
  scene.add(...hearts)
  scene.add(...bloks)
  scene.add(...boxes)
  scene.add(...grasses)
  scene.add(...mobs)
  scene.add(player)
  scene.add(world)
  scene.add(light)

  player.kills = currentKills;
  player.levels = currentLevels;
  player.score = currentScore;
  player.xp = currentXp;
  
  for(let i = 0; i < currentLevels; i++) {
    if(i != 0 && i%2) mobs1.hp += 1, mobs2.hp += 1
        else if(i =! 0 && i%1) mobs1.atk += 0.5, mobs2.atk += 1
  }
//   if(currentLevels == 0) mobs.atk += 0.5, mobs.hp += 1
//     else if(currentLevels == 10) p.hp += 1, p.hpMax += 1
//     else if(currentLevels == 15) p.hp += 1, p.hpMax += 1
//     else if(currentLevels == 25) p.hp += 1, p.hpMax += 1
//     else if(currentLevels == 30) p.hp += 1, p.hpMax += 1

  graphic.onUpdate((dt) => {
    physic.step()
    for (const mob of mobs) mob.update(dt, player)
    for (const rubis of rubies) rubis.update(dt, player)
    for (const heart of hearts) heart.update(dt, player)
    for (const blok of bloks) blok.update(player)
    for (const box of boxes) box.update(dt)
    player.update(dt, mobs, grasses, boxes, areas)
    Grass.update(dt, player)
    world.update(dt)
    focus.update(dt, player, camera)
    camera.update(player)
    rules.update(dt)
    light.update(player)
    ui.update(player)
  })

  Grass.onCut((pos) => {
    if (proba(0.05)) createRubis(pos)
    if (proba(0.05) && player.hp < 4) createHeart(pos)
  })

  Box.onBreak((pos) => {
    for (let i = 0; i < 4; i++) createRubis(pos)
    createRubis(pos, 10)
  })

  Box.onDelete((instance) => {
    removeFromArray(instance, boxes)
  })

  Mob1.onDelete((pos, instance) => {
    if (proba(0.2)) createHeart(pos)
    if (proba(0.2)) createRubis(pos, 10)
    removeFromArray(instance, mobs)
    player.kills++;
    player.score = player.score + 50;
    player.xp = player.xp + 80;
  })

  Mob2.onDelete((pos, instance) => {
    if (proba(0.25)) createHeart(pos)
    removeFromArray(instance, mobs)
    player.kills++;
    player.score = player.score + 100;
    player.xp = player.xp + 10;
  })

  // home.onStart(() => {
  //   home.hide()
    world.playSound()
    player.active = true
  // })

  rules.onGameover(() => {
    const objects3D = { player, mobs, bloks, boxes, grasses, hearts, rubies, focus, world }
    cleanGame(objects3D, graphic, ui)
    gameContainer.innerHTML = ``;
    gameContainer.hidden = true;
    menuBalise.hidden = false;
    header.hidden = false;
    footer.hidden = false;
    system.inGame(inGame = false);
    currentKills += player.kills;
    currentLevels ++;
    currentScore += player.score;
    currentXp += player.xp;
    totalTime += performance.now() - startTime;
    scoreData = {
        score_user_id: userCoData.user_id,
        score_score: currentScore,
        score_level_player: player.xpLevels,
        score_level_stage: currentLevels,
        score_kill: currentKills,
        score_time: formatDurationForMySQL(totalTime)
    };
    db.ipcRenderer.send('addScore', scoreData);
    userData = {
        user_id: scoreData.score_user_id,
        user_bestscore: userData.user_bestscore > currentScore ? userData.user_bestscore : currentScore,
        user_count_death: userData.user_count_death + 1,
    };
    db.ipcRenderer.send('addUserScore', userData);
    currentKills = 0;
    currentLevels = 0;
    currentScore = 0;
    currentXp = 0;
    menuGame(1);
  })
  const startTime = performance.now();
  rules.onLevel(() => {
    const objects3D = { player, mobs, bloks, boxes, grasses, hearts, rubies, focus, world }
    cleanGameLevel(objects3D, graphic);
    player.score = player.score + 75;
    currentKills += player.kills;
    currentLevels ++;
    currentScore += player.score;
    currentXp += player.xp;
    totalTime += performance.now() - startTime;
    playGame();
  })

  // home.show()
  graphic.start()

  function createRubis(pos, val = 1) {
    const ruby = new Rubis(ast.meshesRubis[0], spreadAround(pos, 1, 1), val)
    rubies.push(ruby)
    scene.add(ruby)
  }

  function createHeart(pos) {
    const heart = new Heart(ast.meshesHeart[0], spreadAround(pos, 1, 1))
    hearts.push(heart)
    scene.add(heart)
  }

  if(currentLevels == 2) {
    notifData = { title: "Mais que ?...", content: "Pourquoi tout semble pareil ? ... Pourrai-je m'en sortir ?!" };
    db.ipcRenderer.send('sendNotification', notifData);
  } 
}

// function modalLevel2() { 
//     openModal();
//     modalTitle.innerHTML = `<span>Hein... ??</span>`;
//     modalContent.innerHTML = `</br></br></br><form><span><p>Que se passe-t-il ?! C'est exactement le même endroit... le même ressentit... oh non cela recommen-</p></span>`;
//     modalContent.innerHTML += `</br></br></br><span type="submit" id='buttonPseudo'>Créer</span></form>`;
//     const buttonPseudo = document.getElementById('buttonPseudo');
//     buttonPseudo.addEventListener('click', () => {
//         closeModalFunction();
//     });
// }