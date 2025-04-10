import { Object3D, Vector3 } from 'three';
import Control from './control.js';
import Animator from './animator.js';
import {
    getGap,
    inHitBox,
    // browse,
    nearest,
    angleOfVector,
    getTarget,
    getAngle,
    createRigidBodyEntity,
    range
  } from './function.js';

const SPEED = 2.5;
const ATTACK = "attack1";
const SHIELD = "idle_shield";
const IDLE = "idle";
const RUN = "run";
const SWORD = 2;
const ROLL = 3;
const ROLL_VOICE = 4;
const REST = 6;
const CRY = 7;
const YELL = 8;
const HIT = 9;
const STEP_L_STONE = 10;
const STEP_R_STONE = 11;
const STEP_L_WOOD = 12;
const STEP_R_WOOD = 13;
const STEP_L_GRASS = 14;
const STEP_R_GRASS = 15;
const STEP_L_DIRT = 16;
const STEP_R_DIRT = 17;
const DEAD = 18;
const PUSH = 19;
const ATTACK_LOADED = 20;
const JUMP = 21;
const FALL = 22;
const RUN_SHIELD = 26;
const STRAF = 27;
const FORWARD = 1;
const BACKWARD = 2;
const LEFT = 3;
const RIGHT = 4;
const VELOCITY = 3;

export default class Player extends Object3D {
    static hitAngle = Math.PI / 4;
    static hitRange = 2.5;
    hp = 4;
    hpMax = 4;
    // rubies = 0
    // speed = 0
    // groundType = null
    // focused = null
    contact = null;
    light = null;
    collider = null;
    rigidBody = null;
    animator = null;
    ctrl = new Control();

    constructor(mesh, origin, physic) {
        super();
        this.animator = new Animator(mesh);
        this.initPhysic(origin, physic);
        this.initVisual(mesh);
        this.initAnimations(mesh);
    }

