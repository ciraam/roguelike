import { Vector3, Vector2, Object3D } from 'three';
import Ai from './ai.js';
import Animator from './animator.js';
// import Particles from '../effect/particles';
// import Entity from './entity';
import { getGap, inHitBox, browse, getDistance, createRigidBodyEntity } from './function.js';

const SPEED = 1.5;
const ATTACK = 'attack';
const BLOCK = 'block';
const DEAD = 'dead';
const HIT = 'hit';
const IDLE = 'idle';
const IDLE_SHIELD = 'idle_shield';
const STRAF_SHIELD = 'straff_shield';
const WALK_SHIELD = 'walk_shield';
const WALK = 'walk';
// const STEP_L = 10;
// const STEP_R = 11;
// const SOUND_RANGE = 2;
const VELOCITY = 0.4;
const DEMAGE = 1.5;

export default class Mob1 extends Object3D {
  static hitAngle = Math.PI / 2;
  static hitRange = 1.8;
  static cbDelete = null;
  rotationVel = 0;
  positionVel = new Vector2();
  hp = 2;
  distance = 999;
  ctrl = null;
  animator = null;

  constructor(mesh, origin, physic) {
    super(mesh, origin, physic)
    this.ctrl = new Ai(4, origin.position, 0.7)
    this.animator = new Animator(mesh);
    this.initPhysic(physic);
    this.initVisual(mesh);
    this.initAnimations(mesh);
  }

  initVisual(mesh) {
    browse(mesh, (m) => (m.castShadow = true));
    mesh.position.y -= 0.5;
    mesh.scale.set(1.5, 1.5, 1.5);
    this.add(mesh);
  }

  //   initVisual(mesh) {
    //       this.add(mesh);
    //   }

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

  updatePropsAttack() {
    this.positionVel.set(0, 0);
    this.rotationVel = 0;
  }

  updateAnimAttack(player) {
    if (!player) return;
    if (!this.animator.play(ATTACK)) return this.onAnimHalf(() => {
      // this.sound(ATTACK);
      if (inHitBox(this, player)) {
        player.hit(this, DEMAGE);
      }
    });
  }

  updatePropsWalk(dt) {
    this.positionVel.x = this.ctrl.axis.x * VELOCITY;
    this.positionVel.y = this.ctrl.axis.y * VELOCITY;
    this.rotationVel = getGap(this.ctrl.angle, this.rotation.y) * dt * 2;
  }

  updateAnimWalk() {
    if (this.ctrl.focus) {
      if (!this.animator.play(WALK_SHIELD)) return this.soundStep();
    } else {
      if (!this.animator.play(WALK)) return this.soundStep();
    }
  }

  updatePropsIdle(dt) {
    this.positionVel.set(0, 0);
    this.rotationVel = getGap(this.ctrl.angle, this.rotation.y) * dt * 2;
  }

  updateAnimIdle() {
    if (this.rotating) {
      if (!this.animator.play(STRAF_SHIELD)) return
    //   this.soundStep()
    } else if (this.ctrl.focus) {
      this.animator.play(IDLE_SHIELD);
    } else {
      this.animator.play(IDLE);
    }
  }

  updateProsHit() {
    this.positionVel.set(0, 0);
    this.rotationVel = 0;
  }

  updateAnimHit() {
    this.animator.play(HIT);
    // this.sound(HIT);
  }

  updateAnimBlock() {
    this.animator.play(BLOCK);
    // this.sound(BLOCK);
  }
  updateAnimIdle() {
    if (this.ctrl.lock) {
      this.animator.play(IDLE_SHIELD);
    } else {
      this.animator.play(IDLE);
    }
  }
  updateAnimDead() {
    this.animator.play(DEAD);
    // this.sound(HIT)
    this.animator.onAnimEnd(() => {
    //   this.sound(DEAD)
      this.delete();
      if (Mob1.cbDelete) Mob1.cbDelete(this.position, this);
    });
  }

  static onDelete(callback) {
    this.cbDelete = callback
  }

  hit(entity) {
    if (this.isCooldown) return this.createParticles(entity);
    this.updateProsHit();
    if (this.isVulnerable(entity)) {
      this.hp -= 1;
      if (this.hp > 0) this.updateAnimHit();
      else this.updateAnimDead();
    } else {
      this.updateAnimBlock();
    }
  }

  createParticles(entity) {
    const x = (this.position.x * 3 + entity.position.x * 1) / 4;
    const z = (this.position.z * 3 + entity.position.z * 1) / 4;
    this.parent.add(new Particles(new Vector3(x, this.position.y - 0.2, z)));
  }

  updateDistance(player) {
    if (player) {
      this.distance = getDistance(player.position, this.position);
    }
  }

  isVulnerable(entity) {
    return this.animator.play(ATTACK) || !inHitBox(this, entity, Math.PI);
  }

  get isBusy() {
    return (this.animator.play(HIT) || this.animator.play(BLOCK) || this.animator.play(ATTACK) || this.hp <= 0);
  }

  get isCooldown() {
    return this.animator.play(HIT) || this.animator.play(BLOCK) || this.hp <= 0;
  }

  initAnimations() {
    this.animator.load('attack', 0.3);
    this.animator.load('block', 0.2);
    this.animator.load('dead', 2);
    this.animator.load('hit', 0.5);
    this.animator.load('idle', 2);
    this.animator.load('idle_shield', 2);
    this.animator.load('straff_shield', 0.5);
    this.animator.load('walk_shield', 1.48);
    this.animator.load('walk', 1.48);
  }
}