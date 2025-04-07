const { app,  Notification } = require('electron');
const path = require('node:path');
const icon = path.join(__dirname, 'img/icon.ico');
const mysql = require('mysql2');
// let id = null;

app.name = "roguelike project";

function sendNotification(title, content) {
    new Notification({ title: title, body: content, icon: icon, silent: true }).show();
}

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roguelike'
});

db.connect((err) => {
    if (err) {
        // sendNotification('Erreur', 'Erreur de connexion à la base de données:', err.message);
    } else {
        // sendNotification('Connexion', 'Connexion à la base de données MySQL réussie');
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
        }
    });
}

function getScoreById(score_user_id) {
    const query = `SELECT * FROM score WHERE score_user_id = ?`;
    db.query(query, [score_user_id], (err, results) => {
        if (err) {
            console.log('Erreur lors de la récupération des scores:', err);
        } else {
            console.log('Scores récupérés:', results);
            sendNotification('renvoie score', results);
            return results;
        }
    });
}

function getScoreById(score_user_id, callback) {
    const query = `SELECT * FROM score WHERE score_user_id = ?`;
    db.query(query, [score_user_id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des scores de l\'user:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const score = results[0];
                callback(null, score);
            } else {
                callback(null, null);
            }
        }
    });
}

function getScores(callback) {
    const query = `SELECT * FROM score`;
    db.query(query, (err, results) => {
        if (err) {
            console.log('Erreur lors de la récupération des scores:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

function getLastGame(user_id, user_last_game, callback) {
    const query = `SELECT * FROM score WHERE score_user_id = ? & score_createtime = ?`;
    db.query(query, [user_id, user_last_game], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'user:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const user = results[0];
                callback(null, user);
            } else {
                callback(null, null);
            }
        }
    });
}


function addUser(user_pseudo) {
    const query = `INSERT INTO user (user_pseudo) VALUES (?)`;
    db.query(query, [user_pseudo], (err, results) => {
        if (err) {
            console.log('Erreur lors de l\'insertion de l\'user:', err);
            sendNotification('Erreur lors de l\'insertion de l\'user:', `${err.code}: ${err.message}`);
        }
    });
}

// function getUserById(user_id) {
//     const query = `SELECT * FROM user WHERE user_id = ?`;
//     db.query(query, [user_id], (err, results) => {
//         if (err) {
//             console.log('Erreur lors de la récupération de l\'user:', err);
//         } else {
//             // console.log('User récupéré:', results);
//             // sendNotification('renvoie user', results);
//             id = results.user_id.toString();
//             // return results;
//         }
//     });
// }

function getUserById(user_id, callback) {
    const query = `SELECT * FROM user WHERE user_id = ?`;
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'user:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const user = results[0];
                callback(null, user);
            } else {
                callback(null, null);
            }
        }
    });
}

// function getUserByPseudo(user_pseudo) {
//     const query = `SELECT * FROM user WHERE user_pseudo = ?`;
//     db.query(query, [user_pseudo], (err, results) => {
//         if (err) {
//             console.log('Erreur lors de la récupération de l\'user:', err);
//         } else {
//             // console.log('User récupéré:', results);
//             // sendNotification('renvoie user id', results.user_id);
//             id = results.user_id;
//             // if(id != null) {
//                 sendNotification('bdd id', results[0]);
//             // }
//             // return results;
            
//         }
//     });
// }

function getUserByPseudo(user_pseudo, callback) {
    const query = `SELECT * FROM user WHERE user_pseudo = ?`;
    db.query(query, [user_pseudo], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'user:', err);
            callback(err, null);
        } else {
            if (results.length > 0) {
                const user = results[0];
                callback(null, user);
            } else {
                callback(null, null);
            }
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
            callback(null, results);
        }
    });
}

// pour utiliser dans le main & le renderer principalement
module.exports = {
    addScore,
    getScores,
    getScoreById,
    getLastGame,
    addUser,
    getUsers,
    getUserById,
    getUserByPseudo,
    dbEnd
};
