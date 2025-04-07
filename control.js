// const ATTACK = 0;
// const JUMP = 1;
// const LOCK = 7;
// const X = 0;
// const Z = 1;

// export default class Control {

//     get control() {
        // return navigator.getGamepads()[0];
//     }

//     get x() {
//         if(!this.control) return 0;
//         return  this.control.axes[X];
//     }

//     get z() {
//         if(!this.control) return 0;
//         return  this.control.axes[Z];
//     }

//     get attack() {
//         if(!this.control) return false;
//         return this.control.buttons[ATTACK].pressed;
//     }

//     get jump() {
//         if(!this.control) return false;
//         return this.control.buttons[JUMP].pressed;
//     }

//     get lock() {
//         if(!this.control) return false;
//         return this.control.buttons[LOCK].pressed;
//     }
// }
import { angle } from './function.js';

export default class Control {
    constructor() {
        // État des touches
        this._keys = {
            z: false,      // Avancer (ou W en QWERTY)
            s: false,      // Reculer (ou S en QWERTY)
            q: false,      // Gauche (ou A en QWERTY)
            d: false,      // Droite (ou D en QWERTY)
            Space: false,  // Sauter
            Shift: false   // Verrouiller
        };
        
        // État des boutons de souris
        this._mouseButtons = {
            left: false    // Attaque
        };
        
        // Valeurs des axes X et Z (simulées pour le mouvement)
        this._axes = {
            x: 0,
            z: 0
        };
        
        // Configuration des écouteurs d'événements
        this._setupEventListeners();
        
        // Mise à jour des axes à chaque frame
        this._updateAxesInterval = setInterval(() => this._updateAxes(), 16);
    }
    
    _setupEventListeners() {
        // Gestion des touches du clavier
        window.addEventListener('keydown', (e) => {
            if (this._keys.hasOwnProperty(e.key)) {
                this._keys[e.key] = true;
            }
            if (e.key == 'z') this._keys.z = true;
            if (e.key == 'q') this._keys.q = true;
            if (e.key == 'd') this._keys.d = true;
            if (e.key == 's') this._keys.s = true;
            if (e.key == ' ') this._keys.Space = true;
            if (e.key == 'Shift') this._keys.Shift = true;
        });
        
        window.addEventListener('keyup', (e) => {
            if (this._keys.hasOwnProperty(e.key)) {
                this._keys[e.key] = false;
            }
            if (e.key == 'z') this._keys.z = false;
            if (e.key == 'q') this._keys.q = false;
            if (e.key == 'd') this._keys.d = false;
            if (e.key == 's') this._keys.s = false;
            if (e.key == ' ') this._keys.Space = false;
            if (e.key == 'Shift') this._keys.Shift = false;
        });
        
        // Gestion des clics de souris
        window.addEventListener('mousedown', (e) => {
            if (e.button == 0) { // bouton gauche
                this._mouseButtons.left = true;
            }
        });
        
        window.addEventListener('mouseup', (e) => {
            if (e.button == 0) { // bouton gauche
                this._mouseButtons.left = false;
            }
        });
        
        // Empêcher le menu contextuel sur clic droit
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    _updateAxes() {
        // Calcul des axes X et Z basé sur les touches actives
        // Pour l'axe X : -1 (gauche) à 1 (droite)
        // Pour l'axe Z : -1 (avant) à 1 (arrière)
        
        let x = 0;
        let z = 0;
        
        if (this._keys.q) x -= 1;
        if (this._keys.d) x += 1;
        if (this._keys.z) z -= 1;
        if (this._keys.s) z += 1;
        
        // Normalisation pour les mouvements diagonaux
        if (x !== 0 && z !== 0) {
            const magnitude = Math.sqrt(x * x + z * z);
            x /= magnitude;
            z /= magnitude;
        }
        
        this._axes.x = x;
        this._axes.z = z;
    }
    
    // Getters pour accéder aux contrôles
    get x() {
        return this._axes.x;
    }
    
    get z() {
        return this._axes.z;
    }
    
    get attack() {
        return this._mouseButtons.left;
    }
    
    get jump() {
        return this._keys.Space;
    }
    
    get lock() {
        return this._keys.Shift;
    }
    
    get angle() {
        return angle(this.x, this.z);
    }

    get moving() {
        return Math.abs(this.x) || Math.abs(this.z);
    }
    // // Méthode pour nettoyer les événements quand nécessaire
    // dispose() {
    //     clearInterval(this._updateAxesInterval);
    //     // Idéalement, vous devriez aussi supprimer tous les écouteurs d'événements
    //     // mais cela nécessiterait de stocker les références aux fonctions handlers
    // }
}