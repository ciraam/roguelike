import { Vector2 } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js'
import { floor } from '../tool/function.js'

const eventOnly = {
  attack: true,
  jump: true
}

const buttons = {
  attack: 0,
  jump: 1,
  lock: 7
}

export const keys = {
  z: 'up',
  s: 'down',
  q: 'left',
  d: 'right',
  ' ': 'jump'
}

export const mouseButtons = {
  0: 'attack',
  2: 'lock'
}

export class Ctrl {
  active = false
  angle = 0
  axis = new Vector2()
  lock = false
  attack = false
  jump = false
  attackLoaded = false
  attackTurbo = false

  pressed = {}
  previousPressed = {}
  tempoPress = 0
  countPress = 0
  tempoCount = 0
  gamepad = null
  cbKeydown = null
  cbKeyup = null

  constructor(entity) {
    this.angle = entity.rotation.y
    this.cbKeydown = this.keydown.bind(this)
    this.cbKeyup = this.keyup.bind(this)
    document.addEventListener('keydown', this.cbKeydown)
    document.addEventListener('keyup', this.cbKeyup)
    document.addEventListener('mousedown', this.mousedown.bind(this));
    document.addEventListener('mouseup', this.mouseup.bind(this));
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  compute(dt) {
    if (!this.active) return
    this.loopGamepad()
    this.updateFocus()
    this.updateJump()
    this.updateAxis()
    this.updateAttack()
    this.updateAttackLoaded(dt)
    this.updateAttackTurbo(dt)
    this.updateAngle()
  }
  updateFocus() {
    this.lock = !!this.pressed.lock
  }
  updateJump() {
    this.jump = this.pressed.jump
  }
  updateAxis() {
    if (!this.gamepad) {
      const pressed = this.pressed
      if (pressed.up && !pressed.down) {
        this.axis.y = -1
      } else if (!pressed.up && pressed.down) {
        this.axis.y = 1
      } else {
        this.axis.y = 0
      }
      if (pressed.left && !pressed.right) {
        this.axis.x = -1
      } else if (!pressed.left && pressed.right) {
        this.axis.x = 1
      } else {
        this.axis.x = 0
      }
      this.axis.normalize()
    }
  }

  updateAttack() {
    this.attack = !!this.pressed.attack
  }

  updateAttackLoaded(dt) {
    if (this.previousPressed.attack) {
      this.tempoPress += dt
      if (this.tempoPress > 1) {
        this.attackLoaded = true
        this.attack = true
        this.tempoPress = 0
      }
    } else {
      this.tempoPress = 0
      this.attackLoaded = false
    }
  }

  updateAttackTurbo(dt) {
    if (this.pressed.attack) {
      this.countPress++
    }
    this.tempoCount += dt
    if (this.tempoCount > 1) {
      this.tempoCount = 0
      if (this.countPress > 4) this.attackTurbo = true
      else this.attackTurbo = false
      this.countPress = 0
    }
  }

  updateAngle() {
    const axis = this.axis
    if (axis.length() !== 0) {
      this.angle = Math.atan2(-axis.y, axis.x) + Math.PI / 2
    }
  }

  clearKeys() {
    for (let key in eventOnly) {
      this.pressed[key] = false
    }
  }

  loopGamepad() {
    this.gamepad = navigator.getGamepads()[0]
    if (!this.gamepad) return
    this.clearKeys()
    if (!this.previousPressed.attack)
      this.pressed.attack = this.gamepad.buttons[buttons.attack].pressed

    if (!this.previousPressed.jump)
      this.pressed.jump = this.gamepad.buttons[buttons.jump].pressed

    this.pressed.lock = this.gamepad.buttons[buttons.lock].pressed

    this.axis.x = floor(this.gamepad.axes[0])
    this.axis.y = floor(this.gamepad.axes[1])

    this.previousPressed.attack = this.gamepad.buttons[buttons.attack].pressed
    this.previousPressed.jump = this.gamepad.buttons[buttons.jump].pressed
  }

  keydown(e) {
    this.clearKeys();
    const key = keys[e.key.toLowerCase()];
    
    if (key && !this.previousPressed[key]) {
      this.pressed[key] = true;
      this.previousPressed[key] = true;
    }
  }

  keyup(e) {
    const key = keys[e.key.toLowerCase()];
    if (key) {
      this.pressed[key] = false;
      this.previousPressed[key] = false;
    }
  }

  mousedown(e) {
    const action = mouseButtons[e.button];
    if (action) {
      this.pressed[action] = true;
      this.previousPressed[action] = true;
    }
  }

  mouseup(e) {
    const action = mouseButtons[e.button];
    if (action) {
      this.pressed[action] = false;
      this.previousPressed[action] = false;
    }
  }

  isPressed(action) {
    return this.pressed[action] || false;
  }

  disable() {
    this.active = false
  }

  enable() {
    this.active = true
  }

  delete() {
    document.removeEventListener('keydown', this.cbKeydown)
    document.removeEventListener('keyup', this.cbKeyup)
    document.addEventListener('mousedown', this.mousedown.bind(this));
    document.addEventListener('mouseup', this.mouseup.bind(this));
  }

  get magnitude() {
    return this.axis.length()
  }

  get moving() {
    return !!this.axis.length()
  }
}
