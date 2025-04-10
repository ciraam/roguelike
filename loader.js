import { GLTFLoader } from 'three/loaders/GLTFLoader.js';
import { browse } from './function.js';

const loaderGlb = new GLTFLoader();

export async function loadWorld(path) {
    const glb = await loaderGlb.loadAsync(path);
    const visuals = [];
    const colliders = [];
    const meshesGrass = [];
    const meshesRubis = [];
    const meshesHeart = [];
    const meshesSolid = [];
    const meshesBlock = [];
    const meshesBox = [];
    const meshesCollider = [];
    const meshesArea = [];
    const spawnsMobA = [];
    const spawnsMobB = [];
    let spawn = null;

    for(const mesh of glb.scene.children) {
        const name = mesh.name;
        console.log(name);
        if(name.includes('visual')) visuals.push(mesh);
        else if(name.includes('collider')) colliders.push(mesh);
        else if (name.includes('grass')) meshesGrass.push(mesh);
        else if (name.includes('plant')) meshesGrass.push(mesh);
        else if (name.includes('collider')) meshesCollider.push(mesh);
        else if (name.includes('rubis')) meshesRubis.push(mesh);
        else if (name.includes('heart')) meshesHeart.push(mesh);
        else if (name.includes('block')) meshesBlock.push(mesh);
        else if (name.includes('box')) meshesBox.push(mesh);
        else if (name.includes('spawn')) spawn = mesh;
        else if (name.includes('mobA')) spawnsMobA.push(mesh);
        else if (name.includes('mobB')) spawnsMobB.push(mesh);
        else if (name.includes('area')) meshesArea.push(mesh);
    }

    return { visuals, 
        colliders, 
        meshesGrass,
        meshesRubis,
        meshesHeart,
        meshesSolid,
        meshesBlock,
        meshesBox,
        meshesCollider,
        meshesArea,
        // meshPlayer,
        // meshMob1,
        // meshMob2,
        spawnsMobA,
        spawnsMobB,
        spawn };
}

export async function loadEntity(path) {
    const glb = await loaderGlb.loadAsync(path);
    const mesh = glb.scene.children[0];
    browse(mesh, (m) => { m.castShadow = true });
    mesh.clips = glb.animations;
    // for(const mesh of glb.animations) {
    //     const name = mesh.name;
    //     console.log(name);
    // }
    return mesh;
}