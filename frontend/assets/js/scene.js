import * as three from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const clock = new three.Clock();

export function setupScene(width, height, modelpath, bg_color) {

	const n = 4;

	const scene = new three.Scene();
	scene.background = new three.Color(bg_color);

	const camera = new three.OrthographicCamera(-n, n, n*height/width, -n*height/width, 0.1, 1000);
	camera.position.set(6, 5, 6);
	camera.lookAt(0, 1.5, 0);

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

	loader.load(modelpath, function (gltf) {
		const model = gltf.scene;
		scene.add(model);

		mixer = new three.AnimationMixer(model);

		const clips = gltf.animations;

		fetch('http://leksu.sh/api/dance')
		.then((response) => {
			if (response.ok)
				return response.json()
			else
				return { id: "-1" }
		})
		.then((jsn) => {
			const d = parseInt(jsn.id, 10)
			if (d == -1) {
				const action = mixer.clipAction(three.AnimationClip.findByName(clips, 'descanso'))
				action.play()
			}
			else if (d < clips.length-1) {
				const action = mixer.clipAction(three.AnimationClip.findByName(clips, `${d}`))
				action.play()
			}
			else
				console.log(`Server returned ${d}, which is an invalid animation number`)
		})
		.catch(console.log)

		function animate(t) {
			requestAnimationFrame(animate);

			const delta = clock.getDelta();
			if (mixer != null)
				mixer.update(delta);
			renderer.render(scene, camera);
		}
		renderer.setAnimationLoop(animate);

	}, undefined, function (err) { console.log(err); });

	document.body.appendChild(renderer.domElement);
}
