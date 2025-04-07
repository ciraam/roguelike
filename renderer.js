// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js';
// const { GLTFLoader } = await import('https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/GLTFLoader.js');
// import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/loaders/FBXLoader.js';
// import * as THREE from '/three';

// const THREE = require('three');
// const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
// import gsap from 'https://cdn.skypack.dev/gsap@3.11.4';

// let userCoData = {
//     user_id: 0,
//     user_pseudo: "",
//     user_createtime: ""
// }
// let userData = {
//     user_id: 0,
//     user_name: "",
//     user_bestscore: 0,
//     user_count_death: 0,
//     user_last_game: ""
// };
// let scoreData = {
//     score_user_id: null,
//     score_level_player: null,
//     score_level_stage: null,
//     score_kill: 0,
//     score_time: '',
//     score_createtime: ''
// };
// let scoreLastGameData = {
//     score_user_id: null,
//     score_level_player: null,
//     score_level_stage: null,
//     score_kill: 0,
//     score_time: ''
// };
// let notifData = {
//     title: "",
//     content: ""
// };

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

// const func = async () => {
//     const response = await window.versions.ping()
//     console.log(response) // Affichera 'pong'
// }
// func();

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

// function formatDate(dateStr) {
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
    
//     return `${day}-${month}-${year}`;
// }

// permet de gérer une modale
// const modal = document.getElementById('modal');
// const closeModal = document.getElementById('closeModal');
// const modalTitle = document.getElementById('modalTitle');
// const modalContent = document.getElementById('modalContent');
// function openModal() {
//     modal.style.display = "block";
// }
// function closeModalFunction() {
//     modal.style.display = "none";
// }
// closeModal.onclick = closeModalFunction;
// window.onclick = function(event) {
//     if (event.target == modal) {
//         closeModalFunction();
//     }
// }

// permet de gérer un temps de chargement (surtout pour les requêtes à la bdd)
// function showLoader() {
//     const loader = document.getElementById('loading-overlay');
//     loader.classList.remove('loading-hidden');
// }
// function hideLoader() {
// const loader = document.getElementById('loading-overlay');
// loader.classList.add('loading-hidden');
// }

// // côté son // 
// function muteUnmute(type) {
//     const allAudio = document.querySelectorAll("audio");
//     allAudio.forEach(audio => {
//         type == 1 ? audio.muted = true : audio.muted = false;
//     });
// }
// const menuStartMusic = document.getElementById('menuStartMusic');
// const menuGameMusic = document.getElementById('menuGameMusic');
// // côté son //

// // côté état //
// let state = null;
// let menuGameState = null;
// let soundState;
// let isPause = false;
// let inGame;
// path.fileSettingsExists().then(exists => {
//     if (exists) {
//         console.log('✅');
//         return path.readFileSettings();
//     }
// }).then(content => {
//     if (content) {
//         soundState = content;
//         muteUnmute(content);
//     }
// }).catch(console.error);
// // côté état //

// const menuBalise = document.getElementById('menu');
// if(menuBalise) {
//     menu();
// }

// function menu() {
//     system.inGame(inGame = false);
//     menuStartMusic.volume = 0.15;
//     menuStartMusic.play();
//     menuBalise.innerHTML = `
//         <h2 id="titleStart">Bienvenue sur Roguelike (nom à changer) ! 👋</h2>
//         <div id="menuStart">
//             <button id="0" class="buttonStart">Jouer</button>
//             <button id="1" class="buttonStart">Options</button>
//             <button id="2" class="buttonStart">Quitter</button>
//         </div>
//         <footer class="game-footer">
//             <p>© 2025 ciraam dev</p>
//         </footer>`;
//     const buttonStart = document.querySelectorAll('.buttonStart');
//     buttonStart.forEach(button => {
//         button.addEventListener('click', () => {
//             if(button.id == "0") {  
//                 state = 0;
//             } else if(button.id == "1") {
//                 state = 1;
//             } else if(button.id == "2") {
//                 state = 2;
//             }
//             if(state == 0) {
//                 // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier & création de son "profil"
//                 path.fileExists().then(exists => {
//                     if (exists) {
//                         console.log('✅');
//                         return path.readFile();
//                     } else {							 		
//                         return modalFirstStart();
//                     }
//                 }).then(content => {
//                     if (content) {
//                         db.ipcRenderer.send('getUserById', parseInt(content));
//                         db.ipcRenderer.once('userById', (err, user) => {
//                             console.log('✅');
//                             userCoData = {
//                                 user_id: user.user_id,
//                                 user_pseudo: user.user_pseudo,
//                                 user_createtime: user.user_createtime
//                             }
//                             state = null;
//                             menuGame(menuGameState = 1);
//                             menuStartMusic.pause();
//                             menuStartMusic.currentTime = 0;
//                         });
//                     } else {
//                         return console.log('📝');
//                     }
//                 }).catch(console.error);
//             } else if(state == 1) {
//                 menuOptions(0, 0);
//             } else if(state == 2) {
//                 system.end();
//             }
//         }); 
//     });
// }

