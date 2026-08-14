import cors from './node_modules/cors/lib/index.js';
import express from './node_modules/express/index.js';
import path from 'path';

import { setupState, getState } from './state.js';

const animations = {
	'-1': {
		id: 'descanso',
		title: 'Rest',
		openEyes: false,
		blink: false,
		camera: {
			FOV: 4,
			position: {
				x: 1,
				y: 5,
				z: 5
			},
			lookAt: {
				x: 0,
				y: 0.5,
				z: 0
			}
		}
	},
	'0': {
		id: 'blj',
		title: 'Backwards long jump',
		openEyes: true,
		blink: true,
		camera: {
			FOV: 7,
			position: {
				x: 30,
				y: 25,
				z: 30
			},
			lookAt: {
				x: 0,
				y: 4,
				z: 0
			}
		}
	}
}

const n_dances = Object.keys(animations).length-1
const n = 6
const update = 10*60*1000 // 10 minutos

// Configura o estado da dança
setupState(update, n, n_dances)

// Inicializa o backend. A única função dele
// é retornar a dança
const app = express()

app.use(cors({ origin: '*' }))

app.get('/dance', (req, res) => {
	res.status(200).json(animations[getState().toString()])
})
app.listen(3000)
