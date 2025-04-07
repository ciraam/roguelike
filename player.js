import { Object3D, Vector3 } from 'three';
import { createRigidBodyEntity, range } from './function.js';
import Control from './control.js';
import Animator from './animator.js';

const SPEED = 2;
const ATTACK = 'attack1';
const IDLE = 'idle';
const RUN = 'run';

export default class Player extends Object3D {
    collider = null;
    rigidBody = null;
    animator = null;
    ctrl = new Control();

    constructor(mesh, physic) {
        super();
        const origin = new Vector3(0, 4, 0);
        this.initPhysic(physic, origin);
        this.initVisual(mesh);
        this.initAnimations(mesh);
    }

    initPhysic(physic, origin) {
        const { rigidBody, collider } = createRigidBodyEntity(origin, physic);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    initVisual(mesh) {
        this.add(mesh);
    }

    initAnimations(mesh) {
        const animator = new Animator(mesh);
        animator.load(IDLE, 3);
        animator.load(RUN, 0.5);
        animator.load(ATTACK, 0.3);
        this.animator = animator;
    }

    update(dt) {
        this.updatePhysic();
        this.updateVisual(dt);
        this.updateAnimation(dt);
    }

    updatePhysic() {
        const x = this.ctrl.x * SPEED;
        const z = this.ctrl.z * SPEED;
        const y = this.rigidBody.linvel().y; // useless askip ?
        // const y = -50;
        this.rigidBody.setLinvel({x, y, z}, true);
    }

    updateVisual(dt) {
        this.position.copy(this.rigidBody.translation());
        if(this.ctrl.moving) {
            this.rotation.y += range(this.ctrl.angle, this.rotation.y) * dt * 10;
        }
    }

    updateAnimation(dt) { // problème d'animation attaque, tout fonctionne et ruen manque sauf cett anim 
        if(this.ctrl.attack) {
            this.animator.play(ATTACK);
        } else if(this.ctrl.moving) {
            this.animator.play(RUN);
        } else {
            this.animator.play(IDLE);
        }
        this.animator.update(dt);
    }
}