import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const clock = new THREE.Timer();

export function setupScene(width, height, modelpath, bg_color) {

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(bg_color);

	let camera = null;

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height, false);

	const hem_light = new THREE.HemisphereLight(0xffffff, 0, 1);
	scene.add(hem_light);

	const main_light = new THREE.DirectionalLight(0xffff60, 1);
	main_light.position.set(5, 5, 0);
	main_light.lookAt(0, 0, 0);
	scene.add(main_light);

	const loader = new GLTFLoader();

	let mixer = null;

	function animate(t) {
		clock.update();
		const delta = clock.getDelta();

		if (mixer != null)
			mixer.update(delta);

		renderer.render(scene, camera);
	}

	fetch('http://localhost:3000/dance')
	.then((response) => {
		if (response.ok)
			return response.json()
		else
			return null
	})
	.then((obj) => {
		if (!obj) {
			return;
		}

		const objcam = obj.camera;

		camera = new THREE.OrthographicCamera(
			-objcam.FOV,
			objcam.FOV,
			objcam.FOV*height/width,
			-objcam.FOV*height/width,
			0.1,
			1000);

		camera.position.set(
			objcam.position.x,
			objcam.position.y,
			objcam.position.z);

		camera.lookAt(
			objcam.lookAt.x,
			objcam.lookAt.y,
			objcam.lookAt.z);

		if (obj.defaultModel)
			modelpath += "felix.glb";
		else
			modelpath += "felix olho fechado.glb";

		renderer.domElement.setAttribute('title', obj.title);

		loader.load(modelpath, function (gltf) {
			const model = gltf.scene;
			scene.add(model);

			mixer = new THREE.AnimationMixer(model);
			const clips = gltf.animations;
			const action = mixer.clipAction(THREE.AnimationClip.findByName(clips, obj.id))
			action.play();

			renderer.setAnimationLoop(animate);
		});
	})

	const c = document.getElementById('content-container');
	c.insertBefore(renderer.domElement, c.firstChild);
}
