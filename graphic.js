import { WebGLRenderer, Clock } from "three";

const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 48;

export default class Graphic extends WebGLRenderer {
    scene = null;
    clock = new Clock();
    camera = null;
    cbUpdate = null;
    cbLoop = null;

    constructor(scene, camera) {
        super({ canvas });
        this.scene = scene;
        this.camera = camera;
        this.setSize(canvas.width, canvas.height);
        this.shadowMap.enabled = true;
        this.loop = this.loop.bind(this);
        this.loop();
    }

    loop() {
        const dt = this.clock.getDelta();
        if(this.cbUpdate) this.cbUpdate(dt);
        this.render(this.scene, this.camera);
        requestAnimationFrame(this.loop);
    }

    onUpdate(callback) {
        this.cbUpdate = callback;
    }
}