// function modalFirstStart() { // problème pour relancer la modale si champ vide ou pseudo déjà utilisé
//     openModal();
//     modalTitle.innerHTML = `<span>Bienvenue</span>`;
//     modalContent.innerHTML = `</br></br></br><form><span>Entrez votre pseudo</span>`;
//     modalContent.innerHTML += `</br><input type='text' id='inputPseudo' focus/>`;
//     modalContent.innerHTML += `</br></br></br><span type="submit" id='buttonPseudo'>Créer</span></form>`;
//     const inputPseudo = document.getElementById('inputPseudo');
//     const buttonPseudo = document.getElementById('buttonPseudo');
//     if(inputPseudo && buttonPseudo) {
//         buttonPseudo.addEventListener('click', () => {
//             const pseudo = inputPseudo.value;
//             db.ipcRenderer.send('getUsers');
//             db.ipcRenderer.once('users', (event, users) => {
//                 if (pseudo == "") {
//                     modalContent.innerHTML += `</br></br><span>Le champ ne doit pas être vide</span>`;
//                     pseudo = "";
//                     modalFirstStart();
//                 } else if (users.some(user => user.user_pseudo == pseudo)) {
//                     modalContent.innerHTML += `</br></br><span>Pseudo déjà utilisé</span>`;
//                     pseudo = "";
//                     modalFirstStart();
//                 } else {
//                     closeModalFunction();
//                     userData = { user_pseudo: pseudo, user_name: "" , user_bestcore: 0, user_count_death: 0, user_last_game: ""};
//                     db.ipcRenderer.send('addUser', userData)
//                     notifData = { title: "Premier lancement", content: 'Bienvenue ' + pseudo + ' !'};
//                     db.ipcRenderer.send('sendNotification', notifData);
//                     state = 0;
//                     menu();
//                 }
//             });
//         });
//     }
// }

// function menuOptions(settingState, currMenu) {
//     if(settingState == 0) {
//         menuBalise.innerHTML = `
//             ${currMenu == 0 ? `</br></br></br></br></br></br>` : ``}
//             <div id="optionsStart">
//                 <h2>Options</h2><br>
//                 <button id="buttonSound" ${soundState == 0 ? `data-sound="on" class="buttonOptions">Son: ON` : `data-sound="off" class="buttonOptions sound-off">Son: OFF`}</button>
//                 <button id="buttonLore" class="buttonOptions">Psst..psst j'ai un secret..</button>
//             </div><br><br>${currMenu == 0 || currMenu == 2 ? `<span id="menuBack" class="buttonOptions">←</span>` : ``}`;
//         document.querySelectorAll('.buttonOptions').forEach(button => {
//             button.addEventListener('click', (event) => { 
//                 if (event.target.id == "menuBack") {
//                     if(currMenu == 0) {
//                         state = currMenu; 
//                         menu(); 
//                     } else if(currMenu == 1) {
//                         menuGame(menuGameState = currMenu);
//                     } else if(currMenu == 2) {
//                         game();
//                     }
//                 } 
//                 else if (event.target.id == "buttonSound") {
//                     const buttonSound = event.target;
//                     // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier "settings"
//                     path.fileSettingsExists().then(exists => {
//                         if (exists) {
//                             console.log('✅');
//                             return path.readFileSettings();
//                         } else {
//                             if(buttonSound.getAttribute('data-sound') == 'on') {
//                                 buttonSound.setAttribute('data-sound', 'off');
//                                 buttonSound.classList.add('sound-off');
//                             } else {
//                                 buttonSound.setAttribute('data-sound', 'on');
//                                 buttonSound.classList.remove('sound-off');
//                             }
//                             event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
//                             path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
//                             buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
//                             buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
//                         }
//                     }).then(content => {
//                         if (content) {
//                             if(buttonSound.getAttribute('data-sound') == 'on') {
//                                 buttonSound.setAttribute('data-sound', 'off');
//                                 buttonSound.classList.add('sound-off');
//                             } else {
//                                 buttonSound.setAttribute('data-sound', 'on');
//                                 buttonSound.classList.remove('sound-off');
//                             }
//                             event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
//                             path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
//                             buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
//                             buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
//                         } else {
//                             return console.log('📝');
//                         }
//                     }).catch(console.error);
//                 } 
//                 else if (event.target.id == "buttonLore") {
//                     menuOptions(settingState == 0 ? 1 : 0, currMenu);
//                 }  
//             });
//         });
//     } else if(settingState == 1) {
//         menuBalise.innerHTML = `
//             ${currMenu == 0 ? `</br></br></br></br></br></br>` : ``}
//             <div id="optionsStart">
//                 <h2>Options</h2><br>
//                 <button id="buttonSound" ${soundState == 0 ? `data-sound="on" class="buttonOptions">Son: ON` : `data-sound="off" class="buttonOptions sound-off">Son: OFF`}</button>
//                 <button id="buttonLore" class="buttonOptions">Psst..psst j'ai un secret..</button>
//                 <div id="loreContent">
//                     <span><b>Touches</b></span>
//                     <ul>
//                         <li><u>Déplacement</u></li>
//                             - En haut : Z </br>
//                             - À droite : D </br>
//                             - À gauche : Q </br>
//                             - En bas : S </br>
//                         <li><u>Tirer</u></li>
//                             - Barre espace (Spacebar) </br>
//                         <li><u>Viser</u></li>
//                             - En haut : UP</br>
//                             - À droite : RIGHT</br>
//                             - À gauche : LEFT</br>
//                             - En bas : BOTTOM</br>
//                         <li><u>Mettre en pause</u></li>
//                             - ECHAP
//                     </ul>
//                     <span><b>Lore</b></span>
//                         <span><em>Vous voilà dans un univers où survivre est une formalité... </br> Triomphez de vos ennemis et devenez plus fort, afin de peut-être... </br> ÊTRE LIBRE !</em></span>
//                 </div>
//             </div><br><br>${currMenu == 0 || currMenu == 2 ? `<span id="menuBack" class="buttonOptions">←</span>` : ``}`;
//         document.querySelectorAll('.buttonOptions').forEach(button => {
//             button.addEventListener('click', (event) => {
//                 if (event.target.id == "menuBack") {
//                     if(currMenu == 0) {
//                         state = currMenu; 
//                         menu(); 
//                     } else if(currMenu == 1) {
//                         menuGame(menuGameState = currMenu);
//                     } else if(currMenu == 2) {
//                         game();
//                     }
//                 } 
//                 else if (event.target.id == "buttonSound") {
//                     const buttonSound = event.target;
//                     // permet de voir s'il l'user est nouveau ou pas, si oui création d'un fichier "settings"
//                     path.fileSettingsExists().then(exists => {
//                         if (exists) {
//                             console.log('✅');
//                             return path.readFileSettings();
//                         } else {
//                             if(buttonSound.getAttribute('data-sound') == 'on') {
//                                 buttonSound.setAttribute('data-sound', 'off');
//                                 buttonSound.classList.add('sound-off');
//                             } else {
//                                 buttonSound.setAttribute('data-sound', 'on');
//                                 buttonSound.classList.remove('sound-off');
//                             }
//                             event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
//                             path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
//                             buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
//                             buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
//                         }
//                     }).then(content => {
//                         if (content) {
//                             if(buttonSound.getAttribute('data-sound') == 'on') {
//                                 buttonSound.setAttribute('data-sound', 'off');
//                                 buttonSound.classList.add('sound-off');
//                             } else {
//                                 buttonSound.setAttribute('data-sound', 'on');
//                                 buttonSound.classList.remove('sound-off');
//                             }
//                             event.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
//                             path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
//                             buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
//                             buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
//                         } else {
//                             return console.log('📝');
//                         }
//                     }).catch(console.error);
//                 } 
//                 else if (event.target.id == "buttonLore") {
//                     menuOptions(settingState == 0 ? 1 : 0, currMenu);
//                 }  
//             });
//         });
//     }
// }

