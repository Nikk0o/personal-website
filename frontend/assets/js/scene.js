import * as three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var scene = null;
var camera = null;
var renderer = null;
var loader = null;
var felix = null;
var mixer = null;

var clock = new three.Clock();

export function setupScene(width, height, modelpath, bg_color) {

	const n = 4;

	scene = new three.Scene();
	scene.background = new three.Color(bg_color);

	camera = new three.OrthographicCamera(-n, n, n*height/width, -n*height/width, 0.1, 1000);
	camera.position.set(6, 5, 6);
	camera.lookAt(0, 1.5, 0);

	renderer = new three.WebGLRenderer();
	renderer.setSize(width, height, false);

	let hem_light = new three.HemisphereLight(0xffffff, 0, 1);
	scene.add(hem_light);

	let main_light = new three.DirectionalLight(0xffff60, 1);
	main_light.position.set(5, 5, 0);
	main_light.lookAt(0, 0, 0);
	scene.add(main_light);

	loader = new GLTFLoader();

	loader.load(modelpath, function (model) {
		felix = model.scene;
		scene.add(felix);

		// run his animation
		mixer = new three.AnimationMixer(felix);

		const clips = model.animations;
		const action = mixer.clipAction(clips[0], felix).setLoop(three.LoopRepeat);
		console.log(action);
		action.play();

	}, undefined, function (err) { console.log(err); });

	function animate(t) {
		requestAnimationFrame(animate);

		const delta = clock.getDelta();
		mixer.update(delta);

		renderer.render(scene, camera);
	}
	renderer.setAnimationLoop(animate);

	document.body.appendChild(renderer.domElement);
}
