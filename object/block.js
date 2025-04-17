import { Mesh } from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js'
import Rapier from 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.11.2/+esm'
import { removeFromArray, creatRigidBox } from '../tool/function.js'

export default class Block extends Mesh {
  static soundPush = new Audio('./sound/push.wav')
  static soundDrop = new Audio('./sound/drop.wav')

  physic = null
  rigidBody = null
  collision = false

  constructor(mesh, physic) {
    super()
    this.initVisual(mesh)
    this.initPhysic(physic)
  }

  initVisual(mesh) {
    this.copy(mesh)
    this.castShadow = true
    this.receiveShadow = true
  }

  initPhysic(physic) {
    const { rigidBody, collider } = creatRigidBox(this.position, physic, 0.75)
    this.rigidBody = rigidBody
    this.collider = collider
    this.physic = physic
  }

  update(player) {
    this.updatePhysic(player)
    this.updateVisual()
  }

  updatePhysic(player) {
    this.rigidBody.setEnabledTranslations(true, true, true)
    this.collision = false
    if (player && player.position.y <= this.position.y)
      this.physic.contactPair(this.collider, player.collider, (manifold) => {
        const normal = manifold.normal()
        const contactDir = { x: normal.x, y: normal.z }
        if (Math.abs(contactDir.x) > Math.abs(contactDir.y)) {
          contactDir.y = 0
          this.rigidBody.lockTranslations()
          this.rigidBody.setEnabledTranslations(true, true, false, true)
        } else {
          contactDir.x = 0
          this.rigidBody.lockTranslations()
          this.rigidBody.setEnabledTranslations(false, true, true, true)
        }
        if (contactDir.x !== 0 || contactDir.y !== 0) {
          this.collision = true
          player.setContactWithBlock(contactDir)
        }
      })
  }

  updateVisual() {
    this.position.copy(this.rigidBody.translation())
  }

  delete() {
    this.removeFromParent()
    this.physic.removeCollider(this.collider)
    this.physic.removeRigidBody(this.rigidBody)
  }
}
