import * as THREE from 'three';
import { GLTFLoader } from 'three/addons';

export { createEmptyScene };

const clock = new THREE.Timer();

function createEmptyScene() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcccccc);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(500, 500);

	let camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
	camera.position.set(10, 10, 10);
	camera.lookAt(0, 2, 0);

	let light = new THREE.AmbientLight(0xffffff, 2);
	scene.add(light);

	let normal_model = undefined;
	let mixamo_model = undefined;

	const loader = new GLTFLoader();

	// Load both models
	loader.load('http://localhost:3000/storage/models/felix.glb', (gltf) => {
		const model = gltf.scene;
		scene.add(model);
		normal_model = model;

		loader.load('http://localhost:3000/storage/models/felix mixamo.glb', (gltf2) => {
			const model2 = gltf2.scene;
			mixamo_model = model2;
		}, undefined, console.log);

	}, undefined, console.log);

	renderer.setAnimationLoop(animate);

	function animate(t) {
		clock.update();
		const delta = clock.getDelta();

		renderer.render(scene, camera);
	}

	return renderer.domElement;
}
