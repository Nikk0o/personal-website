import { setupScene } from "./scene.js";

const bg_color = window.getComputedStyle(document.body).getPropertyValue('--bg-color')
setupScene(480, 360, "/assets/models/", bg_color)
