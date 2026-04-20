function showExitDropdown(doorsElement) {
	doorsElement.style.display = "block"
	doorsElement.focus() // Talvez tirar isso, pode atrapalhar
	doorsElement.addEventListener("blur", (ev) => { this.style.display = "none" })
}

export function enableExit(exitButton, doors) {
	exitButton.addEventListener("click", (ev) => { showExitDropdown(doors) })
}
