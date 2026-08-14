export { setupDanceState, getDanceState };

// n representa o número de níveis de cansaço,
// que vai de 0 (mais descansado) a (n-1),
// mais cansado.
var n = 5

// P é um vetor que contém, as probabilidades
// de transição do estado de cansaço i para
// i+1.
var P = []

var state = 0
var last_update = 0
var update_interval = 0
var n_dances = 0

function setupDanceState(t, N, nd) {
	update_interval = t
	n = N
	n_dances = nd

	// Nessa implementação, as probabilidades são
	// p_(n-1) = k
	// p_i = k * (n-i)
	//
	// Uma proproedade da cadeia de markov é que
	// a probabilidade de ir do estado descansado
	// para um estado dançando i é igual e p_i.
	//
	// Então, a soma de todos os p_i = 1
	// => k = 2 / (n*(n+1))
	//
	// p_0 = n*p_(n-1) = 2/(n+1)
	// p_i = p_0 - i*k = p_0 - i*p_0/n = p_0 * (n-i)/n

	const p_0 = 2 / (n+1)
	for (let i = 0; i < n; i++)
		P.push(p_0 * (n-i)/n)

	last_update = Date.now()
}

// Função que retorna uma dança aleatória entre 0 e
// (n_dances - 1). Se estiver no estado de descanso,
// retorna -1.
function getDanceState() {
	let st = state

	if (Date.now() - last_update > update_interval) {
		st = nextState()
		last_update = Date.now()
	}

	if (st == n) return -1
	return randomDance()
}

// Atualiza o estado
function nextState() {

	// Variável aleatória uniforme em [0, 1)
	const u = Math.random()

	// Verifica em qual intervalo u caiu caso
	// o estado seja descanso, e volta para
	// aquele estado.
	if (state == n) {
		let p = 0
		for (let i = 0; i < n; i++)
			if (u < (p += P[i])) {
				state = i
				break
			}

		return state
	}

	let p_i = P[state]

	if (u >= p_i)
		state = n
	else
		state = (state+1) % n

	return state
}

// Função que retorna um índice aleatório para
// dança. Essa função permite que eu altere a
// distribuição das danças sem ter que alterar
// muito código.
function randomDance() {
	const u = Math.random()

	return Math.floor(u * n_dances)
}
