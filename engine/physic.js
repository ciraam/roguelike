import Rapier from 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.11.2/+esm'
await Rapier.init()
export default new Rapier.World({ x: 0, y: -9.81, z: 0 })
