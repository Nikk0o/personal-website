import { showStars, hideStars } from "./stars.js"

export class Theme {
	constructor(bgColor, txtColor) {
		this.bgColor = bgColor
		this.txtColor = txtColor
	}

	equals(obj) {
		try {
			return obj.bgColor === this.bgColor && obj.txtColor === this.txtColor
		} catch (e) {
			return false
		}
	}
}

var themes = null

export function setupThemes(buttonObj, themelist) {

	themes = themelist

	const onClick = function (ev) {

		const buttonRect = buttonObj.getBoundingClientRect()
		document.documentElement.style.setProperty("--theme-button-x", buttonRect.x + "px")
		document.documentElement.style.setProperty("--theme-button-y", buttonRect.y + "px")

		if (isTheme("light"))
			setTheme("dark", this, true)
		else if (isTheme("dark"))
			setTheme("light", this, true)
	}

	if (sessionStorage.getItem("theme"))
		setTheme(sessionStorage.getItem("theme"), buttonObj)
	else
		setTheme("light", buttonObj)

	buttonObj.addEventListener("click", onClick)
}

export function getTheme() {
	const storedTheme = sessionStorage.getItem("theme")

	if (storedTheme)
		return themes[storedTheme]
	else {
		return getAppliedTheme()
	}
}

function getAppliedTheme() {
	const styleSheet = window.getComputedStyle(document.documentElement)
	return new Theme(styleSheet.getPropertyValue("--bg-color"), styleSheet.getPropertyValue("--text-color"))
}

function isTheme(theme) {
	if (themes[theme]) return themes[theme].equals(getTheme())
	else return false
}

const moveDown = [
		{ // to
			transform: "translate(0, 5em) rotate(45deg)",
			easing: ["ease-out"]
		}
	],
	moveUp = [
		{ //to
			transform: "translate(0, 0) rotate(45deg)",
			easing: ["ease-out"]
		}
	]

const moon = document.getElementById("moon-icon"),
	  sun  = document.getElementById("sun-icon")

const moonUpKeyframes = new KeyframeEffect(
	moon,
	moveUp,
	{
		easing: "ease-out",
		fill: "forwards",
		duration: 200,
		delay: 200
	}
),
	sunDownKeyframes = new KeyframeEffect(
	sun,
	moveDown,
	{
		easing: "ease-out",
		fill: "forwards",
		duration: 200
	}
),
	sunUpKeyframes = new KeyframeEffect(
	sun,
	moveUp,
	{
		easing: "ease-out",
		fill: "forwards",
		duration: 200,
		delay: 200
	}
),
	moonDownKeyframes = new KeyframeEffect(
	moon,
	moveDown,
	{
		easing: "ease-out",
		fill: "forwards",
		duration: 200
	}
)

function setMoonPhase(moonObj) {
}

function setTheme(theme, buttonObj, animate = false) {
	const currentTheme = getAppliedTheme()

	sessionStorage.setItem("theme", theme)

	function change() {
		document.documentElement.style.setProperty("--bg-color", themes[theme].bgColor)
		document.documentElement.style.setProperty("--text-color", themes[theme].txtColor)

		if (theme === "light") {
			document.documentElement.style.setProperty("--sunset-hue-rotate", "0deg")
			document.documentElement.style.setProperty("--sunset-brightness", "250%")
			document.documentElement.style.setProperty("--sunset-hue-rotate0", "-130deg")
			document.documentElement.style.setProperty("--sunset-brightness0", "120%")
			document.documentElement.style.setProperty("--glow-color", "transparent")
			document.documentElement.style.setProperty("--shadow-color", "black")

			moon.children[1].children[0].setAttribute("fill", "black")
			sun.children[0].setAttribute("fill", "black")

			if (animate) {
				let sunUp = new Animation(sunUpKeyframes, document.timeline)
				let moonDown = new Animation(moonDownKeyframes, document.timeline)

				setTimeout(() => {
					moonDown.play()
					sunUp.play()
				}, 120)

			} else {
				let sunUp = new Animation(new KeyframeEffect(sun, moveUp, { easing: "ease-out", fill: "forwards", duration: 0 }), document.timeline),
					moonDown = new Animation(new KeyframeEffect(moon, moveDown, { easing: "ease-out", fill: "forwards", duration: 0 }), document.timeline)

				sunUp.play()
				moonDown.play()
			}

			hideStars()
		}
		else if (theme === "dark") {
			document.documentElement.style.setProperty("--sunset-hue-rotate", "-150deg")
			document.documentElement.style.setProperty("--sunset-brightness", "20%")
			document.documentElement.style.setProperty("--sunset-hue-rotate0", "0deg")
			document.documentElement.style.setProperty("--sunset-brightness0", "90%")
			document.documentElement.style.setProperty("--glow-color", "white")
			document.documentElement.style.setProperty("--shadow-color", "transparent")

			sun.children[0].setAttribute("fill", "white")
			moon.children[1].children[0].setAttribute("fill", "white")

			if (animate) {
				let moonUp = new Animation(moonUpKeyframes, document.timeline)
				let sunDown = new Animation(sunDownKeyframes, document.timeline)

				setTimeout(() => {
					sunDown.play()
					moonUp.play()
				}, 120)
			}
			else {
				let sunDown = new Animation(new KeyframeEffect(sun, moveDown, { easing: "ease-out", fill: "forwards", duration: 0 }), document.timeline),
					moonUp = new Animation(new KeyframeEffect(moon, moveUp, { easing: "ease-out", fill: "forwards", duration: 0 }), document.timeline)

				sunDown.play()
				moonUp.play()
			}

			showStars()
		}
	}

	if (document.startViewTransition && animate) {
		document.startViewTransition(() => {
			change()
		})
	}
	else
		change()
}
