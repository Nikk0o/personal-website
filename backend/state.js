export { setupState, getState };

// Variáveis usadas no algoritmo para
// calcular o estado
var n = 0
var tired_lv = 0
var tired = 0.0
var phi = 2
var state = 0

var n_dances = 0
var dance = 0
var update_interval = 0
var last_update = 0

function setupState(t, N, nd) {
	update_interval = t
	n_dances = nd
	n = N
	tired_lv = n

	function f(x)  { return x**(n+1)-2*x+1 }
	function df(x) { return (n+1)*x**n-2 }

	phi = newtonRaphson(f, df)

	last_update = Date.now()

	console.log("phi: " + phi.toString())
}

// Função que retorna uma dança aleatória entre 0 e
// (n_dances - 1). Se estiver no estado de descanso,
// retorna -1.
function getState() {
	let u = 0.0

	if (Date.now() - last_update > update_interval) {
		u = nextState()
		dance = randomDance(u)

		last_update = Date.now()
	}

	if (state == 1) return -1
	return dance
}

// Atualiza o estado
function nextState() {

	// Variável aleatória uniforme em [0, 1)
	const u = Math.random()

	// tired_lv representa o estado de
	// cansaço. O nível real seria algo
	// como (n-tired_lv).
	//
	// O nível inicializa em n e
	// representa qual é a potência de
	// phi que será adicionada a tired.
	// Isso faz com que o valor de tired
	// incremente menos no começo.
	// O valor de phi é especial porque
	// a soma da PG com n elementos e
	// razão phi resulta em 1. Então,
	// no nível máximo de cansaço, o
	// estado sempre troca.

	let change = false
	if (state == 1) {
		tired -= phi**tired_lv
		if (u > tired)
			change = true
	}
	else {
		tired += phi**tired_lv
		if (u < tired)
			change = true
	}

	if (change) {
		state = 1-state
		tired_lv = n
	}
	else
		tired_lv -= 1

	// Retorna u para aproveitar a variável
	// para gerar uma dança aleatória.
	return u
}

// Função que retorna um índice aleatório para
// dança. Essa função permite que eu altere a
// distribuição das danças sem ter que alterar
// muito código.
function randomDance(u) {
	return Math.floor(u * n_dances)
}

function newtonRaphson(f, df) {
	let xk = 0.49
	let xk_ = 0
	let k = 0

	const er = 0.001
	const kmax = 100
	do {
		const xk_ = xk

		xk -= f(xk)/df(xk)
		k++

		if (isNaN(xk))
			throw new Error("NaN encontrado no Newton-Raphson")
	} while ((xk-xk_)/xk > er && k <= kmax)

	return xk
}
