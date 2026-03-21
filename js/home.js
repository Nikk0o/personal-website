window.onload = (() => {
	setupPicture();
	setupWindow();
	enableDragElement(document.getElementById('top-bar'), document.getElementById('snap-box'));
	enableResizing(
		{
			topLeft: document.getElementById('res-tl'),
			topCenter: document.getElementById('res-tc'),
			topRight: document.getElementById('res-tr'),
			rightCenter: document.getElementById('res-rc'),
			bottomRight: document.getElementById('res-br'),
			bottomCenter: document.getElementById('res-bc'),
			bottomLeft: document.getElementById('res-bl'),
			leftCenter: document.getElementById('res-lc')
		},
		document.getElementById('home-window')
	);

	document.getElementById('top-bar').addEventListener("dblclick",
		() => { toggleFullscreen(document.getElementById("home-window")); });
});


// Set pictures

var picIndex = 0;
var pics = [ '' ];

function setDefaultPic(img) {
	img.src = pics[picIndex];
};

function changePic(img) {
	picIndex = (picIndex + 1) % pics.length;
	img.src = pics[picIndex];
};

function setupPicture() {

	let picFrame = document.getElementById('niko-pic');

	let pic = document.getElementById('pic-pic');
	setDefaultPic(pic);

	let picClickable = document.getElementById('highlight');
	picFrame.addEventListener("click", () => { changePic(pic); });
};


// Set window initial position and dimensions

function setupWindow() {
	let win = document.getElementById('home-window');

	win.style.top = (parseInt(window.innerHeight * 0.05)) + "px";
	win.style.left = (parseInt(window.innerWidth * 0.10)) + "px";
	win.style.width = (parseInt(window.innerWidth * 0.8)) + "px";
	win.style.height = (parseInt(window.innerHeight * 0.9)) + "px";
}


// Drag window

var dragging = false;
var selectedSnapArea = null;

function enableDragElement(element, snapAreaElem) {

	// The last position and mouse displacement, in pixels
	let pos0 = {x: 0, y: 0};
	let dpos = {dx: 0, dy: 0};

	let prnt = element.parentNode;
	element.addEventListener("mousedown", onMouseDown);

	function onMouseDown(ev) {
		ev = ev || window.event;

		pos0 = {x: ev.clientX, y: ev.clientY};
		document.addEventListener("mousemove", dragElement);
		document.addEventListener("mouseup", stopDrag);
	}

	function dragElement(ev) {
		fullscreen = false;
		dragging = true;

		ev = ev || window.event;

		dpos = {dx: pos0.x - ev.clientX, dy: pos0.y - ev.clientY};
		pos0 = {x: ev.clientX, y: ev.clientY};

		let styleTop = prnt.style.top.replace('px', '');
		let styleLeft = prnt.style.left.replace('px', '');

		prnt.style.top = (styleTop - dpos.dy) + "px";
		prnt.style.left = (styleLeft - dpos.dx) + "px";

		if (pos0.x >= window.innerWidth * (0.9)) {
			showSnapArea(snapAreaElem, 'r');
			selectedSnapArea = 'r';
			return;
		}
		else if (pos0.x <= window.innerWidth * (0.1)) {
			showSnapArea(snapAreaElem, 'l');
			selectedSnapArea = 'l';
			return;
		}
		else if (pos0.y <= window.innerHeight * (0.04)) {
			showSnapArea(snapAreaElem, 't');
			selectedSnapArea = 't';
			return;
		}
		else {
			hideSnapArea(snapAreaElem);
			selectedSnapArea = null;
		}
	}

	function stopDrag() {
		document.removeEventListener("mousemove", dragElement);
		document.removeEventListener("mouseup", stopDrag);
		hideSnapArea(snapAreaElem);

		let windowObj = document.getElementById('home-window');
		if (dragging) {
			lastWindowProperties = {
				width: windowObj.style.width,
				height: windowObj.style.height,
				top: windowObj.style.top,
				left: windowObj.style.left
			};
		}

		dragging = false;

		if (selectedSnapArea) {
			snapWindowTo(windowObj, selectedSnapArea);

			selectedSnapArea = null;
		}
	}
}


// Enable window snapping

var fullscreen = false;
var lastWindowProperties = null;

function showSnapArea(areaElement, where) {
	areaElement.style.display = 'block';

	switch(where) {
		case 't':
			areaElement.style.width = '100%';
			areaElement.style.height = '100%';

			areaElement.style.top = '0px';
			areaElement.style.bottom = '';
			break;
		case 'r':
			areaElement.style.width = '20%';
			areaElement.style.height = '100%';

			areaElement.style.right = '0px';
			areaElement.style.left = '';
			break;
		case 'l':
			areaElement.style.width = '20%';
			areaElement.style.height = '100%';

			areaElement.style.right = '';
			areaElement.style.left = '0px';
			break;
	}
};

function hideSnapArea(areaElement) {
	areaElement.style.display = 'none';
};

