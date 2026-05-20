var starbg = null

export function createStars(n, bg) {
	function random(min, max) {
		return min + Math.random() * (max - min)
	}

	function die(ev) {
		this.remove()
	}

	for (let i = 0; i < n; i++) {
		let starSize   = random(1, 3),
			starX      = random(0, 100),
			starY      = random(0, 100),
			rotation   = random(0, 360)

		let starElement = document.createElement('div')
		starElement.style.position = 'relative'
		starElement.style.left = starX + '%'
		starElement.style.top  = starY + '%'
		starElement.style.width = starSize + 'px'
		starElement.style.height = starSize + 'px'
		starElement.style.backgroundColor = '#ffffff'
		starElement.style.transform = `rotate(${rotation}deg)`
		starElement.style.filter = `drop-shadow(0px 0px ${starSize}px white)`

		bg.appendChild(starElement)
	}

	starbg = bg
}

export function showStars() {
	starbg.style.display = 'block'
}

export function hideStars() {
	starbg.style.display = 'none'
}