// function menuGame(menuGameState) {
//     system.inGame(inGame = false);
//     menuGameMusic.volume = 0.15;
//     menuGameMusic.play()
//     const header = document.getElementById('menu-header');
//     header.innerHTML = `
//         <span class="game-header">
//             <h2>${userCoData.user_pseudo}'s journey</h2>
//             <div class="menu-item menu" id="menu-btn">
//                 <div title="Retour menu principal" class="menu-icon">↩️</div>
//             </div>
//             <div class="menu-item profile" id="profile-btn">
//                 <div ${menuGameState == 4 ? `hidden` : `` } title="Profil de ${userCoData.user_pseudo}" class="menu-icon">👤</div>
//             </div>
//         </span>`;
//     const footer = document.getElementById('menu-footer'); // à la fin après avoir rempli le contenu des nav, ajuster l'emplacement des boutons
//     footer.innerHTML = `
//         <nav class="main-menu${menuGameState == 3 ? menuGameState + `-` + soundState : menuGameState }">
//             <div class="menu-item rankings" id="rankings-btn">
//                 <div ${menuGameState == 2 ? `hidden` : `` } title="Classement général & personnel" class="menu-icon">🏆</div>
//             </div>
//             <div class="menu-item play" id="play-btn">
//                 <div ${menuGameState == 1 ? `hidden` : `` } title="Lancer une partie" class="menu-icon">🎮</div>
//             </div>
//             <div class="menu-item settings" id="settings-btn">
//                 <div ${menuGameState == 3 ? `hidden` : `` } title="Options" class="menu-icon">⚙️</div>
//             </div>
//         </nav>`;
//     if(menuGameState == 1) {
//         db.ipcRenderer.send('getUserById', userCoData.user_id);
//         db.ipcRenderer.once('userById', (err, user) => {
//             console.log('✅');
//             userData = {
//                 user_bestscore: user.user_bestscore,
//                 user_count_death: user.user_count_death,
//                 user_last_game: user.user_last_game
//             }          
//         });
//         userData = { user_id: userCoData.user_id, user_last_game: userData.user_last_game };
//         let lastGameIsNull = false;
//         db.ipcRenderer.send('getLastGame', userData);
//         db.ipcRenderer.once('lastGame', (err, score) => {
//             console.log('✅');
//             scoreLastGameData = {
//                 score_level_player: score.score_level_player,
//                 score_level_stage: score.score_level_stage,
//                 score_kill: score.score_kill,
//                 score_time: score.score_time
//             };      
//         });
//         showLoader();
//         setTimeout(() => {
//             hideLoader();
//             scoreLastGameData.score_level_player == null && scoreLastGameData.score_level_stage == null ? lastGameIsNull = true : lastGameIsNull = false;
//             const nav = document.querySelector('.main-menu1');
//             lastGameIsNull ? nav.style= 'margin-top: 40%;' : nav.style= 'margin-top: 12%;';
//             menuBalise.innerHTML = `
//             <div class="menu-game" id="menu-game">
//                 <div class="bestscore-countdeath-container">
//                     <div id="user-bestscore">
//                         <div class="score-menu-title">Meilleur score</div>
//                         <div class="bestscore-countdeath-score">
//                             <div class="score-menu">${userData.user_bestscore}</div>
//                         </div>
//                     </div>
//                     <div id="user-countdeath">
//                         <div class="score-menu-title">Compteur de mort</div>
//                         <div class="bestscore-countdeath-score">
//                             <div class="score-menu">${userData.user_count_death}</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div id="user-lastgame" ${lastGameIsNull == true ? `hidden` : ``}>
//                     <div class="score-menu-title">Dernière partie</div>
//                     <div class="score-lastgame-container">                    
//                         <div class="score-menu">Niveau atteint: ${scoreLastGameData.score_level_player}</div>
//                         <div class="score-menu">Étage atteint: ${scoreLastGameData.score_level_stage}</div>
//                         <div class="score-menu">Ennemis tués: ${scoreLastGameData.score_kill}</div>
//                         <div class="score-menu">Temps: ${scoreLastGameData.score_time}</div>
//                         <div class="score-menu">Le: ${formatDate(userData.user_last_game)}</div>
//                     </div>
//                 </div>
//                 <div id="user-play">
//                     <div id="user-start" title="Jouer" class="play-start">START</div>
//                 </div>
//             </div>`;
//             document.querySelector('.play-start').addEventListener('click', () => {
//                 game();
//             });
//         }, 100);
//     } else if(menuGameState == 2) {
//         menuBalise.innerHTML = `
//             <div class="menu-ranking" id="menu-ranking">
//                 <div>Classment général</div>
//                 <div>Classment personnel</div>
//             </div>`;
//     } else if(menuGameState == 3) {
//         menuOptions(0, 1);
//     } else if (menuGameState == 4) {
//         menuBalise.innerHTML = `
//             <div class="menu-profile" id="menu-profile">
//                 <div>Profil</div>
//             </div>`;
//     } else if(menuGameState == 0) {
//         menuGameMusic.pause();
//         menuGameMusic.currentTime = 0;
//         state = null;
//         menu();
//     }
//     document.querySelectorAll('.menu-item').forEach((elements) => {
//         elements.addEventListener('click', function() {
//             if(elements.id == 'play-btn') {
//                 menuGame(menuGameState = 1);
//             } else if(elements.id == 'rankings-btn') {
//                 menuGame(menuGameState = 2);
//             } else if(elements.id == 'settings-btn') {
//                 menuGame(menuGameState = 3);
//             } else if(elements.id == 'profile-btn') {
//                 menuGame(menuGameState = 4);
//             } else if(elements.id == 'menu-btn') {
//                 menuGame(menuGameState = 0);
//                 header.innerHTML = ``;
//                 footer.innerHTML = ``;
//             }
//         });
//     });
// }

