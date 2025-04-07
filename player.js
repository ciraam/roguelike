import { Object3D, Vector3 } from 'three';
import { createRigidBodyEntity, range } from './function.js';
import Control from './control.js';
import Animator from './animator.js';

const SPEED = 1.5;
const ATTACK = "attack1";
const SHIELD = "idle_shield";
const IDLE = "idle";
const RUN = "run";

export default class Player extends Object3D {
    collider = null;
    rigidBody = null;
    animator = null;
    ctrl = new Control();

    constructor(mesh, physic) {
        super();
        this.animator = new Animator(mesh);
        this.initPhysic(physic);
        this.initVisual(mesh);
        this.initAnimations(mesh);
    }

    initPhysic(physic) {
        const origin = new Vector3(0, 4, 0);
        const { rigidBody, collider } = createRigidBodyEntity(origin, physic);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    initVisual(mesh) {
        this.add(mesh);
    }

    initAnimations() {
        this.animator.load(IDLE, 3);
        this.animator.load(RUN, 0.5);
        this.animator.load(ATTACK, 0.3);
        this.animator.load(SHIELD, 0.3);
    }

    update(dt) {
        this.updatePhysic();
        this.updateVisual(dt);
        this.updateAnimation(dt);
    }

    updatePhysic() {
        const attack = this.ctrl.attack;
        const x = attack ? 0 : this.ctrl.x * SPEED;
        const z = attack ? 0 : this.ctrl.z * SPEED;
        const y = this.rigidBody.linvel().y;
        this.rigidBody.setLinvel({x, y, z}, true);
    }

    updateVisual(dt) {
        this.position.copy(this.rigidBody.translation());
        if(this.ctrl.moving) {
            this.rotation.y += range(this.ctrl.angle, this.rotation.y) * dt * 10;
        }
    }

    updateAnimation(dt) { // problème d'animation avec le bouclier 
        if(this.ctrl.attack) {
            this.animator.play(ATTACK);
            console.log('attack');
        } else if(this.ctrl.moving) {
            this.animator.play(RUN);
        } else if(this.ctrl.lock) {
            this.animator.play(SHIELD);
            console.log('shield');
        } else {
            this.animator.play(IDLE);
        }
        this.animator.update(dt);
    }
}