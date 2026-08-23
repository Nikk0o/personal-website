import * as THREE from 'three';
import { GLTFLoader } from 'three/addons';

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

	camera = new THREE.OrthographicCamera(-4, 4, 4*height/width, -4*height/width, 0.1, 1000);
	camera.position.set(0, 6, 8);
	camera.lookAt(0, 1, 0);

	renderer.domElement.setAttribute('title', 'zzz');

	loader.load(modelpath+'felix.glb', function (gltf) {
		const model = gltf.scene;
		scene.add(model);

		mixer = new THREE.AnimationMixer(model);
		const clips = gltf.animations;
		const action = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'descanso'))
		action.play();

		let cubes = getHeadTextureMeshes(scene);
		cubes[0].material = cubes[1].material;

		renderer.setAnimationLoop(
			animate(mixer, renderer, scene, camera, cubes)
		);
	});

	const c = document.getElementById('content-container');
	c.insertBefore(renderer.domElement, c.firstChild);
}

function animate(
	mixer,
	renderer,
	scene,
	camera,
	cubes
) {
	return function (t) {
		clock.update();
		const delta = clock.getDelta();

		if (mixer != null)
			mixer.update(delta);

		renderer.render(scene, camera);
	}
}

// Função para pegar os objetos que têm as texturas
// com olho aberto e fechado.
function getHeadTextureMeshes(scene) {
	let head = scene.getObjectByName('cabeca001');
	return [ head.getObjectByName('Cube011_1'), head.getObjectByName('Cube011_2') ];
}
