# Roguelike Project

**Projet du 13/03/25 pour le 19/04/25** : Jeu de type **Roguelike** développé avec **Javascript** et **Electron** pour une application de bureau.
(compilation vitef histoire de ...)

## Description

Le projet consiste à créer un jeu de type **Roguelike** où le joueur explore un monde avec pour objectif de survivre le plus longtemps possible. Le jeu propose des **combats en temps réel** et une **mort permanente**. À chaque nouvelle partie, le joueur perd toute sa progression et ses améliorations, mais certaines données (meilleurs scores, niveaux atteints, etc.) sont enregistrées dans une base de données pour permettre aux joueurs de comparer leurs scores et suivre leurs progrès au fil du temps.

## Technologies utilisées

- **Javascript** (Three.js, Rapier.js)
- **Electron** (Node.js)
- **MySQL** (base de données)
- **HTML/CSS**

## Fonctionnalités

### 1. Combat en temps réel
- Les **combats** se déroulent en temps réel, où le joueur et les ennemis peuvent attaquer et se déplacer simultanément, sans attendre un tour de jeu.
- Le joueur doit réagir rapidement aux actions des ennemis et décider du bon moment pour attaquer ou esquiver.

### 2. Progression du personnage
- **Complétion niveau** : Chaque niveau passé renforce les monstres.
- **Niveaux et améliorations** : En tuant des ennemis, le joueur gagne de l'expérience et peut monter de niveau, ce qui lui permet d'améliorer ses caractéristiques.
- **Réinitialisation du personnage** : À la fin de chaque partie, le personnage est réinitialisé, mais les **scores** et les **niveaux atteints** sont enregistrés.

### 3. Mort unique
- **Mort permanente** : Si le joueur meurt, il perd toute sa progression dans le donjon (niveaux, améliorations, etc.).
- Cependant, les **scores** et les **niveaux atteints** sont enregistrés dans la base de données pour afficher un tableau des meilleurs scores.

## Base de données : **MySQL**

### 1. Table des Joueurs

La table **`user`** contient les informations relatives aux joueurs :

| Champ             | Type       | Description                                               |
|-------------------|------------|-----------------------------------------------------------|
| `user_id`         | INTEGER    | Identifiant unique du joueur.                             |
| `user_pseudo`     | TEXT       | Nom unique du joueur.                                     |
| `user_bestscore`  | INTEGER    | Le meilleur score du joueur.                              |
| `user_count_death`| INTEGER    | Nombre de fois où le joueur est mort.                     |
| `user_last_game`  | DATETIME   | Date de la dernière partie jouée.                         |
| `user_createtime` | DATETIME   | Date de création du compte.                               |

### 2. Table des Scores

La table **`score`** contient les scores des joueurs :

| Champ             | Type       | Description                                               |
|-------------------|------------|-----------------------------------------------------------|
| `score_id`        | INTEGER    | Identifiant unique du score.                              |
| `score_user_id`   | INTEGER    | Identifiant unique du joueur.                             |
| `score_score`     | INTEGER    | Score de la partie du joueur.                             |
| `score_level_player` | INTEGER  | Niveau du joueur lors de la partie.                       |
| `score_level_stage`  | INTEGER  | Niveau du jeu lors de la partie.                          |
| `score_kill`      | INTEGER    | Nombre d'ennemis tués par le joueur.                      |
| `score_time`      | TIME       | Temps de complétion du niveau.                            |
| `score_createtime`| DATETIME   | Date de la partie où le score a été obtenu.               |

## Structure de l'application

### Accueil

- **Jouer** :
    - Si c'est le premier lancement de l’application, demande du pseudo et ajout de l'utilisateur à la base de données, puis affichage du **tableau de bord**.
    - Sinon, affichage du **tableau de bord** :
        - Lancer une partie.
        - Profil :
            - Statistiques du joueur (nombre de morts, meilleur score, etc.).
            - Informations sur le personnage.
            - **Classement des joueurs**.
        - **Classement des joueurs** :
            - Classement général.
            - Historique des scores du joueur.
        - **Options**.

- **Options** :
    - Son.
    - Raccourcis : Explication des touches utilisées dans le jeu + "lore" du jeu.
- **Quitter** : Fermer l'application.
