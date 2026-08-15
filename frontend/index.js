import express from 'express';
import path from 'path';

const app = express();

app.get('/', (req, res) => {
	res.sendFile(path.join(import.meta.dirname, './index.html'));
});

app.get('/api/dance', async function f(req, res) {
	fetch('http://localhost:3000/dance')
	.then(async function f(resp) {
		const jsn = await resp.json();
		res.status(200).json(jsn)
	})
})

app.get('/*path', (req, res) => {
	res.sendFile(path.join(import.meta.dirname, req.params.path.join('/')));
});

app.listen(3001);
