import express from 'express';
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

app.get('/dance', (req, res) => {
	res.send(`${getDanceState()}`)
})
app.listen(3000)
