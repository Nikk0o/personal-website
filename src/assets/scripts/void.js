import { enableSelectLang } from "./language.js"

const lang = document.documentElement.lang

window.onload = () => {
	enableSelectLang("lang-select-button", "lang-list")
	document.getElementById(`lang-${lang}`).style.filter = "invert(20%);"
	document.getElementById("current-lang").innerHTML = document.getElementById(`lang-${lang}`).innerHTML
}
