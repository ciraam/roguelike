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

if (electron) {
    notifData = { title: "debug", content: "test" };
    // test envoie notif
    electron.ipcRenderer.send('sendNotification', notifData);
    // test ajout d'un score
    // electron.ipcRenderer.send('addScore', scoreData);
    // console.log(scoreData);
    // test récupération d'un score
    electron.ipcRenderer.on('getScoreById', (event, highScores) => {
        const scoreList = document.getElementById('score-list');
        scoreList.innerHTML = '';
        highScores.forEach(score => {
            const listItem = document.createElement('li');
            listItem.textContent = `${score.player_name}: ${score.score}`;
            scoreList.appendChild(listItem);
        });
    });

} else {
    console.log('ipcRenderer n\'est pas disponible dans le renderer');
}

const information = document.getElementById('info');
information.innerText = `Cette application utilise Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), et Electron (v${versions.electron()})`;

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

// window.addEventListener('DOMContentLoaded', (event) => {
    const t = document.getElementById('test');
    t.addEventListener('click', function() {
        console.log('ok');
    }); 
// });
  
