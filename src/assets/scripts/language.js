export function enableSelectLang(buttonId, selectorId) {
	let button   = document.getElementById(buttonId),
	    selector = document.getElementById(selectorId)

	selector.style.display = "none"

	button.addEventListener("click", (ev) => {
		toggleLangSelector(selector)
	})

	window.addEventListener("click", (ev) => {
		if (!ev.composedPath().includes(button))
			hideLangSelector(selector)
	})
}

function toggleLangSelector(langSelector) {
	if (langSelector.style.display == "none")
		showLangSelector(langSelector)
	else
		hideLangSelector(langSelector)
}

function showLangSelector(langSelector) {
	langSelector.style.display = "block"
}

function hideLangSelector(langSelector) {
	langSelector.style.display = "none"
}