// let gameData = { name: '', exp: 0, life: 0, atk: 0, def: 0, speed: 0 };
// let weaponData = {};
// let armorData = {};
// let skillData = {};
// let playerPosition = { x: 0, y: 0 };
// const gameContainer = document.getElementById('game-container');
// function game() {
//     system.inGame(inGame = true);
//     menuBalise.innerHTML = ``;
//     const header = document.getElementById('menu-header');
//     header.innerHTML = ``;
//     const footer = document.getElementById('menu-footer');
//     footer.innerHTML = ``;
//     gameData = { name: '', exp: 0, life: 20, atk: 5, def: 5, speed: 5 };
    
//     gameContainer.hidden = false;
//     gameContainer.innerHTML = `
//         <img src="img/game/thf1-bk2.gif" id="player"  alt="player img" title="player" hidden>
//         <canvas id="player-3d" ></canvas>
//         <div id="pause-overlay" hidden>
//             <h2>PAUSE</h2>
//             <button class="pause-btn" id="resume">Reprendre (Échap)</button>
//             <button id="buttonSound" ${soundState == 0 ? `data-sound="on" class="buttonOptions">Son: ON` : `data-sound="off" class="buttonOptions sound-off">Son: OFF`}</button>
//             <button class="pause-btn" id="back">Retour menu</button> </br>
//             <div id="pause-lore"><em>Vous voilà dans un univers où survivre est une formalité... </br> Triomphez de vos ennemis et devenez plus fort, afin de peut-être... </br> ÊTRE LIBRE !</em></div> </br>
//             <div id="pause-shortcuts">
//                 <u>Déplacement:</u>
//                 - En haut : Z </br>
//                 - À droite : D </br>
//                 - À gauche : Q </br>
//                 - En bas : S </br>
//                 </br>
//                 <u>Tirer:</u>
//                 - Barre espace (Spacebar)
//             </div>
//             <div id="pause-shortcuts2">
//                 <u>Viser:</u>
//                 - En haut : UP </br>
//                 - À droite : RIGHT </br>
//                 - À gauche : LEFT </br>
//                 - En bas : BOTTOM </br>
//                 </br>
//                 <u>Mettre en pause:</u>
//                 - ECHAP (Escape)
//             </div>
//         </div>`;
//         init3DEnvironment();
//     startGame();
//     // testRender();
//     const overlay = document.getElementById('pause-overlay');
//     const player = document.getElementById('player');
//     const sound = document.getElementById('buttonSound');
//     sound.addEventListener('click', (e) => {
//         path.fileSettingsExists().then(exists => {
//             if (exists) {
//                 console.log('✅');
//                 return path.readFileSettings();
//             } else {
//                 if(buttonSound.getAttribute('data-sound') == 'on') {
//                     buttonSound.setAttribute('data-sound', 'off');
//                     buttonSound.classList.add('sound-off');
//                 } else {
//                     buttonSound.setAttribute('data-sound', 'on');
//                     buttonSound.classList.remove('sound-off');
//                 }
//                 e.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
//                 path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
//                 buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
//                 buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
//             }
//         }).then(content => {
//             if (content) {
//                 if(buttonSound.getAttribute('data-sound') == 'on') {
//                     buttonSound.setAttribute('data-sound', 'off');
//                     buttonSound.classList.add('sound-off');
//                 } else {
//                     buttonSound.setAttribute('data-sound', 'on');
//                     buttonSound.classList.remove('sound-off');
//                 }
//                 e.target.textContent = `Son: ${buttonSound.getAttribute('data-sound') == 'off' ? 'OFF' : 'ON'}`;
//                 path.writeFileSettings(buttonSound.getAttribute('data-sound') == 'off' ? '1' : '0');
//                 buttonSound.getAttribute('data-sound') == 'off' ? soundState = 1 : soundState = 0;
//                 buttonSound.getAttribute('data-sound') == 'off' ? muteUnmute(1) : muteUnmute(0);
//             } else {
//                 return console.log('📝');
//             }
//         }).catch(console.error);
//     });
//     // window.addEventListener('keydown', (e) => {       
//     //     switch(e.key.toLowerCase()) {
//     //         case 'z':
//     //             startWalking(1);
//     //             playerPosition.y -= gameData.speed;
//     //             break;
//     //         case 's':
//     //             startWalking(2);
//     //             playerPosition.y += gameData.speed;
//     //             break;
//     //         case 'q':
//     //             startWalking(3);
//     //             playerPosition.x -= gameData.speed;
//     //             break;
//     //         case 'd':
//     //             startWalking(4);
//     //             playerPosition.x += gameData.speed;
//     //             break;
//     //         case 'escape':
//     //             isPause ? isPause = false : isPause = true;
//     //             isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
//     //             system.pause(isPause);
//     //             // gérer la pause
//     //             break;
//     //     }
//     //     player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
//     // });
//     // window.addEventListener('keyup', (e) => {
//     //     switch(e.key.toLowerCase()) {
//     //         case 'z':
//     //             stopWalking();
//     //             break;
//     //         case 's':
//     //             stopWalking();
//     //             break;
//     //         case 'q':
//     //             stopWalking();
//     //             break;
//     //         case 'd':
//     //             stopWalking();
//     //             break;
//     //     }
//     // });
//     window.addEventListener('keydown', (e) => {
//         if (gameData.isDead) return;
        
