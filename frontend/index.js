import express from './node_modules/express/index.js';
import path from 'path';

const app = express();

app.get('/', (req, res) => {
	res.sendFile(path.join(import.meta.dirname, './index.html'));
});

app.get('/*path', (req, res) => {
	res.sendFile(path.join(import.meta.dirname, req.params.path.join('/')));
});

app.listen(3001);