    initPhysic(origin, physic) {
        // if(!origin) origin = new Vector3(0, 4, 0);
        origin = new Vector3(0, 4, 0);
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

    updateAnimation(dt) { // problème d'animation avec le bouclier quand le perso court
        if(this.ctrl.lock) {
            this.animator.play(SHIELD);
            console.log('shield');
        }else if(this.ctrl.attack) {
            this.animator.play(ATTACK);
            console.log('attack');
        } else if(this.ctrl.moving) {
            this.animator.play(RUN);
        } else {
            this.animator.play(IDLE);
        }
        this.animator.update(dt);
    }

    updatePropsJump(dt) {
        switch (this.getMoveDirection()) {
          case BACKWARD:
            this.positionVel.x = 4 * Math.cos(this.rotation.y + Math.PI / 2);
            this.positionVel.y = -4 * Math.sin(this.rotation.y + Math.PI / 2);
            break;
          case LEFT:
            this.positionVel.x = 4 * Math.cos(this.rotation.y);
            this.positionVel.y = -4 * Math.sin(this.rotation.y);
            break;
          case RIGHT:
            this.positionVel.x = 4 * Math.cos(this.rotation.y + Math.PI);
            this.positionVel.y = -4 * Math.sin(this.rotation.y + Math.PI);
            break;
          case FORWARD:
            this.positionVel.x = 4 * Math.cos(this.rotation.y - Math.PI / 2);
            this.positionVel.y = -4 * Math.sin(this.rotation.y - Math.PI / 2);
            break;
        }
      }
    
      updatePropsIdle(dt) {
        this.positionVel.set(0, 0);
        this.rotationVel = 0;
      }
    
      updateAnimIdle() {
        if (this.ctrl.lock) {
          this.anim(IDLE_SHIELD);
        } else {
          this.anim(IDLE);
        }
      }
    
    
      updateAnimHit() {
        this.anim(HIT);
        // this.sound(CRY)
      }
    
      updateAnimFall() {
        return this.anim(FALL);
      }
    
      hit(entity, damage) {
        if (this.isCooldown) return
        // this.createParticles(entity)
        this.hp -= damage;
        this.hp = Math.max(0, this.hp);
        this.rotationVel = 0;
        this.positionVel.set(0, 0);
        // this.sound(HIT)
        if (this.hp > 0) {
          this.updateAnimHit();
        } else this.updateAnimDaying();
      }
    
      updateAnimDaying() {
        this.anim(DEAD);
        this.onAnimEnd(() => {
          this.sound(DEAD);
          this.delete();
          if(Player.cbDelete)
          Player.cbDelete(this);
        });
      }
    
      addHP(value) {
        this.hp += value;
        this.hp = Math.min(this.hp, this.hpMax);
      }
    
    //   createParticles(entity) {
    //     const x = (this.position.x * 2 + entity.position.x * 1) / 3
    //     const z = (this.position.z * 2 + entity.position.z * 1) / 3
    //     this.parent.add(new Particles(new Vector3(x, this.position.y, z)))
    //   }
    
    //   updatePropsPush(dt) {
    //     const maxVelosity = VELOCITY*0.66 * this.ctrl.magnitude
    //     this.speed = Math.min(this.speed + dt * 6, maxVelosity)
    //     this.positionVel.x = this.ctrl.axis.x * this.speed
    //     this.positionVel.y = this.ctrl.axis.y * this.speed
    //     this.rotationVel = 0
    //     this.rigidBody.lockTranslations(true)
    //     const angle = angleOfVector(this.contact)
    //     if (this.contact.x === 0) {
    //       this.positionVel.x = 0
    //       this.rotation.y = angle + Math.PI
    //       this.rigidBody.setEnabledTranslations(false, true, true, true)
    //     } else {
    //       this.positionVel.y = 0
    //       this.rotation.y = -angle
    //       this.rigidBody.setEnabledTranslations(true, true, false, true)
    //     }
    //     this.contact = null
    //   }
    //   updateAnimPush() {
    //     if (!this.anim(PUSH)) return
    //     this.sound(PUSH)
    //   }
    
      setContactWithBlock(normal) {
        this.contact = normal;
      }
    
      get isBusy() {
        return this.isAttack || this.isCooldown;
      }
    
      get isCooldown() {
        return (this.isAnim(HIT) || this.isAnim(JUMP) || this.isAnim(ROLL) || this.hp <= 0);
      }
    
      get isRoll() {
        return this.isAnim(ROLL) || this.isAnim(JUMP);
      }
    
      get isAttack() {
        return this.isAnim(ATTACK) || this.isAnim(ATTACK_LOADED);
      }
    
      get isShield() {
        return this.isAnim(IDLE_SHIELD) || this.isAnim(RUN_SHIELD) || this.isAnim(STRAF);
      }
    
      get focus() {
        return this.focused;
      }
    
      get isPushing() {
        const c = this.contact;
        if (!c) return false;
        if (!this.positionVel.length()) return false;
        const pushedY = c.x === 0 && -Math.sign(c.y) === Math.sign(this.positionVel.y);
        const pushedX = c.y === 0 && -Math.sign(c.x) === Math.sign(this.positionVel.x);
        if (!pushedY && !pushedX) return false;
        return true;
      }
    
    //   set ground(value) {
    //     this.groundType = value
    //   }
    
    //   updateGround(areas) {
    //     for (const area of areas) {
    //       if (area.containsPoint(this.position)) {
    //         this.groundType = area.type
    //         return
    //       }
    //     }
    //     this.groundType = null
    //   }
    
      getMoveDirection() {
        const moveAngle = angleOfVector(this.ctrl.axis);
        const bodyAngle = this.rotation.y;
        const angle = getGap(moveAngle, bodyAngle);
        if (Math.abs(angle) > (Math.PI * 3) / 4) {
          return BACKWARD;
        } else if (angle > Math.PI / 4) {
          return LEFT;
        } else if (angle < -Math.PI / 4) {
          return RIGHT;
        } else {
          return FORWARD;
        }
      }

    //   updateAnimAttack(mobs, grasses, boxes) {
    //     if (this.isAttack) return
    //     if (this.ctrl.attackLoaded) {
    //       this.anim(ATTACK_LOADED)
    //       this.sound(YELL)
    //       this.onAnimHalf(() => {
    //         this.sound(ROLL)
    //         this.attack(mobs, grasses, boxes, Math.PI * 1.5)
    //       })
    //     } else if (this.ctrl.attackTurbo) {
    //       this.anim(ATTACK).setDuration(0.15)
    //       this.sound(ATTACK)
    //       this.sound(SWORD)
    //       this.onAnimHalf(() => {
    //         this.attack(mobs, grasses, boxes)
    //       })
    //     } else {
    //       this.anim(ATTACK).setDuration(0.4)
    //       this.sound(ATTACK)
    //       this.sound(SWORD)
    //       this.onAnimHalf(() => {
    //         this.attack(mobs, grasses, boxes)
    //       })
    //     }
    //     this.onAnimEnd(() => {
    //       this.anim(IDLE_SHIELD)
    //       this.light.intensity = 0
    //     })
    //   }
    
    attack(mobs, grasses, boxes, range) {
        const mob = nearest(this.position, mobs);
        this.light.intensity = 0.1;
        let length = grasses.length;
        let posOr = this.position;
        for (let i = 0; i < length; i++) {
            const grass = grasses[i];
            if (grass.isCut) continue
                const posTa = grass.position;
            if (Math.abs(posTa.x - posOr.x) < 4.5 && Math.abs(posTa.z - posOr.z) < 4.5) {
                if (inHitBox(this, grass, range)) {
                    this.light.intensity = 0.7;
                    grass.cut();
                }
            }
        }

        length = boxes.length;
        posOr = this.position;
        for (let i = 0; i < length; i++) {
            const box = boxes[i];
            const posTa = box.position;
            if (Math.abs(posTa.x - posOr.x) < 4.5 && Math.abs(posTa.z - posOr.z) < 4.5) {
                if (inHitBox(this, box, range)) {
                    this.light.intensity = 1.5;
                    box.hit(this);
                }
            }
        }

        if (mob && inHitBox(this, mob, range)) {
            mob.hit(this);
            this.light.intensity = 1.5;
        }
    }

    alwayslookTarget() {
        if (this.focused)
            this.rotation.y = getAngle(this.focused.position, this.position);
    }

    updateFocus(mobs) {
        this.updateFocusSound();
        this.updateFocused(mobs);
    }

    updateFocused(mobs) {
        if (this.ctrl.lock) this.focused = getTarget(this.position, mobs, 4);
        else this.focused = null;
    }
}