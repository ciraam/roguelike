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
        this.animator = new Animator(mesh);
        this.initPhysic(physic, origin);
        this.initVisual(mesh);
        this.initAnimations();
    }

    initPhysic(physic, origin) {
        const origin = new Vector3(0, 4, 0);
        const { rigidBody, collider } = createRigidBodyEntity(origin, physic);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }

    initVisual(mesh) {
        this.add(mesh);
    }

    initAnimations() {
        // const animator = new Animator(mesh);
        this.animator.load(IDLE, 2.4);
        this.animator.load(RUN, 0.7);
        this.animator.load(ATTACK, 0.5);
        // this.animator = animator;
    }

    update(dt) {
        this.updatePhysic();
        this.updateVisual(dt);
        this.updateAnimation(dt);
    }

    updatePhysic() {
        const attack = this.ctrl.attack
        let x = attack ? 0 : this.ctrl.x * SPEED
        let z = attack ? 0 : this.ctrl.z * SPEED
        let y = this.rigidBody.linvel().y
        this.rigidBody.setLinvel({ x, y, z }, true)
    }

    updateVisual(dt) {
        this.position.copy(this.rigidBody.translation());
        if(this.ctrl.moving) {
            this.rotation.y += range(this.ctrl.angle, this.rotation.y) * dt * 10;
        }
    }

    updateAnimation(dt) { // problème d'animation
        if(this.ctrl.attack) {
            this.animator.play(RUN); console.log('click');
        } else if(this.ctrl.moving) {
            this.animator.play(ATTACK);
        } else {
            this.animator.play(IDLE);
        }
        this.animator.update(dt)
    }
}