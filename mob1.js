import { Vector3, Object3D } from 'three';
import Ai from './ai.js';
// import Particles from '../effect/particles';
// import Entity from './entity';
import { getGap, inHitBox, browse, getDistance } from './function.js';

const ATTACK = 1;
const BLOCK = 2;
const DEAD = 3;
const HIT = 4;
const IDLE = 5;
const IDLE_SHIELD = 6;
const STRAF_SHIELD = 7;
const WALK_SHIELD = 8;
const WALK = 9;
// const STEP_L = 10;
// const STEP_R = 11;
// const SOUND_RANGE = 2;
const VELOCITY = 0.4;
const DEMAGE = 1.5;

export default class Mob1 extends Object3D {
  static hitAngle = Math.PI / 2;
  static hitRange = 1.8;
  static cbDelete = null;
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
        this.updateAnimation(dt);
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
  }

  updatePropsAttack() {
    this.positionVel.set(0, 0);
    this.rotationVel = 0;
  }

  updateAnimAttack(player) {
    if (!player) return;
    if (!this.anim(ATTACK)) return this.onAnimHalf(() => {
      this.sound(ATTACK);
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
      if (!this.anim(WALK_SHIELD)) return this.soundStep();
    } else {
      if (!this.anim(WALK)) return this.soundStep();
    }
  }

  updatePropsIdle(dt) {
    this.positionVel.set(0, 0);
    this.rotationVel = getGap(this.ctrl.angle, this.rotation.y) * dt * 2;
  }

  updateAnimIdle() {
    if (this.rotating) {
    //   if (!this.anim(STRAF_SHIELD, this.signRotation)) return
    //   this.soundStep()
    } else if (this.ctrl.focus) {
      this.anim(IDLE_SHIELD);
    } else {
      this.anim(IDLE);
    }
  }

  updateProsHit() {
    this.positionVel.set(0, 0);
    this.rotationVel = 0;
  }

  updateAnimHit() {
    this.anim(HIT);
    // this.sound(HIT);
  }

  updateAnimBlock() {
    this.anim(BLOCK);
    // this.sound(BLOCK);
  }
  updateAnimIdle() {
    if (this.ctrl.lock) {
      this.anim(IDLE_SHIELD);
    } else {
      this.anim(IDLE);
    }
  }
  updateAnimDead() {
    this.anim(DEAD);
    // this.sound(HIT)
    this.onAnimEnd(() => {
    //   this.sound(DEAD)
      this.delete();
      if (Mob1.cbDelete) Mob1.cbDelete(this.position, this);
    });
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

  updateDistance(player) {
    if (player) {
      this.distance = getDistance(player.position, this.position);
    }
  }

  isVulnerable(entity) {
    return this.isAnim(ATTACK) || !inHitBox(this, entity, Math.PI);
  }

  get isBusy() {
    return (this.isAnim(HIT) || this.isAnim(BLOCK) || this.isAnim(ATTACK) || this.hp <= 0);
  }

  get isCooldown() {
    return this.isAnim(HIT) || this.isAnim(BLOCK) || this.hp <= 0;
  }

  initAnimations() {
    this.loadAnim(ATTACK, 'attack', 2, true);
    this.loadAnim(BLOCK, 'block', 0.2, true);
    this.loadAnim(DEAD, 'dead', 2, true);
    this.loadAnim(HIT, 'hit', 0.5, true);
    this.loadAnim(IDLE, 'idle', 2);
    this.loadAnim(IDLE_SHIELD, 'idle_shield', 2);
    this.loadAnim(STRAF_SHIELD, 'straff_shield', 0.5);
    this.loadAnim(WALK_SHIELD, 'walk_shield', 1.48);
    this.loadAnim(WALK, 'walk', 1.48);
  }
}