export class Theme {
	constructor(bgColor, txtColor) {
		this.bgColor = bgColor
		this.txtColor = txtColor
	}

	equals(obj) {
		try {
			return obj.bgColor === this.bgColor && obj.txtColor == this.txtColor
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

	if (!sessionStorage.getItem("theme"))
		setTheme("light", buttonObj)
	else
		setTheme(sessionStorage.getItem("theme"), buttonObj)

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
			top: "24px",
			easing: ["ease-out"]
		}
	],
	moveUp = [
		{ //to
			top: "0px",
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

var sunUp = null,
	sunDown = null,
	moonUp = null,
	moonDown = null

function setTheme(theme, buttonObj, animate = false) {
	const currentTheme = getAppliedTheme()

	if (currentTheme.equals(themes[theme]))
		return

	sessionStorage.setItem("theme", theme)

	function change() {
		document.documentElement.style.setProperty("--bg-color", themes[theme].bgColor)
		document.documentElement.style.setProperty("--text-color", themes[theme].txtColor)

		if (theme === "light") {
			document.documentElement.style.setProperty("--sunset-hue-rotate", "0deg")
			document.documentElement.style.setProperty("--sunset-brightness", "250%")
			document.documentElement.style.setProperty("--sunset-hue-rotate0", "-130deg")
			document.documentElement.style.setProperty("--sunset-brightness0", "120%")

			if (animate) {
				moonUp = new Animation(moonUpKeyframes, document.timeline)
				sunDown = new Animation(sunDownKeyframes, document.timeline)

				moonUp.play()
				sunDown.play()

				sun.children[0].setAttribute("fill", "black")
				moon.children[0].setAttribute("fill", "darkblue")
			} else {
				moon.style.top = "0px"
				sun.style.top = "24px"
			}
		}
		else if (theme === "dark") {
			document.documentElement.style.setProperty("--sunset-hue-rotate", "-220deg")
			document.documentElement.style.setProperty("--sunset-brightness", "20%")
			document.documentElement.style.setProperty("--sunset-hue-rotate0", "0deg")
			document.documentElement.style.setProperty("--sunset-brightness0", "90%")

			if (animate) {
				moonDown = new Animation(moonDownKeyframes, document.timeline),
				sunUp = new Animation(sunUpKeyframes, document.timeline)

				moonDown.play()
				sunUp.play()

				sun.children[0].setAttribute("fill", "yellow")
				moon.children[0].setAttribute("fill", "white")
			}
			else {
				moon.style.top = "24px"
				sun.style.top = "0px"
			}
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
