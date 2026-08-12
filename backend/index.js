import cors from './node_modules/cors';
import express from './node_modules/express';
import path from 'path';

import { setupDanceState, getDanceState } from './danceState.js';

const n = 0
const n_dances = 0
const update = 1000*600 // 10 minutos

// Configura o estado da dança
setupDanceState(update, n, n_dances)

// Inicializa o backend. A única função dele
// é retornar a dança
const app = express()

app.use(cors({ origin: '*' }))

app.get('/api/dance', (req, res) => {
	res.status(200).json({ id: `${getDanceState()}` })
})
app.listen(3000)
