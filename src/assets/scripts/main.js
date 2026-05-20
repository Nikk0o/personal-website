import { Theme, setupThemes, getTheme } from "./theme.js"
import { createStars, showStars, hideStars } from "./stars.js"
import { enableSelectLang } from "./language.js"

const lang = document.documentElement.lang.split('-')[0],
      themes = {
		light: new Theme("white", "black"),
		dark: new Theme("#080808", "white")
	  }

window.onload = () => {
	createStars(50, document.getElementById('stars'))
	setupThemes(document.getElementById("theme-changer"), themes)
}
