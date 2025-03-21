const { app, Notification } = require('electron');
const mysql = require('mysql2');

function sendNotification(title, content) {
    app.whenReady().then(() => {
        new Notification({ title: title, body: content }).show();
    }); 
}

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roguelike'
});

db.connect((err) => {
    if (err) {
        sendNotification('Erreur', 'Erreur de connexion à la base de données:', err.message);
    } else {
        sendNotification('Connexion', 'Connexion à la base de données MySQL réussie');
    }
});

// const filePath = path.join(__dirname, 'DONT-REMOVE.txt');
// if (fs.existsSync(filePath)) {
//     console.log('Le fichier existe.');
// } else {
//     fs.writeFile(filePath, 'app already started', (err) => {
//         if (err) {
//             console.log('Erreur lors de la création du fichier:', err);
//         } else {
//             console.log('Fichier créé avec succès !');
//             sendNotification('Premier lancement', 'Bienvenue ... !');
//         }
//     });
// }

function dbEnd() {
    db.end();
}

function addScore(score_user_id, score_level_player, score_level_stage, score_kill, score_time) {
    const query = `INSERT INTO score (score_user_id, score_level_player, score_level_stage, score_kill, score_time) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [score_user_id, score_level_player, score_level_stage, score_kill, score_time], (err, results) => {
        if (err) {
            console.log('Erreur lors de l\'insertion du score:', err);
            sendNotification('Erreur lors de l\'insertion du score', `${err.code}: ${err.message}`);
        } else {
            console.log('Score ajouté avec succès!');
            sendNotification('Score ajouté !', results);
        }
    });
}

function getScoresById(score_user_id) {
    const query = `SELECT * FROM score WHERE score_user_id = ?`;
    db.query(query, [score_user_id], (err, results) => {
        if (err) {
            console.log('Erreur lors de la récupération des scores:', err);
        } else {
            console.log('Scores récupérés:', results);
            sendNotification('renvoie score', results);
        }
    });
}

// pour utiliser dans le main & le renderer principalement
module.exports = {
    addScore,
    getScoresById,
    dbEnd
};
