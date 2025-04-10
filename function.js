import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat";

function createColliderGeo(geo, rigidBody, physic) {
    const vertices = new Float32Array(geo.attributes.position.array);
    const indices = new Float32Array(geo.index.array);
    const colliderDesc = ColliderDesc.trimesh(vertices, indices);
    return physic.createCollider(colliderDesc, rigidBody);
}

function createColliderBall(radius, rigidBody, physic) {
    const colliderDesc = ColliderDesc.ball(radius);
    return physic.createCollider(colliderDesc, rigidBody);
}

export function createRigidBodyFixed(mesh, physic) {
    const rigidBodyDesc = RigidBodyDesc.fixed();
    const rigidBody = physic.createRigidBody(rigidBodyDesc);
    const collider = createColliderGeo(mesh.geometry, rigidBody, physic);
    return { rigidBody, collider };
}

export function createRigidBodyEntity(position, physic) {
    const rigidBodyDesc = RigidBodyDesc.dynamic();
    rigidBodyDesc.setTranslation(...position);
    const rigidBody = physic.createRigidBody(rigidBodyDesc);
    const collider = createColliderBall(0.1, rigidBody, physic);
    return { rigidBody, collider };
}

export function browse(object, callback) {
    if(object.isMesh) callback(object);
    const children = object.children;
    for(let i = 0; i < children.length; i++) {
        browse(children[i], callback);
    }
}

export function angle(x, z) {
    return Math.atan2(-z, x) + Math.PI / 2;
}

export function range(angle1, angle2) {
    let angle = ((angle1 - angle2 + Math.PI)) % (Math.PI * 2) - Math.PI;
    angle < - Math.PI ? angle + Math.PI * 2 : angle;
    return angle;
}

export function findByName(name, list) {
    return list.find((a) => name === a.name);
}

export function inHitBox(objOrigin, objTarget, hitAngleForce) {
    const hitAngle = hitAngleForce || objOrigin.constructor.hitAngle;
    const hitRange = objOrigin.constructor.hitRange;
    const originPos = objOrigin.position;
    const targetPox = objTarget.position;
    const originDir = objOrigin.rotation.y;
    const targetDir = getAngle(targetPox, originPos);
    const deltaPos = getDistance(targetPox, originPos);
    const deltaDir = getGapAbs(targetDir, originDir);
    return deltaPos < hitRange && deltaDir < hitAngle;
}

export function getGap(angle1, angle2) {
    let angle = ((angle1 - angle2 + Math.PI) % (Math.PI * 2)) - Math.PI;
    angle < -Math.PI ? angle + Math.PI * 2 : angle;
    return angle;
}

export function getDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dz = point1.z - point2.z;
    return Math.sqrt(dx * dx + dz * dz);
}

export function getTarget(position, mobs, distance) {
    const entity = nearest(position, mobs);
    if (!entity) return null;
    const dis = getDistance(entity.position, position);
    return dis < distance ? entity : null;
}

export function getAngle(point1, point2) {
    const dx = point1.x - point2.x;
    const dz = point1.z - point2.z;
    return Math.atan2(-dz, dx) + Math.PI / 2;
}

export function nearest(position, objects) {
    objects.sort((a, b) => {
      return position.distanceTo(a.position) - position.distanceTo(b.position);
    });
    return objects[0];
}

export function angleOfVector(point) {
    return Math.atan2(-point.y, point.x) + Math.PI / 2;
}

export function getGapAbs(angle1, angle2) {
    let angle = ((angle1 - angle2 + Math.PI) % (Math.PI * 2)) - Math.PI;
    angle < -Math.PI ? angle + Math.PI * 2 : angle;
    return Math.abs(angle);
}

export function randomBool(positiveProbability = 0.5) {
    return Math.random() < positiveProbability;
}
  
export function randomInt(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}