//         const speed = gameData.speed * 0.1;
//         switch(e.key.toLowerCase()) {
//             case 'z':
//                 playerPosition.y -= speed;
//                 threeJS.playerModel.rotation.x = Math.sin(Date.now()*0.01)*0.2;
//                 break;
//             case 's':
//                 playerPosition.y += speed;
//                 threeJS.playerModel.rotation.x = Math.sin(Date.now()*0.01)*0.2;
//                 break;
//             case 'q':
//                 playerPosition.x -= speed;
//                 threeJS.playerModel.rotation.y = Math.PI;
//                 break;
//             case 'd':
//                 playerPosition.x += speed;
//                 threeJS.playerModel.rotation.y = 0;
//                 break;
//             case ' ':
//                 attackNearestMonster();
//                 break;
//             case 'escape':
//                 isPause ? isPause = false : isPause = true;
//                 isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
//                 system.pause(isPause);
//                 // gérer la pause
//                 break;
//         }
//         updatePlayerPosition();
//     });
//     document.querySelectorAll('.pause-btn').forEach(elements => {
//         elements.addEventListener('click', function() {
//             if(elements.id == 'resume') {
//                 isPause ? isPause = false : isPause = true;
//                 isPause ? overlay.style = 'display: flex' : overlay.style = 'display: none';
//                 system.pause(isPause);
//                 // gérer la fin de pause-
//             } else if(elements.id == 'back') {
//                 isPause ? isPause = false : isPause = true;
//                 system.pause(isPause);
//                 gameContainer.hidden = true;
//                 menuGame(1);
//             }
//         });
//     });
// }

// // permet de faire l'animation de marche
// // let isWalking = false;
// // let currentStep = 0;
// // let animationId = null;
// // const walkSpeed = 350; // ms
// // const stepImages1 = [
// //     'img/game/thf1-bk1.gif',
// //     'img/game/thf1-bk2.gif'
// // ];
// // const stepImages2 = [
// //     'img/game/thf1-fr1.gif',
// //     'img/game/thf1-fr2.gif'
// // ];
// // const stepImages3 = [
// //     'img/game/thf1-lf1.gif',
// //     'img/game/thf1-lf2.gif'
// // ];
// // const stepImages4 = [
// //     'img/game/thf1-rt1.gif',
// //     'img/game/thf1-rt2.gif'
// // ];
// // function startWalking(type) {
// //     if (!isWalking) {
// //         isWalking = true;
// //         animateWalk(type);
// //     }
// // }
// // function stopWalking(type) {
// //     isWalking = false;
// //     cancelAnimationFrame(animationId);
// //     if(type == 1) {
// //         player.src = stepImages1[0];
// //     } else if(type == 2) {
// //         player.src = stepImages2[0];
// //     } else if(type == 3) {
// //         player.src = stepImages3[0];
// //     } else if(type == 4) {
// //         player.src = stepImages4[0];
// //     }   
// // }
// // function animateWalk(type) {
// //     if (!isWalking) return;
// //     if(type == 1) {
// //         currentStep = (currentStep + 1) % stepImages1.length;
// //         player.src = stepImages1[currentStep];
// //     } else if(type == 2) {
// //         currentStep = (currentStep + 1) % stepImages2.length;
// //         player.src = stepImages2[currentStep];
// //     } else if(type == 3) {
// //         currentStep = (currentStep + 1) % stepImages3.length;
// //         player.src = stepImages3[currentStep];
// //     } else if(type == 4) {
// //         currentStep = (currentStep + 1) % stepImages4.length;
// //         player.src = stepImages4[currentStep];
// //     } 
// //     animationId = requestAnimationFrame(() => {
// //         setTimeout(() => animateWalk(type), walkSpeed);
// //     });
// // }

// // function addWeapon(name, life, atk, speed) {
// //     weaponData.push({
// //         name: name,
// //         life: life,
// //         atk: atk,
// //         speed: speed });
// //     gameData = { name: gameData.name,
// //         exp: gameData.exp,
// //         life: gameData.life + life,
// //         atk: gameData.atk + atk,
// //         def: gameData.def,
// //         speed: gameData.speed + speed };
// // }

