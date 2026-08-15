import * as THREE from 'three';
import { GLTFLoader } from 'three/addons';

const clock = new THREE.Timer();

function emptyScene() {
	const scene = new THREE.Scene();
	const renderer = new THREE.Renderer();

	let camera = new THREE.PerspectiveCamera();
	camera.position.set(10, 10, 10);
	camera.lookAt(0, 0, 0);

	let normal_model = undefined;
	let mixamo_model = undefined;

	const loader = new GLTFLoader();

	// Load both models
	loader.load('storage/models/felix.glb', (gltf) => {
		const model = gltf.scene;
		scene.add(model);
		normal_model = model;

		loader.load('/storage/models/felix mixamo.glb', (gltf2) => {
			const model2 = gltf2.scene;
			scene.add(model2);
			mixamo_model = model2;
		}, undefined, console.log);

	}}, undefined, console.log);

	renderer.setAnimationLoop(animate);

	function animate(t) {
		clock.update();
		const delta = clock.getDelta();

		renderer.render(scene, camera);
	}
}
