import { enableExit } from "./exitDropdown.js";

window.onload = () => {
	let exitButton = document.getElementById("exit-button"),
		doorsList = document.getElementById("doors")

	enableExit(exitButton, doorsList)
}