// function addArmor(name, life, def, speed) {
//     armorData.push({
//         name: name,
//         life: life,
//         def: def,
//         speed: speed });
//     gameData = { name: gameData.name,
//         exp: gameData.exp,
//         life: gameData.life + life,
//         atk: gameData.atk,
//         def: gameData.def + def,
//         speed: gameData.speed + speed };
// }

// function addSkill(name, life, atk, def, speed) {
//     skillData.push({
//         name: name,
//         life: life,
//         atk: atk,
//         def: def,
//         speed: speed });
//     gameData = { name: gameData.name,
//         exp: gameData.exp,
//         life: gameData.life + life,
//         atk: gameData.atk + atk,
//         def: gameData.def + def,
//         speed: gameData.speed + speed };
// }





  
//   // Données des salles
//   let dungeon = {
//     currentRoom: null,
//     roomHistory: [],
//     roomConfig: {
//       types: ['safe', 'normal', 'elite', 'boss'],
//       difficultyScaling: 0.15,
//       baseMonsterCount: 3
//     }
//   };
  
//   // Données 3D
//   let threeJS = {
//     scene: null,
//     camera: null,
//     renderer: null,
//     playerModel: null,
//     roomObjects: []
//   };
//   function init3DEnvironment() {
//     const container = document.getElementById('game-container');
//     const width = container.clientWidth;
//     const height = container.clientHeight;

//     threeJS.scene = new THREE.Scene();
    
//     // Caméra orthographique adaptée au conteneur
//     threeJS.camera = new THREE.OrthographicCamera(
//         width / -2, width / 2,
//         height / 2, height / -2,
//         1, 1000
//     );
//     threeJS.camera.position.set(0, 15, 0);
//     threeJS.camera.lookAt(0, 0, 0);
    
//     // Renderer avec optimisation
//     threeJS.renderer = new THREE.WebGLRenderer({
//         canvas: document.getElementById('player-3d'),
//         antialias: true,
//         powerPreference: "high-performance"
//     });
//     threeJS.renderer.setSize(width, height);
    
//     // Éclairage optimisé
//     const ambientLight = new THREE.AmbientLight(0x404040);
//     threeJS.scene.add(ambientLight);
    
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 10, 5);
//     threeJS.scene.add(directionalLight);
    
//     createPlayerModel();
// }
//   function generateNewRoom() {
//     // Calcul de la difficulté
//     const difficulty = 1 + (gameData.currentFloor * dungeon.roomConfig.difficultyScaling);
    
//     // Type de salle aléatoire
//     let roomType;
//     if (gameData.currentFloor % 10 === 9) {
//       roomType = 'boss';
//     } else {
//       const weights = {
//         normal: 70,
//         elite: 25,
//         safe: gameData.currentFloor === 0 ? 100 : 5
//       };
//       roomType = weightedRandom(weights);
//     }
  
//     // Génération des monstres
//     const monsters = [];
//     if (roomType !== 'safe') {
//       const count = Math.floor(
//         dungeon.roomConfig.baseMonsterCount * 
//         (roomType === 'elite' ? 1.5 : 1) * 
//         difficulty
//       );
      
//       for (let i = 0; i < count; i++) {
//         monsters.push(generateMonster(roomType, difficulty));
//       }
//     }
  
//     // Création de la salle
//     dungeon.currentRoom = {
//       type: roomType,
//       difficulty,
//       monsters,
//       isCleared: false,
//       position: { x: 0, y: gameData.currentFloor * 10, z: 0 }
//     };
  
//     // Génération 3D
//     generate3DRoom();
//   }
  
//   function generateMonster(roomType, difficulty) {
//     const types = {
//       normal: ['goblin', 'slime'],
//       elite: ['orc', 'skeleton'],
//       boss: ['dragon']
//     };
    
//     const type = types[roomType][Math.floor(Math.random() * types[roomType].length)];
    
//     return {
//       type,
//       health: Math.floor(30 * difficulty),
//       attack: Math.floor(8 * difficulty),
//       position: getRandomPositionInRoom()
//     };
//   }

// function createPlayerModel() {
//     const geometry = new THREE.BoxGeometry(1, 2, 1); // Taille augmentée
//     const material = new THREE.MeshPhongMaterial({
//         color: 0x00ff00,
//         shininess: 100,
//         wireframe: false // Assurez-vous que ce n'est pas en mode filaire
//     });
    
//     threeJS.playerModel = new THREE.Mesh(geometry, material);
//     threeJS.playerModel.position.set(0, 1, 0); // Y = 1 pour être au-dessus du sol
//     threeJS.scene.add(threeJS.playerModel);
    
//     // TEST: Ajoutez une lumière directionnelle ciblée sur le joueur
//     const playerLight = new THREE.DirectionalLight(0xffffff, 1);
//     playerLight.position.set(0, 10, 5);
//     playerLight.target = threeJS.playerModel;
//     threeJS.scene.add(playerLight);
// }
  
// function generate3DRoom() {
//     // Nettoyage
//     threeJS.roomObjects.forEach(obj => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) obj.material.dispose();
//         threeJS.scene.remove(obj);
//     });
//     threeJS.roomObjects = [];

//     // Dimensions adaptatives
//     const container = document.getElementById('game-container');
//     const width = container.clientWidth;
//     const height = container.clientHeight;
//     const roomSize = Math.min(width, height) * 0.8;

//     // Sol
//     const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
//     const floorMaterial = new THREE.MeshStandardMaterial({
//         color: getRoomColor(dungeon.currentRoom.type),
//         side: THREE.DoubleSide
//     });
//     const floor = new THREE.Mesh(floorGeometry, floorMaterial);
//     floor.rotation.x = -Math.PI / 2;
//     threeJS.scene.add(floor);
//     threeJS.roomObjects.push(floor);

//     // Murs
//     const wallHeight = 5;
//     const wallThickness = 0.5;
//     const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8888aa });
    
