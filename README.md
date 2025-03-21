# Roguelike

**Projet du 13/03/25 pour le 19/04/25** : Jeu de type **Roguelike** développé avec **Javascript** et **Electron** pour une application de bureau.

## Description

Le projet consiste à créer un jeu de type **Roguelike** où le joueur explore un monde généré aléatoirement avec pour objectif d'aller le plus loin possible. Le jeu propose des **combats en temps réel** et une **mort permanente**. À chaque nouvelle partie, le joueur perd toute sa progression et ses améliorations, mais certaines données (meilleurs scores, niveaux atteints, etc.) sont enregistrées dans une base de données locale pour permettre aux joueurs de comparer leurs scores et suivre leurs progrès au fil du temps.

## Technologies utilisées

- **Javascript**
- **Node.js**
- **Electron** (framework)
- **MySQL** (base de données)
- **HTML/CSS**

## Fonctionnalités

### 1. Génération Aléatoire
- Les **niveaux** sont générés aléatoirement à chaque partie, et plus les niveaux augmentent, plus la difficulté est élevée.
- Chaque niveau peut être une salle **safe**, une salle remplie de **monstres**, ou une salle dite **soft**.
- Les **ennemis** sont également placés aléatoirement dans les salles, créant ainsi une expérience unique à chaque partie.

### 2. Combat en Temps Réel
- Les **combats** se déroulent en temps réel, où le joueur et les ennemis peuvent attaquer et se déplacer simultanément, sans attendre un tour de jeu.
- Le joueur doit réagir rapidement aux actions des ennemis et décider du bon moment pour attaquer (ou utiliser des compétences ?).

### 3. Progression du Personnage
- **Caractéristiques du personnage** : Le joueur commence avec des statistiques de base comme les points de vie (**HP**), l'attaque (**ATK**), la défense (**DEF**), etc.
- **Niveaux et améliorations** : En tuant des ennemis, le joueur gagne de l'expérience et peut monter de niveau, ce qui lui permet d'améliorer ses caractéristiques et de débloquer des **pouvoirs**.
- **Réinitialisation du personnage** : À la fin de chaque partie, le personnage est réinitialisé, mais les **scores** et les **niveaux atteints** sont enregistrés.

### 4. Mort Permanente (Permadeath)
- **Mort permanente** : Si le joueur meurt, il perd toute sa progression dans le donjon (niveaux, améliorations, etc.).
- Cependant, les **scores** et les **niveaux atteints** sont enregistrés dans la base de données locale pour afficher un tableau des meilleurs scores.

### 5. Tableau des Meilleurs Scores
- Lors de la mort du personnage, le **score** (niveau atteint, ennemis tués, etc.) est comparé aux scores déjà enregistrés dans la base de données.
- Un **tableau des meilleurs scores** est affiché, permettant au joueur de voir ses résultats précédents et ceux des autres joueurs.

## Base de données : **MySQL**

### 1. Table des Joueurs

La table **`user`** contient les informations relatives aux joueurs :

| Champ             | Type       | Description                                               |
|-------------------|------------|-----------------------------------------------------------|
| `user_id`         | INTEGER    | Identifiant unique du joueur.                             |
| `user_pseudo`     | TEXT       | Nom unique du joueur.                                     |
| `user_name`       | TEXT       | Nom du personnage du joueur (choisi lors de la création/mort d’un personnage). |
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
            - (Scores des 3 dernières parties ?). 
        - **Classement des joueurs** :
            - Classement général.
            - Historique des scores du joueur.
        - **Options**.

- **Options** :
    - Son.
    - Raccourcis : Explication des touches utilisées dans le jeu + explication du jeu.
- **Quitter** : Fermer l'application.
