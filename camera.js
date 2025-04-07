import { PerspectiveCamera } from "three";

const canvas = document.querySelector('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

export default class Camera extends PerspectiveCamera {
    constructor() {
        super(70, innerWidth / innerHeight);
        this.position.set(0, 5.4, 9);
        this.lookAt(0, 1, 1.05);
    }

    update(player) {
        this.position.copy(player.position);
        this.position.y += 1.75;
        // this.position.x -= 0.15;
    }
}