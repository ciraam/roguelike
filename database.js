const { app, Notification } = require('electron');
const mysql = require('mysql2');
let id = null;

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
            // console.log('Score ajouté avec succès!');
            // sendNotification('Score ajouté !', results);
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

function addUser(user_pseudo) {
    const query = `INSERT INTO user (user_pseudo) VALUES (?)`;
    db.query(query, [user_pseudo], (err, results) => {
        if (err) {
            console.log('Erreur lors de l\'insertion de l\'user:', err);
            sendNotification('Erreur lors de l\'insertion de l\'user:', `${err.code}: ${err.message}`);
        } else {
            // console.log('User ajouté avec succès!');
            // sendNotification('User ajouté !', results);
            id = parseInt(getUserById(results.insertId));
        }
    });
}

function getUserById(user_id) {
    const query = `SELECT * FROM user WHERE user_id = ?`;
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.log('Erreur lors de la récupération de l\'user:', err);
        } else {
            // console.log('User récupéré:', results);
            // sendNotification('renvoie user', results);
            id = parseInt(results.user_id);
        }
    });
}

function getUsers(callback) {
    const query = `SELECT * FROM user`;
    db.query(query, (err, results) => {
        if (err) {
            console.log('Erreur lors de la récupération des users:', err);
            callback(err, null);
        } else {
            // console.log('Users récupérés:', results);
            // sendNotification('renvoie users', results);
            callback(null, results);
        }
    });
}

// pour utiliser dans le main & le renderer principalement
module.exports = {
    addScore,
    getScoresById,
    addUser,
    getUsers,
    getUserById,
    dbEnd
};
