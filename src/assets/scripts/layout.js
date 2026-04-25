import { enableSelectLang } from "./language.js"
import { Theme, setupThemes, getTheme } from "./theme.js"

const lang = document.documentElement.lang.split('-')[0],
      themes = {
		light: new Theme("white", "black"),
		dark: new Theme("#080808", "white")
	  }

window.onload = () => {
	enableSelectLang("lang-select-button", "lang-list")
	setupThemes(document.getElementById("theme-changer"), themes)
}
