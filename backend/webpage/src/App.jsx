import InputContainer from './InputContainer.jsx';

export default function App() {

	const userInputs = (
		<>
		<InputContainer
			title='Carregue arquivo'
			warning='Somente arquivos glTF são aceitos, e o arquivo deve conter apenas dados da animação, e não deve conter o modelo que vai ser animado.'
			fields={[
				{ inputType: 'file', accept: '.gltf, .glb', name: 'arquivo' },
				{ inputType: 'checkbox', name: 'Mixamo' }
			]}
		/>
		<InputContainer
			title='Dados da animação'
			fields={[
				{ inputType: 'checkbox', name: 'olhos abertos' },
				{ inputType: 'checkbox', name: 'pisca' }
			]}
		/>
		<InputContainer
			title='Câmera'
			fields={[
				{ inputType: 'checkbox', name: 'ortográfica'},
				{ inputType: 'number', name: 'FOV' },
				{ inputType: 'number', name: 'x' },
				{ inputType: 'number', name: 'y' },
				{ inputType: 'number', name: 'z' }
				// Coloca a rotação dela aqui tbm
			]}
		/>
		</>
	);

	return (
		<div id='content'>
			<div id='renderer'></div>
			<a id='back' href="/"><p>{'<'}</p></a>
			<div id='configs'>
				<h1>Enviar animação</h1>
				<div style={{
					paddingLeft: 70
				}}>
					{userInputs}
				</div>
			</div>
		</div>
	);
}
