import * as THREE from '../../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/Addons.js';

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

	fetch('/api/dance')
	.then((response) => {
		if (response.ok)
			return response.json()
		else
			return null
	})
	.then((animation) => {
		if (!animation) {
			return;
		}

		const objcam = animation.camera;

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

		renderer.domElement.setAttribute('title', animation.title);

		if (animation.mixamo)
			modelpath += 'felix mixamo.glb';
		else
			modelpath += 'felix.glb';

		loader.load(modelpath, function (gltf) {
			const model = gltf.scene;
			scene.add(model);

			mixer = new THREE.AnimationMixer(model);
			const clips = gltf.animations;
			const action = mixer.clipAction(THREE.AnimationClip.findByName(clips, animation.id))
			action.play();

			let cubes = getHeadTextureMeshes(scene, animation.mixamo);
			if (!animation.openEyes)
				cubes[0].material = cubes[1].material;

			renderer.setAnimationLoop(
				animate(animation.blink, mixer, renderer, scene, camera, cubes)
			);
		});
	})

	const c = document.getElementById('content-container');
	c.insertBefore(renderer.domElement, c.firstChild);
}

function animate(
	blink,
	mixer,
	renderer,
	scene,
	camera,
	cubes
) {
	let big_delta = 0;
	let eyes_closed = false;

	return function (t) {
		clock.update();
		const delta = clock.getDelta();

		if (mixer != null)
			mixer.update(delta);

		// Animação de piscar
		big_delta += delta;
		let changed = false
		if (blink) {
			if (eyes_closed && big_delta > 0.25 || !eyes_closed && big_delta > 1.5) {
				eyes_closed = !eyes_closed;
				changed = true;
			}
			else
				changed = false;

			if (changed) {
				const tmp = cubes[0].material;
				cubes[0].material = cubes[1].material;
				cubes[1].material = tmp;

				big_delta = 0;
			}
		}

		renderer.render(scene, camera);
	}
}

// Função para pegar os objetos que têm as texturas
// com olho aberto e fechado.
function getHeadTextureMeshes(scene, mixamo) {
	if (!mixamo) {
		let head = scene.getObjectByName('cabeca001');
		return [ head.getObjectByName('Cube011_1'), head.getObjectByName('Cube011_2') ];
	}
	else {
		let head = scene.getObjectByName('cabeca002');
		return [ head.getObjectByName('cabeca001mesh_1'), head.getObjectByName('cabeca001mesh_2') ];
	}
}