//     const walls = [
//         { position: [0, wallHeight/2, roomSize/2], size: [roomSize, wallHeight, wallThickness] },
//         { position: [0, wallHeight/2, -roomSize/2], size: [roomSize, wallHeight, wallThickness] },
//         { position: [roomSize/2, wallHeight/2, 0], size: [wallThickness, wallHeight, roomSize], rotationY: Math.PI/2 },
//         { position: [-roomSize/2, wallHeight/2, 0], size: [wallThickness, wallHeight, roomSize], rotationY: Math.PI/2 }
//     ];

//     walls.forEach(wallConfig => {
//         const wall = new THREE.Mesh(
//             new THREE.BoxGeometry(...wallConfig.size),
//             wallMaterial
//         );
//         wall.position.set(...wallConfig.position);
//         if (wallConfig.rotationY) wall.rotation.y = wallConfig.rotationY;
//         threeJS.scene.add(wall);
//         threeJS.roomObjects.push(wall);
//     });
// }

//   function gameLoop() {
//     if (!gameData.isDead) {
//         updatePlayerPosition();
//         checkRoomCompletion();
//         render3DScene();
//         requestAnimationFrame(gameLoop);
//     } else {
//         showGameOver();
//     }
// }

// // function render3DScene() {
// //     // Mise à jour de la caméra pour suivre le joueur
// //     threeJS.camera.position.x = playerPosition.x * 0.1;
// //     threeJS.camera.position.z = playerPosition.y * 0.1 + 10;
// //     threeJS.camera.lookAt(playerPosition.x * 0.1, 0, playerPosition.y * 0.1);
    
// //     threeJS.renderer.render(threeJS.scene, threeJS.camera);
// // }
// function render3DScene() {
//     if (!threeJS.renderer || !threeJS.scene || !threeJS.camera) {
//         console.error("Composants Three.js manquants !");
//         return;
//     }
    
//     // Mise à jour de la position de la caméra pour suivre le joueur
//     threeJS.camera.position.x = playerPosition.x * 0.1;
//     threeJS.camera.position.z = playerPosition.y * 0.1 + 10;
//     threeJS.camera.lookAt(playerPosition.x * 0.1, 0, playerPosition.y * 0.1);
    
//     threeJS.renderer.render(threeJS.scene, threeJS.camera);
// }
  
//   function checkRoomCompletion() {
//     if (dungeon.currentRoom.monsters.every(m => m.health <= 0)) {
//       dungeon.currentRoom.isCleared = true;
//       showRoomTransition();
//     }
//   }
  
//   function showRoomTransition() {
//     gsap.to(threeJS.camera.position, {
//         y: threeJS.camera.position.y + 10,
//         duration: 1,
//         onComplete: () => {
//             gameData.currentFloor++;
//             playerPosition = {x:0, y:0}; // Reset position
//             threeJS.playerModel.position.set(0, 0.5, 0); // Reset modèle 3D
//             generateNewRoom();
//         }
//     });
// }

//   function weightedRandom(weights) {
//     const total = Object.values(weights).reduce((a, b) => a + b);
//     let random = Math.random() * total;
    
//     for (const [key, weight] of Object.entries(weights)) {
//       if (random < weight) return key;
//       random -= weight;
//     }
//   }
  
//   function getRoomColor(roomType) {
//     const colors = {
//       safe: 0x88ccff,
//       normal: 0x88ff88,
//       elite: 0xffcc00,
//       boss: 0xff0000
//     };
//     return colors[roomType];
//   }
  
//   function getRandomPositionInRoom() {
//     return {
//       x: Math.random() * 8 - 4,
//       z: Math.random() * 8 - 4
//     };
//   }
// //   function testRender() {
// //     const scene = new THREE.Scene();
// //     const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// //     camera.position.z = 5;
    
// //     const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('player-3d')});
// //     renderer.setSize(window.innerWidth, window.innerHeight);
    
// //     const geometry = new THREE.BoxGeometry();
// //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// //     const cube = new THREE.Mesh(geometry, material);
// //     scene.add(cube);
    
// //     function animate() {
// //         requestAnimationFrame(animate);
// //         cube.rotation.x += 0.01;
// //         cube.rotation.y += 0.01;
// //         renderer.render(scene, camera);
// //     }
// //     animate();
// // }
//   // Initialisation
// function startGame() {
//     gameData = { 
//       name: '', 
//       exp: 0, 
//       life: 20, 
//       atk: 5, 
//       def: 5, 
//       speed: 5,
//       currentFloor: 0,
//       isDead: false
//     };
//     // const testGeometry = new THREE.BoxGeometry(5, 5, 5);
//     // const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//     // const testCube = new THREE.Mesh(testGeometry, testMaterial);
//     // threeJS.scene.add(testCube);
//     // init3DEnvironment();
//     generateNewRoom();
//     gameLoop(); // Cette ligne doit être exécutée
//     console.log("Game started"); // Vérifiez dans la console
//     requestAnimationFrame(function animate() {
//         render3DScene();
//         requestAnimationFrame(animate);
//     });
//     console.log("Three.js prêt - Version", THREE.REVISION); 
// console.log("Objets dans la scène:", threeJS.scene.children);
// if (threeJS.scene.children.length === 0) {
//     console.error("La scène est vide !");
// } else {
//     threeJS.scene.children.forEach(obj => {
//         console.log(obj.type, obj.position);
//     });
//     console.log("Canvas dimensions:", 
//         threeJS.renderer.domElement.width, 
//         threeJS.renderer.domElement.height);
//     console.log("Canvas in DOM:", document.getElementById('player-3d') === threeJS.renderer.domElement);
// }
// console.log("Player scale:", threeJS.playerModel.scale);
// console.log("Floor dimensions:", threeJS.roomObjects[0].geometry.parameters);
//   }
  
