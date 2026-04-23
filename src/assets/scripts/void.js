import { enableSelectLang } from "./language.js"

const lang = document.documentElement.lang.split('-')[0]

window.onload = () => {
	enableSelectLang("lang-select-button", "lang-list")
}
