import {
  TextureLoader,
  EquirectangularReflectionMapping,
  MeshPhongMaterial
} from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js'

const texture = new TextureLoader().load('./image/sky.jpg')
texture.mapping = EquirectangularReflectionMapping

export const materialA = new MeshPhongMaterial({
  color: '#00ff00',
  specular: '#ffffff',
  shininess: 5,
  envMap: texture
})
export const materialB = new MeshPhongMaterial({
  color: '#ff0000',
  specular: '#ffffff',
  shininess: 5,
  envMap: texture
})