//   // Ajout d'équipement (existant)
//   function addWeapon(name, life, atk, speed) {
//     weaponData.push({ name, life, atk, speed });
//     gameData.life += life;
//     gameData.atk += atk;
//     gameData.speed += speed;
//   }

// function addWalls() {
//     const wallHeight = 5;
//     const wallDepth = 0.5;
//     const wallMaterial = new THREE.MeshStandardMaterial({
//         color: 0x8888aa,
//         metalness: 0.2,
//         roughness: 0.7
//     });

//     // Positions des murs (nord, sud, est, ouest)
//     const positions = [
//         {x:0, z:10, rotY:0, size:[20, wallHeight, wallDepth]},
//         {x:0, z:-10, rotY:0, size:[20, wallHeight, wallDepth]},
//         {x:10, z:0, rotY:Math.PI/2, size:[20, wallHeight, wallDepth]},
//         {x:-10, z:0, rotY:Math.PI/2, size:[20, wallHeight, wallDepth]}
//     ];

//     positions.forEach(pos => {
//         const wall = new THREE.Mesh(
//             new THREE.BoxGeometry(...pos.size),
//             wallMaterial
//         );
//         wall.position.set(pos.x, wallHeight/2, pos.z);
//         wall.rotation.y = pos.rotY;
//         threeJS.scene.add(wall);
//         threeJS.roomObjects.push(wall);
//     });
// }

// function createMonsterModel(type) {
//     const geometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
//     const material = new THREE.MeshPhongMaterial({ 
//         color: type === 'dragon' ? 0xff0000 : 0x8b0000 
//     });
//     return new THREE.Mesh(geometry, material);
// }

// function updatePlayerPosition() {
//     const container = document.getElementById('game-container');
//     const width = container.clientWidth;
//     const height = container.clientHeight;
//     const roomSize = Math.min(width, height) * 0.8;
    
//     // Normalisation de la position par rapport à la taille de la salle
//     threeJS.playerModel.position.x = (playerPosition.x / gameData.speed) * (roomSize/20);
//     threeJS.playerModel.position.z = (playerPosition.y / gameData.speed) * (roomSize/20);
// }

// import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh } from '../node_modules/three/build/three.module.js';
// const canvas = document.querySelector('canvas');
// const scene = new Scene();

// const camera = new PerspectiveCamera(70, widthWindow/innerHeight);
// camera.position.set(0, 0, 4);
// camera.lookAt(0, 0, 0);

// const geometry = new BoxGeometry(1, 1, 1);
// const mesh = new Mesh(geometry);
// scene.add(mesh);

// const graphic = new WebGLRenderer({canvas});
// graphic.render(scene, camera);

// import * as THREE from '../node_modules/three/build/three.module.js';
// class //
// const canvas = document.querySelector('canvas');
// const widthWindow = 672.7;
// class Camera extends THREE.PerspectiveCamera {
//     constructor() {
//         super(70, widthWindow -89, innerHeight -49);
//         this.position.set(0, 0, 4);
//         this.lookAt(0, 0, 0);
//     }
// }

// class Light extends THREE.Object3D {
//     constructor() {
//         super();

//         // Lumière ambiante (éclairage général)
//         const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        
//         // Lumière ponctuelle plus intense
//         const point = new THREE.PointLight(0xffffff, 1, 100);
//         point.position.set(5, 5, 5);  // Position plus adaptée
//         // point.castShadow = true;     // Active les ombres
        
//         this.add(ambient);
//         this.add(point);
//     }
// }

// class Graphic extends THREE.WebGLRenderer {
//     scene = null;
//     clock = new THREE.Clock();
//     camera = null;
//     cbUpdate = null;
//     cbLoop = null;

//     constructor(scene, camera) {
//         super({canvas});
//         this.scene = scene;
//         this.camera = camera;
//         this.shadowMap.enabled = true;
//         this.cbLoop = this.loop.bind(this);
        
//         this.loop();
//     }

//     loop() {
//         const dt = this.clock.getDelta();
//         if(this.cbUpdate) this.cbUpdate(dt);
//         this.render(this.scene, this.camera);
//         this.setSize(widthWindow -89, innerHeight -49);
//         requestAnimationFrame(this.cbLoop);
//     }

//     onUpdate(callback) {
//         this.cbUpdate = callback;
//     }
// }


// const scene = new THREE.Scene();

// const camera = new Camera();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// // const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshPhongMaterial({
//     color: 0x00ff00,
//     specular: 0x111111,
//     shininess: 30
// });
// const mesh = new THREE.Mesh(geometry, material);

// const light = new Light();

// scene.add(mesh);
// scene.add(light);

// const graphic = new Graphic(scene, camera);
// graphic.onUpdate(dt => {

// });
// // graphic.render(scene, camera);

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// class
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

import { Scene }from 'three';
import Camera from './camera.js';
import Light from './light.js';
import Graphic from './graphic.js';
import { loadEntity, loadWorld } from './loader.js';
import World from './worlds.js';
import Player from './player.js';
import physic from './physic.js';

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// initialisation
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const assetW = await loadWorld('./glb/world4.glb');
const assetP = await loadEntity('./glb/character.glb');

const scene = new Scene();
const camera = new Camera();

const world = new World(assetW.visuals, assetW.colliders, physic);
const player = new Player(assetP, physic);
const light = new Light();

scene.add(world);
scene.add(light);
scene.add(player);

const graphic = new Graphic(scene, camera);
graphic.onUpdate(dt => {
  physic.step();
  player.update(dt);
  camera.update(player);
  light.update(player);
});

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// 
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// 
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////