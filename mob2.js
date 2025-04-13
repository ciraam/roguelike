import { Vector3, Vector2, Object3D } from 'three';
import Ai from './ai.js';
import Animator from './animator.js';
// import Particles from '../effect/particles';
// import Entity from './entity';
import { getGap, inHitBox, browse, getDistance, createRigidBodyEntity } from './function.js';

const SPEED = 1.5;
const ATTACK = 'attack';
const JUMP = 'jump';
const BLOCK = 'block';
const DEAD = 'dead';
const HIT = 'hit';
const IDLE = 'idle';
// const SOUND_RANGE = 1;
const VELOCITY = 0.4;
const DEMAGE = 1.5;

export default class Mob2 extends Object3D {
  static hitAngle = Math.PI / 2;
  static hitRange = 1.8;
  static cbDelete = null;
  rotationVel = 0;
  positionVel = new Vector2();
  hp = 3;
  distance = 999;
  ctrl = null;
  animator = null;

  constructor(mesh, origin, physic) {
    super(mesh, origin, physic);
    this.ctrl = new Ai(2, origin, 0.5);
    this.animator = new Animator(mesh);
    this.initPhysic(physic);
    this.initVisual(mesh);
    this.initAnimations(mesh);
  }

  initVisual(mesh) {
    browse(mesh, (m) => (m.castShadow = true));
    mesh.position.y -= 0.4;
    mesh.scale;
    this.add(mesh);
  }

  initPhysic(physic) {
    const origin = new Vector3(0, 4, 0);
    const { rigidBody, collider } = createRigidBodyEntity(origin, physic);
    this.rigidBody = rigidBody;
    this.collider = collider;
}

  update(dt, player) {
    this.updatePhysic();
    this.updateVisual(dt);
    this.onUpdate(dt, player);
}

updatePhysic() {
    const action = this.ctrl.attack||this.ctrl.lock
    const x = action ? 0 : this.ctrl.x * SPEED;
    const z = action ? 0 : this.ctrl.z * SPEED;
    const y = this.rigidBody.linvel().y;
    this.rigidBody.setLinvel({x, y, z}, true);
}

updateVisual(dt) {
    this.position.copy(this.rigidBody.translation());
    if(this.ctrl.moving) {
        this.rotation.y += range(this.ctrl.angle, this.rotation.y) * dt * 10;
    }
}
  onUpdate(dt, player) {
    if (!this.isBusy) {
      if (this.ctrl.attack) {
        this.updatePropsAttack();
        this.updateAnimAttack(player);
      } else if (this.ctrl.moving) {
        this.updatePropsWalk(dt);
        this.updateAnimWalk();
      } else {
        this.updatePropsIdle(dt);
        this.updateAnimIdle();
      }
    }
    this.updateDistance(player);
    this.animator.update(dt);
  }

  updateAnimIdle() {
    if (this.ctrl.lock) {
      this.animator.play(IDLE_SHIELD);
    } else {
      this.animator.play(IDLE);
    }
  }

  updatePropsAttack() {
    this.rotationVel = 0;
    this.positionVel.x = 3 * Math.cos(this.rotation.y - Math.PI / 2);
    this.positionVel.y = -3 * Math.sin(this.rotation.y - Math.PI / 2);
  }

  updateAnimAttack(player) {
    if (!player) return
    if (!this.animator.play(ATTACK)) return this.sound(JUMP);
    this.animator.onAnimHalf(() => {
      if (inHitBox(this, player)) {
        player.hit(this, DEMAGE);
      }
    });
    this.animator.onAnimEnd(() => {
      this.positionVel.x = 0;
      this.positionVel.y = 0;
    });
  }

  updatePropsWalk(dt) {
    this.positionVel.x = this.ctrl.axis.x * VELOCITY;
    this.positionVel.y = this.ctrl.axis.y * VELOCITY;
    this.rotationVel = getGap(this.ctrl.angle, this.rotation.y) * dt * 2;
  }

  updateAnimWalk() {
    if (!this.animator.play(JUMP)) return this.animator.onAnimHalf(() => {
      // this.sound(JUMP, this.volume);
    });
  }

  updatePropsIdle(dt) {
    this.positionVel.set(0, 0);
    this.rotationVel = getGap(this.ctrl.angle, this.rotation.y) * dt * 2;
  }

  updateAnimIdle() {
    this.animator.play(IDLE);
  }

  updateDistance(player) {
    if (player) {
      this.distance = getDistance(player.position, this.position);
    }
  }

  updateClipHit() {
    this.animator.play(HIT);
    // this.sound(HIT);
    this.animator.onAnimEnd(() => {
      this.animator.play(IDLE);
    });
  }

  hit(entity) {
    if (this.isCooldown) return
    this.createParticles(entity)
    this.hp -= 1;
    this.positionVel.set(0, 0);
    this.rotationVel = 0;
    if (this.hp > 0) this.updateClipHit();
    else this.updateClipDaying();
  }

  updateClipDaying() {
    this.scale.set(0, 0, 0);
    // this.sound(DEAD);
    this.delete();
    if (Mob2.cbDelete) Mob2.cbDelete(this.position, this);
  }

  createParticles(entity) {
    const x = (this.position.x * 3 + entity.position.x * 1) / 4;
    const z = (this.position.z * 3 + entity.position.z * 1) / 4;
    this.parent.add(new Particles(new Vector3(x, this.position.y - 0.2, z)));
  }

  get isBusy() {
    return this.animator.play(HIT) || this.animator.play(ATTACK) || this.hp <= 0;
  }

  get isCooldown() {
    return this.animator.play(HIT) || this.hp <= 0;
  }

  get volume() {
    return SOUND_RANGE / this.distance;
  }

  static onDelete(callback) {
    this.cbDelete = callback
  }

  initAnimations() {
    this.animator.load('attack', 0.3);
    this.animator.load('hit', 0.4);
    this.animator.load('idle', 2);
    this.animator.load('jump', 1);
  }

}