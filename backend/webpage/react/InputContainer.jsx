export default function InputContainer({ title, warning=null, fields }) {

	const fieldComponents = fields.reduce((acc, field) => {
		const acc_in = 'accept' in field;

		acc[0].push(
			<li key={acc[1]} className='field-container'>
				<label style={{ float: 'left', marginRight: 15 }}> {field.name}: </label>
				{ acc_in ?
					<input type={field.inputType} accept={field.accept}></input>
					:
					<input type={field.inputType}></input>
				}
			</li>
		);
		acc[1]++;

		return acc;
	}, [ [], 0 ])[0];

	return (
		<div className='input-container'>
			<h2> {title} </h2>
			{warning ? <div className='warning'> *{warning} </div> : <></>}
			<ul> {fieldComponents} </ul>
		</div>
	);
}
