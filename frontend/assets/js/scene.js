import * as three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const clock = new three.Clock();

export function setupScene(width, height, modelpath, bg_color) {

	const scene = new three.Scene();
	scene.background = new three.Color(bg_color);

	let camera = null;

	const renderer = new three.WebGLRenderer();
	renderer.setSize(width, height, false);

	const hem_light = new three.HemisphereLight(0xffffff, 0, 1);
	scene.add(hem_light);

	const main_light = new three.DirectionalLight(0xffff60, 1);
	main_light.position.set(5, 5, 0);
	main_light.lookAt(0, 0, 0);
	scene.add(main_light);

	const loader = new GLTFLoader();

	let mixer = null;

	let dta = 0
	function animate(t) {
		const delta = clock.getDelta();

		if (mixer != null)
			mixer.update(delta);

		renderer.render(scene, camera);
	}

	fetch('/api/dance')
	.then((response) => {
		if (response.ok)
			return response.json()
		else
			return { id: "-1" }
	})
	.then((jsn) => {
		const d = parseInt(jsn.id, 10);
		let valid = true;
		let clipname = 'descanso';

		if (d == -1) {
			camera = new three.OrthographicCamera(-4, 4, 4*height/width, -4*height/width, 0.1, 1000);
			camera.position.set(1, 5, 5);
			camera.lookAt(0, 0.5, 0);

			modelpath += "felix olho fechado.glb";

			renderer.domElement.setAttribute('title', 'Rest');
		}
		else {
			if (d == 0) {
				camera = new three.OrthographicCamera(-7, 7, 7*height/width, -7*height/width, 0.1, 1000);
				camera.position.set(30, 25, 30);
				camera.lookAt(0, 4, 0);

				modelpath += "felix.glb";

				renderer.domElement.setAttribute('title', 'BLJ');
			}

			clipname = `${d}`;
		}

		loader.load(modelpath, function (gltf) {
			const model = gltf.scene;
			scene.add(model);

			mixer = new three.AnimationMixer(model);
			const clips = gltf.animations;
			const action = mixer.clipAction(three.AnimationClip.findByName(clips, clipname))
			action.play();

			renderer.setAnimationLoop(animate);
		});
	})

	const c = document.getElementById('content-container');
	c.insertBefore(renderer.domElement, c.firstChild);
}