function snapWindowTo(windowObj, whereTo) {
	lastWindowProperties = {
		width: windowObj.style.width,
		height: windowObj.style.height,
		top: windowObj.style.top,
		left: windowObj.style.left
	};

	switch(whereTo) {
		case 't':
			windowObj.style.width = `${parseInt(0.98*window.innerWidth)}px`;
			windowObj.style.height = `${parseInt(0.98*window.innerHeight)}px`;

			windowObj.style.top = "0px";
			windowObj.style.left = `${parseInt(window.innerWidth * 0.005)}px`;
			fullscreen = true;
			break;
		case 'r':
			windowObj.style.width = `${parseInt(0.49*window.innerWidth)}px`;
			windowObj.style.height = `${parseInt(0.98*window.innerHeight)}px`;

			windowObj.style.top = "0px";
			windowObj.style.left = `${parseInt(window.innerWidth / 2)}px`;
			break;
		case 'l':
			windowObj.style.width = `${parseInt(0.5*window.innerWidth)}px`;
			windowObj.style.height = `${parseInt(0.98*window.innerHeight)}px`;

			windowObj.style.top = "0px";
			windowObj.style.left = "0px";
	}
};

function toggleFullscreen(winObj) {
	if (fullscreen == false) {
		snapWindowTo(winObj, 't');
	}
	else {
		winObj.style.width = lastWindowProperties.width;
		winObj.style.height = lastWindowProperties.height;
		winObj.style.top = lastWindowProperties.top;
		winObj.style.left = lastWindowProperties.left;

		fullscreen = false;
	}
}


// Resize window with cursor

function enableResizing(elements, resizeTarget) {

	let pos0 = null, dpos = null;

	elements.topLeft.addEventListener("mousedown", ((ev) => onMouseDown('tl', ev)));
	elements.topCenter.addEventListener("mousedown", ((ev) => onMouseDown('tc', ev)));
	elements.topRight.addEventListener("mousedown", ((ev) => onMouseDown('tr', ev)));
	elements.rightCenter.addEventListener("mousedown", ((ev) => onMouseDown('rc', ev)));
	elements.bottomRight.addEventListener("mousedown", ((ev) => onMouseDown('br', ev)));
	elements.bottomCenter.addEventListener("mousedown", ((ev) => onMouseDown('bc', ev)));
	elements.bottomLeft.addEventListener("mousedown", ((ev) => onMouseDown('bl', ev)));
	elements.leftCenter.addEventListener("mousedown", ((ev) => onMouseDown('lc', ev)));

	function onMouseDown(direction, ev) {
		pos0 = { x: ev.clientX, y: ev.clientY };
		dpos = { dx: 0, dy: 0};

		document.addEventListener("mousemove", updateMousePos);

		switch(direction) {
			case 'tl':
				document.addEventListener("mousemove", resizeFromLeftSide);
				document.addEventListener("mousemove", resizeFromTopSide);
				break;
			case 'tc':
				document.addEventListener("mousemove", resizeFromTopSide);
				break;
			case 'tr':
				document.addEventListener("mousemove", resizeFromRightSide);
				document.addEventListener("mousemove", resizeFromTopSide);
				break;
			case 'rc':
				document.addEventListener("mousemove", resizeFromRightSide);
				break;
			case 'br':
				document.addEventListener("mousemove", resizeFromRightSide);
				document.addEventListener("mousemove", resizeFromBottomSide);
				break;
			case 'bc':
				document.addEventListener("mousemove", resizeFromBottomSide);
				break;
			case 'bl':
				document.addEventListener("mousemove", resizeFromLeftSide);
				document.addEventListener("mousemove", resizeFromBottomSide);
				break;
			case 'lc':
				document.addEventListener("mousemove", resizeFromLeftSide);
		}

		document.addEventListener("mouseup", onMouseUp);
	}

	function updateMousePos(ev) {
		dpos = { dx: ev.clientX - pos0.x, dy: ev.clientY - pos0.y };
		pos0 = { x: ev.clientX, y: ev.clientY };
	}

	function changeWidth(invert) {
		let width = parseInt(resizeTarget.style.width.replace('px', ''));
		resizeTarget.style.width = (width -(invert ? -dpos.dx : dpos.dx)) + 'px';
	}

	function changeHeight(invert) {
		let height = parseInt(resizeTarget.style.height.replace('px', ''));
		resizeTarget.style.height = (height - (invert ? -dpos.dy : dpos.dy)) + 'px';
	}

	function resizeFromLeftSide(ev) {
		let offsetLeft = parseInt(resizeTarget.style.left.replace('px', ''));
		resizeTarget.style.left = (offsetLeft + dpos.dx) + 'px';

		changeWidth(false);
	}

	function resizeFromRightSide(ev) {
		changeWidth(true);
	}

	function resizeFromTopSide(ev) {
		let offsetTop = parseInt(resizeTarget.style.top.replace('px', ''));
		resizeTarget.style.top = (offsetTop + dpos.dy) + 'px';

		changeHeight(false);
	}

	function resizeFromBottomSide(ev) {
		changeHeight(true);
	}

	function onMouseUp() {
		document.removeEventListener("mousemove", updateMousePos);
		document.removeEventListener("mousemove", resizeFromTopSide);
		document.removeEventListener("mousemove", resizeFromRightSide);
		document.removeEventListener("mousemove", resizeFromBottomSide);
		document.removeEventListener("mousemove", resizeFromLeftSide);

		document.removeEventListener("mouseup", onMouseUp);
	}
};
